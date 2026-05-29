# Teil 7: AI-Einsatz – LLM-Chat + Dokumentenanalyse

> **Hauptdokument:** `impl-00-einstieg.md` → Abschnitt B4, Phase 5.2  
> **Tech-Stack-Entscheidungen:** `impl-00-tech-stack-decisions.md` → Abschnitt 6 (übrige Stack-Komponenten)  
> **Technische Referenz:** `cas-crm-mock/docs/LLM_API_IMPLEMENTATION_GUIDE.md` (Use Case 2 + 3 als Vorlage)  
> **Voraussetzungen:** Teil 1 (Basics) umgesetzt; Teil 5 (Dateiupload) für Use Case 2

---

## Übersicht

| Use Case | Feature | API-Route |
|---|---|---|
| 1 | LLM-Demo: Antrag-Text verbessern | `POST /api/ai/chat` |
| 2 | Antrag-Dokument analysieren (PDF) | `POST /api/ai/analyze-document` |

---

## Schritt 5.2.0 – Dependencies + ENV

```bash
npm install openai together-ai
```

> **OpenRouter** benötigt kein eigenes Package – es verwendet das bereits installierte `openai`-Package mit einer anderen `baseURL`.

`.env.local` ergänzen:
```env
# LLM-Provider: 'openrouter', 'together' oder 'openai'
LLM_PROVIDER=openrouter

# OpenRouter (empfohlen für Studierende; https://openrouter.ai/keys)
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_CHAT_MODEL=openai/gpt-4o-mini

# Together.ai (Free Credits; https://api.together.ai/settings/api-keys)
TOGETHERAI_API_KEY=...
TOGETHERAI_CHAT_MODEL=meta-llama/Llama-3.3-70B-Instruct-Turbo

# OpenAI (kostenpflichtig, sofort; https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-...
OPENAI_CHAT_MODEL=gpt-4o-mini
```

> **OpenRouter:** Zugang über bestehende Kurs-Accounts, breite Modellauswahl (OpenAI, Anthropic, Llama, Gemini, …) – ideal für Kursprojekte.  
> **Together.ai Free Tier:** $5 Gratis-Guthaben, kein Zahlungsmittel nötig.  
> **OpenAI:** Sofort verfügbar, aber Zahlungsinformationen nötig.

---

## Schritt 5.2.1 – AI Service Layer

**Datei:** `src/lib/ai.ts`

```typescript
// Zentraler LLM-Service-Layer
// Unterstützt OpenRouter, OpenAI und Together.ai – austauschbar via ENV-Variable LLM_PROVIDER
import OpenAI from 'openai'
import Together from 'together-ai'

interface ChatOptions {
  prompt: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
}

// OpenAI-Client nur bei Bedarf erstellen (spart Initialisierungszeit)
function getOpenAIClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY fehlt in .env.local')
  return new OpenAI({ apiKey: key })
}

function getTogetherClient(): Together {
  const key = process.env.TOGETHERAI_API_KEY
  if (!key) throw new Error('TOGETHERAI_API_KEY fehlt in .env.local')
  return new Together({ apiKey: key })
}

// OpenRouter nutzt das openai-Package mit eigener baseURL – kein eigenes Package nötig
function getOpenRouterClient(): OpenAI {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) throw new Error('OPENROUTER_API_KEY fehlt in .env.local')
  return new OpenAI({
    apiKey: key,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      'X-Title': 'CAS PRDIG Starter Kit',
    },
  })
}

async function chatOpenAI(options: ChatOptions): Promise<string> {
  const client = getOpenAIClient()
  const model = process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini'

  const response = await client.chat.completions.create({
    model,
    messages: [
      ...(options.systemPrompt ? [{ role: 'system' as const, content: options.systemPrompt }] : []),
      { role: 'user', content: options.prompt },
    ],
    max_completion_tokens: options.maxTokens ?? 1024,
    temperature: options.temperature ?? 0.7,
  })

  return response.choices[0]?.message?.content ?? ''
}

async function chatTogether(options: ChatOptions): Promise<string> {
  const client = getTogetherClient()
  const model = process.env.TOGETHERAI_CHAT_MODEL ?? 'meta-llama/Llama-3.3-70B-Instruct-Turbo'

  const response = await client.chat.completions.create({
    model,
    messages: [
      ...(options.systemPrompt ? [{ role: 'system' as const, content: options.systemPrompt }] : []),
      { role: 'user', content: options.prompt },
    ],
    max_tokens: options.maxTokens ?? 1024,
    temperature: options.temperature ?? 0.7,
  })

  return response.choices[0]?.message?.content ?? ''
}

async function chatOpenRouter(options: ChatOptions): Promise<string> {
  const client = getOpenRouterClient()
  const model = process.env.OPENROUTER_CHAT_MODEL ?? 'openai/gpt-4o-mini'

  const response = await client.chat.completions.create({
    model,
    messages: [
      ...(options.systemPrompt ? [{ role: 'system' as const, content: options.systemPrompt }] : []),
      { role: 'user', content: options.prompt },
    ],
    max_completion_tokens: options.maxTokens ?? 1024,
    temperature: options.temperature ?? 0.7,
  })

  return response.choices[0]?.message?.content ?? ''
}

// Hauptfunktion: Provider-Auswahl via ENV
export async function askLLM(options: ChatOptions): Promise<string> {
  const provider = process.env.LLM_PROVIDER ?? 'openrouter'
  if (provider === 'openai') return chatOpenAI(options)
  if (provider === 'openrouter') return chatOpenRouter(options)
  return chatTogether(options)
}
```

