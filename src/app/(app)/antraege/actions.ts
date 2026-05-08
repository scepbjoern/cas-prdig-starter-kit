'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireSession, requireRole } from '@/lib/auth-helpers'
import { antragCreateSchema, antragUpdateSchema, antragStatusSchema } from '@/lib/schemas/antrag'
import { ANTRAG_STATUS_TRANSITIONS } from '@/lib/antrag-status'
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

  await prisma.antrag.update({ where: { id }, data: { status: 'EINGEREICHT' } })

  revalidatePath('/antraege')
  revalidatePath(`/antraege/${id}`)
}

export async function decideAntrag(id: string, newStatus: AntragStatus) {
  const session = await requireRole(['user_reviewer', 'admin'])

  const parsed = antragStatusSchema.safeParse({ status: newStatus })
  if (!parsed.success) throw new Error('Ungültiger Status')

  const antrag = await prisma.antrag.findUniqueOrThrow({ where: { id } })
  const allowed = ANTRAG_STATUS_TRANSITIONS[antrag.status]
  if (!allowed.includes(newStatus)) {
    throw new Error(`Statuswechsel von ${antrag.status} zu ${newStatus} nicht erlaubt`)
  }

  await prisma.antrag.update({ where: { id }, data: { status: newStatus } })

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
