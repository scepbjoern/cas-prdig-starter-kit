'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { personSchema, type PersonFormValues } from '@/lib/schemas/person'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface PersonFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<PersonFormValues>
  action: (formData: FormData) => Promise<void>
  onCancel?: () => void
}

export function PersonForm({ mode, defaultValues, action, onCancel }: PersonFormProps) {
  const [isPending, startTransition] = useTransition()
  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: { vorname: '', nachname: '', email: '', telefon: '', adresse: '', ...defaultValues },
  })

  const onSubmit = (values: PersonFormValues) => {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('vorname', values.vorname)
      fd.set('nachname', values.nachname)
      fd.set('email', values.email)
      if (values.telefon) fd.set('telefon', values.telefon)
      if (values.adresse) fd.set('adresse', values.adresse)
      try {
        await action(fd)
        toast.success(mode === 'create' ? 'Person erstellt' : 'Person gespeichert')
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Fehler beim Speichern')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="vorname" render={({ field }) => (
            <FormItem>
              <FormLabel>Vorname</FormLabel>
              <FormControl><Input placeholder="Vorname" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="nachname" render={({ field }) => (
            <FormItem>
              <FormLabel>Nachname</FormLabel>
              <FormControl><Input placeholder="Nachname" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>E-Mail</FormLabel>
            <FormControl><Input type="email" placeholder="name@beispiel.ch" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="telefon" render={({ field }) => (
          <FormItem>
            <FormLabel>Telefon (optional)</FormLabel>
            <FormControl><Input placeholder="+41 79 123 45 67" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="adresse" render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse (optional)</FormLabel>
            <FormControl><Textarea placeholder="Musterstrasse 1, 8000 Zürich" rows={2} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Speichern...' : mode === 'create' ? 'Erstellen' : 'Speichern'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>Abbrechen</Button>
          )}
        </div>
      </form>
    </Form>
  )
}
