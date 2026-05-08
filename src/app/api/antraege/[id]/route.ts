import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth-helpers'
import { antragIdSchema, antragUpdateSchema } from '@/lib/schemas/antrag'
import type { Role } from '@/lib/auth-helpers'
import { Prisma } from '@/generated/prisma/client'

async function getValidatedId(params: Promise<{ id: string }>) {
  const { id } = await params
  const result = antragIdSchema.safeParse(id)
  if (!result.success) {
    return { error: NextResponse.json({ error: 'Ungültige ID' }, { status: 400 }), id: null }
  }
  return { error: null, id: result.data }
}

async function getAuthenticatedSession() {
  const session = await getSession()
  if (!session) {
    return { session: null, error: NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 }) }
  }
  return { session, error: null }
}

function handlePrismaError(error: unknown): NextResponse {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
    }
  }
  return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedSession()
  if (!auth.session) return auth.error

  const validated = await getValidatedId(params)
  if (validated.error) return validated.error

  const antrag = await prisma.antrag.findUnique({
    where: { id: validated.id! },
    include: { ersteller: { select: { name: true } } },
  })

  if (!antrag) {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  }

  const role = auth.session.user.role as Role
  if (role === 'user_applicant' && antrag.erstellerId !== auth.session.user.id) {
    return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
  }

  return NextResponse.json(antrag)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedSession()
  if (!auth.session) return auth.error

  const validated = await getValidatedId(params)
  if (validated.error) return validated.error

  const id = validated.id!

  const antrag = await prisma.antrag.findUnique({ where: { id } })
  if (!antrag) {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  }

  const role = auth.session.user.role as Role

  if (role === 'user_reviewer') {
    return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
  }

  if (role === 'user_applicant') {
    if (antrag.erstellerId !== auth.session.user.id) {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }
    if (antrag.status !== 'ENTWURF') {
      return NextResponse.json({ error: 'Nur Entwürfe können bearbeitet werden' }, { status: 403 })
    }
  }

  let body: { titel: string; beschreibung?: string }
  try {
    body = antragUpdateSchema.parse(await request.json())
  } catch (error: unknown) {
    const zodError = error as { errors?: unknown[] }
    return NextResponse.json(
      { error: 'Ungültige Daten', details: zodError.errors },
      { status: 400 }
    )
  }

  try {
    const updated = await prisma.antrag.update({ where: { id }, data: body })
    return NextResponse.json(updated)
  } catch (error) {
    return handlePrismaError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedSession()
  if (!auth.session) return auth.error

  const validated = await getValidatedId(params)
  if (validated.error) return validated.error

  const id = validated.id!

  const antrag = await prisma.antrag.findUnique({ where: { id } })
  if (!antrag) {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  }

  const role = auth.session.user.role as Role

  if (role === 'user_reviewer') {
    return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
  }

  if (role !== 'admin') {
    if (antrag.erstellerId !== auth.session.user.id) {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }
    if (antrag.status !== 'ENTWURF') {
      return NextResponse.json({ error: 'Nur Entwürfe können gelöscht werden' }, { status: 403 })
    }
  }

  try {
    await prisma.antrag.delete({ where: { id } })
    return NextResponse.json({ message: 'Gelöscht' })
  } catch (error) {
    return handlePrismaError(error)
  }
}