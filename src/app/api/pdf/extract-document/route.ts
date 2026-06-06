import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { askLLM, readPdfAsBase64 } from '@/lib/ai'
import { pdfExtractionSchema } from '@/lib/schemas/antrag'

const extractRequestSchema = z.object({
  antragId: z.string().cuid(),
})

function hasRequiredDocumentFields(data: z.infer<typeof pdfExtractionSchema>) {
  return Boolean(
    data.verbeistandetePerson?.vorname?.trim() ||
      data.verbeistandetePerson?.nachname?.trim() ||
      data.verfuegung?.trim() ||
      data.gesetzesartikel?.trim(),
  )
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const userRole = session.user.role
    if (!['admin', 'user_reviewer', 'user_applicant'].includes(userRole)) {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    const body = extractRequestSchema.safeParse(await request.json())
    if (!body.success) {
      return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 })
    }

    const antrag = await prisma.antrag.findUnique({
      where: { id: body.data.antragId },
    })

    if (!antrag) {
      return NextResponse.json({ error: 'Antrag nicht gefunden' }, { status: 404 })
    }

    if (userRole === 'user_applicant' && antrag.erstellerId !== session.user.id) {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    if (!antrag.dateiPfad) {
      return NextResponse.json({ error: 'Kein Dokument hochgeladen' }, { status: 400 })
    }

    const { base64: pdfBase64, sizeKb } = await readPdfAsBase64(antrag.dateiPfad)

    const analyseText = await askLLM({
      systemPrompt: `Du bist ein Experte für die Analyse von KESB-Beistandschaftsverfügungen im schweizerischen Kontext.
Deine Aufgabe ist es, aus einem PDF-Dokument die relevanten Pflichtangaben der Verfügung zu extrahieren.
Antworte ausschliesslich mit einem validen JSON-Objekt, ohne zusätzlichen Text.`,
      prompt: `Lies das folgende PDF und extrahiere die folgenden Angaben:
- Vor- und Nachname der verbeiständeten Person
- Adresse
- Domiziladresse (falls abweichend)
- Verfügung der Beistandschaft inkl. Gesetzesartikel
- Vor- und Nachname des Beistandes
- Telefonnummer des Beistandes
- Anlageprofil (falls vorhanden)
- Datum der Verfügung

Gib die Antwort im folgenden JSON-Format zurück:
{
  "verbeistandetePerson": { "vorname": "", "nachname": "" },
  "adresse": "",
  "domiziladresse": "",
  "verfuegung": "",
  "gesetzesartikel": "",
  "beistand": { "vorname": "", "nachname": "", "telefon": "" },
  "anlageprofil": "",
  "verfuegungsdatum": "",
  "fehlendeAngaben": []
}

Dokument: ${pdfBase64}
(Der Base64-Inhalt wurde in den Prompt eingebettet; es reicht, wenn du ihn zum Lesen nutzt.)`,
      maxTokens: 1024,
      temperature: 0.2,
    })

    let extracted: unknown = null
    try {
      const jsonMatch = analyseText.match(/\{[\s\S]*\}/)
      extracted = jsonMatch ? JSON.parse(jsonMatch[0]) : null
    } catch {
      extracted = null
    }

    const parsed = pdfExtractionSchema.safeParse(extracted ?? {})
    const defaultResult = {
      verbeistandetePerson: { vorname: '', nachname: '' },
      adresse: '',
      domiziladresse: '',
      verfuegung: '',
      gesetzesartikel: '',
      beistand: { vorname: '', nachname: '', telefon: '' },
      anlageprofil: '',
      verfuegungsdatum: '',
      fehlendeAngaben: [] as string[],
    }
    const result = parsed.success
      ? {
          ...defaultResult,
          ...parsed.data,
          verbeistandetePerson: {
            ...defaultResult.verbeistandetePerson,
            ...parsed.data.verbeistandetePerson,
          },
          beistand: {
            ...defaultResult.beistand,
            ...parsed.data.beistand,
          },
        }
      : defaultResult

    if (!hasRequiredDocumentFields(result)) {
      return NextResponse.json(
        {
          error:
            'Das hochgeladene Dokument ist kein gültiges Pflichtdokument oder enthält keine erkennbaren Pflichtangaben.',
        },
        { status: 400 },
      )
    }

    await prisma.antrag.update({
      where: { id: antrag.id },
      data: { kiAnalyse: JSON.stringify(result) },
    })

    return NextResponse.json({ extracted: result })
  } catch (error) {
    console.error('PDF-Auslese-Fehler:', error)
    return NextResponse.json({ error: 'PDF-Auslesung fehlgeschlagen' }, { status: 500 })
  }
}
