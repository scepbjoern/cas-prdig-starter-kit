'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { antragCreateSchema, type AntragCreateValues } from '@/lib/schemas/antrag'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

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
    defaultValues: { titel: '', beschreibung: '', ...defaultValues },
  })

  const onSubmit = (values: AntragCreateValues) => {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('titel', values.titel)
      if (values.beschreibung) fd.set('beschreibung', values.beschreibung)
      try {
        await action(fd)
        toast.success(mode === 'create' ? 'Antrag erstellt' : 'Antrag gespeichert')
      } catch (err: unknown) {
        // Next.js redirect() throws a special NEXT_REDIRECT error that must reach
        // the React router — re-throw it so navigation works correctly
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
