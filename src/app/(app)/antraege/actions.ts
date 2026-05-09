'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireSession, requireRole } from '@/lib/auth-helpers'
import { antragCreateSchema, antragUpdateSchema, antragStatusSchema, antragUploadSchema } from '@/lib/schemas/antrag'
import { ANTRAG_STATUS_TRANSITIONS } from '@/lib/antrag-status'
import { sendEmail } from '@/lib/services/emailService'
import { antragEingereichtHtml, antragEntschiedenHtml } from '@/lib/emails/templates'
import type { AntragStatus } from '@/generated/prisma/enums'

export async function createAntrag(formData: FormData) {
  const session = await requireRole(['user_applicant', 'admin'])

  const raw = {
    titel: formData.get('titel'),
    beschreibung: formData.get('beschreibung') || undefined,
  }
  const parsed = antragCreateSchema.safeParse(raw)
  if (!parsed.success) throw new Error(parsed.error.message)

  const antrag = await prisma.antrag.create({
    data: {
      ...parsed.data,
      erstellerId: session.user.id,
    },
  })

  revalidatePath('/antraege')
  redirect(`/antraege/${antrag.id}`)
}

export async function updateAntrag(id: string, formData: FormData) {
  const session = await requireSession()

  const antrag = await prisma.antrag.findUniqueOrThrow({ where: { id } })
  if (antrag.status !== 'ENTWURF') throw new Error('Nur Entwürfe können bearbeitet werden')
  if (antrag.erstellerId !== session.user.id && session.user.role !== 'admin') {
    throw new Error('Keine Berechtigung')
  }

  const raw = {
    titel: formData.get('titel'),
    beschreibung: formData.get('beschreibung') || undefined,
  }
  const parsed = antragUpdateSchema.safeParse(raw)
  if (!parsed.success) throw new Error(parsed.error.message)

  await prisma.antrag.update({ where: { id }, data: parsed.data })

  revalidatePath('/antraege')
  revalidatePath(`/antraege/${id}`)
}

export async function submitAntrag(id: string) {
  const session = await requireSession()

  const antrag = await prisma.antrag.findUniqueOrThrow({ where: { id } })
  if (antrag.erstellerId !== session.user.id && session.user.role !== 'admin') {
    throw new Error('Keine Berechtigung')
  }
  if (antrag.status !== 'ENTWURF') throw new Error('Antrag ist nicht im Entwurfsstatus')

  const updated = await prisma.antrag.update({
    where: { id },
    data: { status: 'EINGEREICHT' },
    include: { ersteller: true },
  })

  await sendEmail({
    to: updated.ersteller.email,
    subject: `Antrag eingereicht: ${updated.titel}`,
    html: antragEingereichtHtml({
      antragTitel: updated.titel,
      antragstellerName: updated.ersteller.name,
      antragId: updated.id,
    }),
  })

  revalidatePath('/antraege')
  revalidatePath(`/antraege/${id}`)
}

export async function decideAntrag(id: string, newStatus: AntragStatus) {
  await requireRole(['user_reviewer', 'admin'])

  const parsed = antragStatusSchema.safeParse({ status: newStatus })
  if (!parsed.success) throw new Error('Ungültiger Status')

  const antrag = await prisma.antrag.findUniqueOrThrow({ where: { id } })
  const allowed = ANTRAG_STATUS_TRANSITIONS[antrag.status]
  if (!allowed.includes(newStatus)) {
    throw new Error(`Statuswechsel von ${antrag.status} zu ${newStatus} nicht erlaubt`)
  }

  const updated = await prisma.antrag.update({
    where: { id },
    data: { status: newStatus },
    include: { ersteller: true },
  })

  if (newStatus === 'GENEHMIGT' || newStatus === 'ABGELEHNT') {
    await sendEmail({
      to: updated.ersteller.email,
      subject: `Antrag ${newStatus === 'GENEHMIGT' ? 'genehmigt' : 'abgelehnt'}: ${updated.titel}`,
      html: antragEntschiedenHtml({
        antragTitel: updated.titel,
        antragstellerName: updated.ersteller.name,
        entscheidung: newStatus,
        antragId: updated.id,
      }),
    })
  }

  revalidatePath('/antraege')
  revalidatePath(`/antraege/${id}`)
}

export async function deleteAntrag(id: string) {
  const session = await requireSession()

  const antrag = await prisma.antrag.findUniqueOrThrow({ where: { id } })
  const isOwner = antrag.erstellerId === session.user.id
  const isAdmin = session.user.role === 'admin'

  if (!isAdmin && !(isOwner && antrag.status === 'ENTWURF')) {
    throw new Error('Keine Berechtigung zum Löschen')
  }

  await prisma.antrag.delete({ where: { id } })

  revalidatePath('/antraege')
  redirect('/antraege')
}

export async function uploadAntragDokument(antragId: string, dateiPfad: string, dateiName: string) {
  const session = await requireSession()

  const parsed = antragUploadSchema.safeParse({ dateiPfad, dateiName })
  if (!parsed.success) throw new Error('Ungültige Upload-Daten')

  const antrag = await prisma.antrag.findUniqueOrThrow({ where: { id: antragId } })
  if (session.user.role !== 'admin' && antrag.erstellerId !== session.user.id) {
    throw new Error('Keine Berechtigung')
  }

  await prisma.antrag.update({
    where: { id: antragId },
    data: { dateiPfad, dateiName },
  })

  revalidatePath(`/antraege/${antragId}`)
}
