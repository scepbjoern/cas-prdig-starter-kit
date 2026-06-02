import { requireSession } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { AntragForm } from '@/components/antraege/antrag-form'
import { updateAntrag } from '../../actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function BearbeitenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await requireSession()

  const antrag = await prisma.antrag.findUnique({ where: { id } })
  if (!antrag) notFound()

  const isOwner = antrag.erstellerId === session.user.id
  const isAdmin = session.user.role === 'admin'
  if (!isOwner && !isAdmin) redirect('/antraege')
  if (antrag.status !== 'ENTWURF') redirect(`/antraege/${id}`)

  const action = async (fd: FormData) => {
    'use server'
    await updateAntrag(id, fd)
    redirect(`/antraege/${id}`)
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/antraege/${id}`}>
            <ChevronLeft className="h-4 w-4" />
            Zurück
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Antrag bearbeiten</h1>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <AntragForm
          mode="edit"
          defaultValues={{
            titel: antrag.titel,
            beschreibung: antrag.beschreibung ?? '',
            plzOrt: antrag.plzOrt ?? '',
            kanton: antrag.kanton ?? '',
          }}
          action={action}
        />
      </div>
    </div>
  )
}