---

## Schritt 5.2.2 – Use Case 1: Antrag-Text verbessern (LLM-Demo)

### API Route

**Datei:** `src/app/api/ai/chat/route.ts`

```typescript
// API Route für LLM-Chat: Antrag-Text verbessern
// POST: { prompt: string } → { antwort: string }
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
      return NextResponse.json({ error: 'Ungültige Eingabe', details: body.error.errors }, { status: 400 })
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
```

### Demo-Seite

**Datei:** `src/app/(app)/ai-demo/page.tsx` (Client Component)

```typescript
'use client'
// LLM-Demo-Seite: Antrag-Text eingeben, KI verbessert ihn
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Sparkles } from 'lucide-react'

export default function AiDemoPage() {
  const [eingabe, setEingabe] = useState('')
  const [antwort, setAntwort] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleVerbessern() {
    if (!eingabe.trim()) return
    startTransition(async () => {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Verbessere den folgenden Antrag-Text sprachlich und inhaltlich. 
Mache ihn klarer, professioneller und vollständiger. 
Ursprünglicher Text:\n\n${eingabe}`
        }),
      })
      const data = await response.json()
      setAntwort(data.antwort ?? data.error ?? 'Unbekannter Fehler')
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">KI-Assistent</h1>
        <p className="text-muted-foreground">Antrag-Text mit KI verbessern lassen</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ihr Antrag-Text</CardTitle>
          <CardDescription>Geben Sie Ihren Text ein – die KI formuliert ihn professioneller.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Ich möchte einen Urlaubsantrag stellen weil ich müde bin und meine Familie besuchen will..."
            value={eingabe}
            onChange={(e) => setEingabe(e.target.value)}
            rows={6}
          />
          <Button onClick={handleVerbessern} disabled={isPending || !eingabe.trim()}>
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> KI denkt nach…</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> Text verbessern</>
            )}
          </Button>
        </CardContent>
      </Card>

      {antwort && (
        <Card>
          <CardHeader>
            <CardTitle>Verbesserter Text</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{antwort}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setEingabe(antwort)}
            >
              Übernehmen
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

---

## Schritt 5.2.3 – Use Case 2: Antrag-Dokument analysieren

**Voraussetzung:** Teil 5 (Dateiupload) muss umgesetzt sein – `Antrag.dateiPfad` muss existieren.

**Use Case:** Wenn ein PDF-Dokument zu einem Antrag hochgeladen wurde, kann ein Admin/Reviewer auf Knopfdruck eine KI-Analyse starten. Die KI prüft, ob das Dokument vollständig und relevant ist, und speichert eine strukturierte Zusammenfassung im Antrag.

### Prisma-Schema erweitern

> ⚠️ **Schema-Änderung! `db:reset` erforderlich.**

```prisma
model Antrag {
  // ... bestehende Felder ...

  // NEU: KI-Analyse des hochgeladenen Dokuments
  kiAnalyse      String?  // JSON: { zusammenfassung, vollstaendig, kernpunkte[] }

  @@map("antraege")
}
```

```
Bitte befolge den Workflow in docs/SCHEMA_RESET_WORKFLOW.md:
npx prisma db push --force-reset
npx prisma db seed
```

### API Route für Dokumentenanalyse

**Datei:** `src/app/api/ai/analyze-document/route.ts`

```typescript
// API Route: Hochgeladenes Antrag-PDF mit LLM analysieren
// POST: { antragId: string } → { analyse: { zusammenfassung, vollstaendig, kernpunkte } }
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { getSession } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { askLLM } from '@/lib/ai'

const analyzeRequestSchema = z.object({
  antragId: z.string().cuid(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    // Nur Admin und Reviewer dürfen analysieren
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

    // PDF aus public/uploads/ lesen und als Base64 encodieren
    const filePath = join(process.cwd(), 'public', antrag.dateiPfad.replace(/^\//, ''))
    const fileBuffer = await readFile(filePath)
    const pdfBase64 = fileBuffer.toString('base64')

    // LLM-Analyse: PDF-Inhalt als Text-Beschreibung übergeben
    // Hinweis: Nicht alle Modelle können PDFs direkt lesen – wir übergeben den Kontext als Metadaten
    const analyseText = await askLLM({
      systemPrompt: `Du bist ein Experte für die Analyse von Antragsunterlagen in Verwaltungsprozessen.
Deine Aufgabe ist es, hochgeladene Begleitdokumente zu prüfen und strukturiert zusammenzufassen.
Antworte ausschliesslich mit einem validen JSON-Objekt.`,
      prompt: `Analysiere das folgende Antragsdokument.
Antrag: "${antrag.titel}"
Beschreibung: "${antrag.beschreibung ?? 'keine Beschreibung'}"
Eingereicht von: ${antrag.ersteller.name}
Dokument (Base64-PDF, ${Math.round(fileBuffer.length / 1024)} KB): ${pdfBase64.substring(0, 500)}...

Erstelle eine Analyse im folgenden JSON-Format:
{
  "zusammenfassung": "2-3 Sätze über den Dokumentinhalt",
  "vollstaendig": true/false,
  "fehlendePunkte": ["Punkt 1", "Punkt 2"],
  "kernpunkte": ["Kernpunkt 1", "Kernpunkt 2", "Kernpunkt 3"],
  "empfehlung": "Genehmigen / Ablehnen / Nachfordern"
}`,
      maxTokens: 1024,
      temperature: 0.3,
    })

    // JSON aus LLM-Antwort extrahieren
    let analyse
    try {
      const jsonMatch = analyseText.match(/\{[\s\S]*\}/)
      analyse = jsonMatch ? JSON.parse(jsonMatch[0]) : { zusammenfassung: analyseText, vollstaendig: null }
    } catch {
      analyse = { zusammenfassung: analyseText, vollstaendig: null }
    }

    // Analyse im Antrag speichern
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
```

### Analyse-Button auf Antrag-Detailseite

**Datei:** `src/components/antraege/antrag-analyse-button.tsx` (Client Component)

```typescript
'use client'
// Button zur KI-Analyse des hochgeladenen Antrag-Dokuments
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Brain } from 'lucide-react'
import { toast } from 'sonner'

interface AntragAnalyseButtonProps {
  antragId: string
  onAnalyseComplete?: () => void
}

export function AntragAnalyseButton({ antragId, onAnalyseComplete }: AntragAnalyseButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleAnalyse() {
    startTransition(async () => {
      const response = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ antragId }),
      })

      if (response.ok) {
        toast.success('Dokument erfolgreich analysiert')
        onAnalyseComplete?.()
      } else {
        const data = await response.json()
        toast.error(data.error ?? 'Analyse fehlgeschlagen')
      }
    })
  }

  return (
    <Button variant="outline" onClick={handleAnalyse} disabled={isPending}>
      {isPending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyse läuft…</>
      ) : (
        <><Brain className="mr-2 h-4 w-4" /> Dokument analysieren</>
      )}
    </Button>
  )
}
```

### KI-Analyse auf Detailseite anzeigen

**`src/app/(app)/antraege/[id]/page.tsx`** – Analyse-Ergebnis anzeigen:

```typescript
// Analyse-Daten parsen und darstellen
const kiAnalyse = antrag.kiAnalyse ? JSON.parse(antrag.kiAnalyse) : null

{/* KI-Analyse-Block (nur für Admin/Reviewer sichtbar) */}
{(session.user.role === 'admin' || session.user.role === 'user_reviewer') && antrag.dateiPfad && (
  <Card>
    <CardHeader>
      <CardTitle>KI-Dokumentenanalyse</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {kiAnalyse ? (
        <div className="space-y-3">
          <p className="text-sm">{kiAnalyse.zusammenfassung}</p>
          {kiAnalyse.kernpunkte?.length > 0 && (
            <ul className="text-sm list-disc pl-4 space-y-1">
              {kiAnalyse.kernpunkte.map((p: string, i: number) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
          {kiAnalyse.empfehlung && (
            <p className="text-sm font-medium">Empfehlung: {kiAnalyse.empfehlung}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Noch keine Analyse vorhanden.</p>
      )}
      {/* Analyse-Button als Client Component einbinden */}
      <AntragAnalyseButton antragId={antrag.id} />
    </CardContent>
  </Card>
)}
```

---

## Navigation erweitern

`src/lib/navigation.ts` – KI-Demo-Seite in Navigation aufnehmen:
```typescript
{ href: '/ai-demo', label: 'KI-Assistent', icon: Sparkles, roles: ['admin', 'user_applicant', 'user_reviewer'] }
```

---

## Wichtige API-Unterschiede (GPT-5 vs. ältere Modelle)

> Referenz: `cas-crm-mock/docs/LLM_API_IMPLEMENTATION_GUIDE.md` – Abschnitt «GPT-5 API-Unterschiede»

| Parameter | GPT-4o-mini | GPT-5.1 | o1/o3/o4 |
|---|---|---|---|
| `max_tokens` | ✅ | ❌ | ❌ |
| `max_completion_tokens` | ❌ | ✅ | ✅ |
| `temperature` | ✅ | ✅ | ❌ (nur default) |

Der `ai.ts`-Service verwendet bereits `max_completion_tokens` für OpenAI – damit ist er GPT-5-kompatibel.

---

## Akzeptanzkriterien

- [ ] Use Case 1: KI-Demo-Seite antwortet auf Texteingabe
- [ ] Use Case 2: Analyse-Button erscheint nur für Admin/Reviewer wenn Dokument vorhanden
- [ ] Analyse wird im Antrag gespeichert (in `kiAnalyse`-Feld)
- [ ] `npm run build` fehlerfrei

---

## Nächste Schritte

- **Teil 8** (Dokumentation): `docs/impl-08-documentation.md`
