import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth-helpers'
import { antragCreateSchema } from '@/lib/schemas/antrag'
import type { Role } from '@/lib/auth-helpers'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
  }

  const role = session.user.role as Role
  const where = role === 'user_applicant' ? { erstellerId: session.user.id } : {}

  const antraege = await prisma.antrag.findMany({
    where,
    include: { ersteller: { select: { name: true, email: true } } },
    orderBy: { erstelltAm: 'desc' },
  })

  return NextResponse.json(antraege)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
  }

  const role = session.user.role as Role
  if (role !== 'user_applicant' && role !== 'admin') {
    return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
  }

  let body: { titel: string; beschreibung?: string }
  try {
    body = antragCreateSchema.parse(await request.json())
  } catch (error: unknown) {
    const zodError = error as { errors?: unknown[] }
    return NextResponse.json(
      { error: 'Ungültige Daten', details: zodError.errors },
      { status: 400 }
    )
  }

  const antrag = await prisma.antrag.create({
    data: { ...body, erstellerId: session.user.id },
  })

  return NextResponse.json(antrag, { status: 201 })
}