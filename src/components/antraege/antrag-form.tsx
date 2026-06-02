'use client'

// Formular für neue und bearbeitete Anträge.
// Enthält einen PLZ/Ort-Autocomplete-Block, der intern /api/plz-lookup aufruft.

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { antragCreateSchema, type AntragCreateValues } from '@/lib/schemas/antrag'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { PlzSuggestion } from '@/lib/services/plzService'

interface AntragFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<AntragCreateValues>
  action: (formData: FormData) => Promise<void>
  onCancel?: () => void
}

export function AntragForm({ mode, defaultValues, action, onCancel }: AntragFormProps) {
  const [isPending, startTransition] = useTransition()
  const form = useForm<AntragCreateValues>({
    resolver: zodResolver(antragCreateSchema),
    defaultValues: {
      titel: '',
      beschreibung: '',
      plzOrt: '',
      kanton: '',
      ...defaultValues,
    },
  })

  // Lokaler Zustand für die PLZ/Ort-Suche (kein eigenes Formularfeld)
  const [suchbegriff, setSuchbegriff] = useState(
    defaultValues?.plzOrt
      ? `${defaultValues.plzOrt}${defaultValues.kanton ? ` (${defaultValues.kanton})` : ''}`
      : ''
  )
  const [vorschlaege, setVorschlaege] = useState<PlzSuggestion[]>([])
  const [laedt, setLaedt] = useState(false)
  const [suchFehler, setSuchFehler] = useState<string | null>(null)
  const [dropdownOffen, setDropdownOffen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  // Verhindert einen API-Call direkt nach der Auswahl einer Ortschaft
  const geradAusgewaehlt = useRef(false)

  // Dropdown schliessen bei Klick ausserhalb
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOffen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced API-Aufruf: 300ms nach letzter Eingabe
  useEffect(() => {
    // Kein API-Call wenn der Text gerade durch eine Auswahl gesetzt wurde
    if (geradAusgewaehlt.current) {
      geradAusgewaehlt.current = false
      return
    }

    if (suchbegriff.length < 2) {
      setVorschlaege([])
      setDropdownOffen(false)
      return
    }

    const timer = setTimeout(async () => {
      setLaedt(true)
      setSuchFehler(null)
      try {
        const res = await fetch(`/api/plz-lookup?q=${encodeURIComponent(suchbegriff)}`)
        if (!res.ok) {
          setSuchFehler('Ortsdaten konnten nicht geladen werden.')
          setVorschlaege([])
          return
        }
        const daten: PlzSuggestion[] = await res.json()
        setVorschlaege(daten)
        setDropdownOffen(daten.length > 0)
      } catch {
        setSuchFehler('Verbindungsfehler beim Laden der Ortsdaten.')
        setVorschlaege([])
      } finally {
        setLaedt(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [suchbegriff])

  // Ortschaft aus Dropdown auswählen
  function ortschaftWaehlen(suggestion: PlzSuggestion) {
    form.setValue('plzOrt', suggestion.name)
    form.setValue('kanton', suggestion.canton)
    geradAusgewaehlt.current = true
    setSuchbegriff(`${suggestion.postalCode} ${suggestion.name} (${suggestion.canton})`)
    setVorschlaege([])
    setDropdownOffen(false)
  }

  const onSubmit = (values: AntragCreateValues) => {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('titel', values.titel)
      if (values.beschreibung) fd.set('beschreibung', values.beschreibung)
      if (values.plzOrt) fd.set('plzOrt', values.plzOrt)
      if (values.kanton) fd.set('kanton', values.kanton)
      try {
        await action(fd)
        toast.success(mode === 'create' ? 'Antrag erstellt' : 'Antrag gespeichert')
      } catch (err: unknown) {
        // Next.js redirect() wirft einen speziellen NEXT_REDIRECT-Fehler, der den Router erreichen muss
        if ((err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
        toast.error(err instanceof Error ? err.message : 'Fehler beim Speichern')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="titel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <Input placeholder="Titel des Antrags" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="beschreibung"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beschreibung (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Beschreibe den Antrag..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Adressblock mit PLZ/Ort-Autocomplete */}
        <div className="space-y-2">
          <FormLabel>Ort (optional)</FormLabel>
          <div className="relative" ref={dropdownRef}>
            <Input
              placeholder="PLZ oder Ortsname eingeben..."
              value={suchbegriff}
              onChange={(e) => {
                setSuchbegriff(e.target.value)
                // Auswahl zurücksetzen, wenn der Nutzer den Text ändert
                if (form.getValues('plzOrt')) {
                  form.setValue('plzOrt', '')
                  form.setValue('kanton', '')
                }
              }}
              onFocus={() => vorschlaege.length > 0 && setDropdownOffen(true)}
              autoComplete="off"
            />

            {/* Ladeanzeige */}
            {laedt && (
              <p className="mt-1 text-xs text-muted-foreground">Lädt...</p>
            )}

            {/* Fehlermeldung */}
            {suchFehler && !laedt && (
              <p className="mt-1 text-xs text-destructive">{suchFehler}</p>
            )}

            {/* Dropdown mit Vorschlägen */}
            {dropdownOffen && vorschlaege.length > 0 && (
              <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                <ul className="py-1">
                  {vorschlaege.map((v, i) => (
                    <li key={`${v.postalCode}-${v.name}-${i}`}>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                        onMouseDown={(e) => {
                          // onMouseDown statt onClick verhindert, dass das Input erst den Fokus verliert
                          e.preventDefault()
                          ortschaftWaehlen(v)
                        }}
                      >
                        <span className="font-medium">{v.postalCode}</span>
                        {' '}
                        {v.name}
                        <span className="ml-2 text-muted-foreground">({v.canton})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Gespeicherte Werte für Kanton anzeigen */}
          {form.watch('kanton') && (
            <p className="text-xs text-muted-foreground">
              Kanton: {form.watch('kanton')}
            </p>
          )}
        </div>

        {/* Versteckte Formularfelder – werden über RHF via setValue gesetzt */}
        <input type="hidden" {...form.register('plzOrt')} />
        <input type="hidden" {...form.register('kanton')} />

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Speichern...' : mode === 'create' ? 'Erstellen' : 'Speichern'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
