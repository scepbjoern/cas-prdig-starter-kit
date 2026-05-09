import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth-helpers'
import { askLLM } from '@/lib/ai'

const chatRequestSchema = z.object({
  prompt: z.string().min(1).max(2000),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const body = chatRequestSchema.safeParse(await request.json())
    if (!body.success) {
      return NextResponse.json({ error: 'Ungültige Eingabe', details: body.error.issues }, { status: 400 })
    }

    const antwort = await askLLM({
      systemPrompt: `Du bist ein hilfreicher Assistent für Verwaltungsprozesse.
Du hilfst Mitarbeitenden, ihre Antragsformulierungen zu verbessern.
Antworte immer auf Deutsch, präzise und freundlich.`,
      prompt: body.data.prompt,
      maxTokens: 512,
      temperature: 0.7,
    })

    return NextResponse.json({ antwort })
  } catch (error) {
    console.error('LLM-Fehler:', error)
    return NextResponse.json({ error: 'KI-Anfrage fehlgeschlagen' }, { status: 500 })
  }
}
