import { requireSession } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { PersonForm } from '@/components/personen/person-form'
import { updatePerson } from '../actions'
import { DeletePersonButton } from './person-actions'
import type { Role } from '@/lib/auth-helpers'

export default async function PersonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await requireSession()
  const role = session.user.role as Role
  const canWrite = role === 'admin' || role === 'user_reviewer'

  const person = await prisma.person.findUnique({ where: { id } })
  if (!person) notFound()

  const action = async (fd: FormData) => {
    'use server'
    await updatePerson(id, fd)
    redirect(`/personen/${id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/personen"><ChevronLeft className="h-4 w-4" />Zurück</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          {person.vorname} {person.nachname}
        </h1>
      </div>

      {canWrite ? (
        <div className="rounded-lg border bg-card p-6">
          <PersonForm
            mode="edit"
            defaultValues={{
              vorname: person.vorname,
              nachname: person.nachname,
              email: person.email,
              telefon: person.telefon ?? '',
              adresse: person.adresse ?? '',
            }}
            action={action}
          />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <span>E-Mail</span><span>{person.email}</span>
            <span>Telefon</span><span>{person.telefon ?? '–'}</span>
            <span>Adresse</span><span>{person.adresse ?? '–'}</span>
            <span>Erstellt am</span>
            <span>{format(new Date(person.erstelltAm), 'dd.MM.yyyy', { locale: de })}</span>
          </CardContent>
        </Card>
      )}

      {canWrite && (
        <div className="flex gap-2">
          <DeletePersonButton id={person.id} />
        </div>
      )}
    </div>
  )
}
