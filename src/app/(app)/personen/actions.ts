'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth-helpers'
import { personSchema } from '@/lib/schemas/person'

function parsePersonForm(formData: FormData) {
  const raw = {
    vorname: formData.get('vorname'),
    nachname: formData.get('nachname'),
    email: formData.get('email'),
    telefon: formData.get('telefon') || undefined,
    adresse: formData.get('adresse') || undefined,
  }
  const parsed = personSchema.safeParse(raw)
  if (!parsed.success) throw new Error(parsed.error.message)
  return parsed.data
}

export async function createPerson(formData: FormData) {
  await requireRole(['admin', 'user_reviewer'])
  const data = parsePersonForm(formData)
  const person = await prisma.person.create({ data })
  revalidatePath('/personen')
  redirect(`/personen/${person.id}`)
}

export async function updatePerson(id: string, formData: FormData) {
  await requireRole(['admin', 'user_reviewer'])
  const data = parsePersonForm(formData)
  await prisma.person.update({ where: { id }, data })
  revalidatePath('/personen')
  revalidatePath(`/personen/${id}`)
}

export async function deletePerson(id: string) {
  await requireRole(['admin', 'user_reviewer'])
  await prisma.person.delete({ where: { id } })
  revalidatePath('/personen')
  redirect('/personen')
}
