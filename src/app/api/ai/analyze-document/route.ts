import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { askLLM, readPdfAsBase64 } from '@/lib/ai'

const analyzeRequestSchema = z.object({
  antragId: z.string().cuid(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    if (!['admin', 'user_reviewer'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    const body = analyzeRequestSchema.safeParse(await request.json())
    if (!body.success) {
      return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 })
    }

    const antrag = await prisma.antrag.findUnique({
      where: { id: body.data.antragId },
      include: { ersteller: true },
    })

    if (!antrag) {
      return NextResponse.json({ error: 'Antrag nicht gefunden' }, { status: 404 })
    }

    if (!antrag.dateiPfad) {
      return NextResponse.json({ error: 'Kein Dokument hochgeladen' }, { status: 400 })
    }

    const { base64: pdfBase64 } = await readPdfAsBase64(antrag.dateiPfad)

    const analyseText = await askLLM({
      systemPrompt: `Du bist ein Experte für die Analyse von Antragsunterlagen in Verwaltungsprozessen.
Deine Aufgabe ist es, hochgeladene Begleitdokumente zu prüfen und strukturiert zusammenzufassen.
Antworte ausschliesslich mit einem validen JSON-Objekt.`,
      prompt: `Analysiere das beigefügte Antragsdokument.
Antrag: "${antrag.titel}"
Beschreibung: "${antrag.beschreibung ?? 'keine Beschreibung'}"
Eingereicht von: ${antrag.ersteller.name}

Erstelle eine Analyse im folgenden JSON-Format:
{
  "zusammenfassung": "2-3 Sätze über den Dokumentinhalt",
  "vollstaendig": true/false,
  "fehlendePunkte": ["Punkt 1", "Punkt 2"],
  "kernpunkte": ["Kernpunkt 1", "Kernpunkt 2", "Kernpunkt 3"],
  "empfehlung": "Genehmigen / Ablehnen / Nachfordern"
}`,
      fileBase64: pdfBase64,
      fileName: antrag.dateiName ?? 'document.pdf',
      maxTokens: 1024,
      temperature: 0.3,
    })

    let analyse
    try {
      const jsonMatch = analyseText.match(/\{[\s\S]*\}/)
      analyse = jsonMatch ? JSON.parse(jsonMatch[0]) : { zusammenfassung: analyseText, vollstaendig: null }
    } catch {
      analyse = { zusammenfassung: analyseText, vollstaendig: null }
    }

    await prisma.antrag.update({
      where: { id: antrag.id },
      data: { kiAnalyse: JSON.stringify(analyse) },
    })

    return NextResponse.json({ analyse })
  } catch (error) {
    console.error('Analyse-Fehler:', error)
    return NextResponse.json({ error: 'Analyse fehlgeschlagen' }, { status: 500 })
  }
}
