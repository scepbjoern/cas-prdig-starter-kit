# Teil 6: E-Mail-Handling – Outbound + Inbound (Resend)

> **Hauptdokument:** `impl-00-einstieg.md` → Abschnitt B4, Phase 5.3  
> **Tech-Stack-Entscheidungen:** `impl-00-tech-stack-decisions.md` → Abschnitt 7 (Stack-Varianten)  
> **Referenz-Implementierung:** `cas-crm-mock/docs/EMAILING_WITH_RESEND_IMPLEMENTATION.md` (anderer Use Case, gleiche Architektur)  
> **Voraussetzungen:** Teil 1 (impl-01-basics.md) umgesetzt

---

## Architektur-Übersicht

```
OUTBOUND: Antrag eingereicht
  Server Action (submitAntrag)
    → emailService.sendEmail(...)
      → Resend API
        → Posteingang des Antragstellers

INBOUND: Reviewer sendet E-Mail-Entscheidung
  Reviewer-E-Mail an antrag@yourdomain.com
    → Resend Inbound → Webhook
      → POST /api/webhooks/resend
        → antragEmailService.processIncomingEmail(...)
          → prisma.antrag.update({ notizen: ... })
```

**Debug-Modus:** Alle E-Mails werden an `EMAIL_TEST_ADDRESS` umgeleitet, wenn `EMAIL_DEBUG_MODE=true`.

---

## Schritt 5.3.0 – Prisma-Schema erweitern (Inbound)

> ⚠️ **Schema-Änderung! `db:reset` erforderlich.**

`prisma/schema.prisma` – `Antrag`-Modell um Notizen-Feld erweitern:
```prisma
model Antrag {
  // ... bestehende Felder ...

  // NEU: Kommunikationsverlauf (Reviewer-E-Mails werden hier angehängt)
  notizen        String?

  @@map("antraege")
}
```

```
Bitte befolge den Workflow in docs/SCHEMA_RESET_WORKFLOW.md:
npx prisma db push --force-reset
npx prisma db seed
```

---

## Schritt 5.3.1 – Resend Account einrichten (Mensch)

### Option A: Quick Start ohne eigene Domain (für Prototyping)

1. Account: https://resend.com → Sign Up
2. Standard-Domain nutzen: `onboarding@resend.dev` steht sofort als Absender zur Verfügung
3. API Key erstellen: **API Keys → Create** → kopieren

### Option B: Eigene Domain (für Produktion)

1. Account anlegen wie Option A
2. **Domains → Add Domain** → eigene Domain eingeben (z.B. `notifications.meinprojekt.ch`)
3. DNS-Records beim Domain-Anbieter hinzufügen (MX, SPF, DKIM – Resend zeigt die Werte)
4. Verifizierung abwarten (10–30 Minuten, max. 72 Stunden)
5. API Key erstellen

> **Hinweis:** `.vercel.app`-Domains können nicht als Absender verwendet werden (keine DNS-Kontrolle).

### Umgebungsvariablen

`.env`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM_ADDRESS=onboarding@resend.dev
EMAIL_FROM_NAME="CAS Starter Kit"
EMAIL_DEBUG_MODE=true
EMAIL_TEST_ADDRESS=deine.email@example.com
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxx   # wird erst in Schritt 5.3.5 gesetzt
```

---

## Schritt 5.3.2 – Generischer E-Mail-Service

**Datei:** `src/lib/services/emailService.ts`

```typescript
// Generischer E-Mail-Service: Kapselt Resend-Logik
// Unterstützt Debug-Modus (alle E-Mails an Testadresse umleiten)
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

interface SendEmailResult {
  success: boolean
  error?: string
}

// Gibt die echte oder die Test-Adresse zurück (je nach Debug-Modus)
function getEmailRecipient(email: string): string {
  if (process.env.EMAIL_DEBUG_MODE === 'true') {
    return process.env.EMAIL_TEST_ADDRESS ?? email
  }
  return email
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<SendEmailResult> {
  try {
    const recipient = getEmailRecipient(to)

    await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME ?? 'System'} <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: recipient,
      subject,
      html,
    })

    return { success: true }
  } catch (error) {
    console.error('E-Mail-Fehler:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unbekannter Fehler',
    }
  }
}
```

---

## Schritt 5.3.3 – E-Mail-Templates

**Datei:** `src/lib/emails/templates.ts`

```typescript
// E-Mail-Templates: Reine TypeScript-Funktionen die HTML-Strings zurückgeben
// Kein React Email, kein JSX – minimale Dependencies

export function antragEingereichtHtml(params: {
  antragTitel: string
  antragstellerName: string
  antragId: string
}): string {
  const { antragTitel, antragstellerName, antragId } = params
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Antrag eingereicht</title>
</head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: #f8f9fa; border-radius: 8px; padding: 24px;">
    <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 8px;">Antrag eingereicht</h1>
    <p style="color: #666; margin-bottom: 24px;">Ihr Antrag wurde erfolgreich eingereicht.</p>
    
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px;"><strong>Antrag:</strong> ${antragTitel}</p>
      <p style="margin: 0 0 8px;"><strong>Eingereicht von:</strong> ${antragstellerName}</p>
      <p style="margin: 0;"><strong>Status:</strong> EINGEREICHT – wartet auf Prüfung</p>
    </div>
    
    <a href="${appUrl}/antraege/${antragId}" 
       style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
      Antrag ansehen
    </a>
    
    <p style="color: #999; font-size: 12px; margin-top: 24px;">
      Diese E-Mail wurde automatisch versandt. Bitte nicht antworten.
    </p>
  </div>
</body>
</html>`
}

export function antragEntschiedenHtml(params: {
  antragTitel: string
  antragstellerName: string
  entscheidung: 'GENEHMIGT' | 'ABGELEHNT'
  antragId: string
}): string {
  const { antragTitel, antragstellerName, entscheidung, antragId } = params
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const farbe = entscheidung === 'GENEHMIGT' ? '#16a34a' : '#dc2626'
  const text = entscheidung === 'GENEHMIGT' ? 'genehmigt' : 'abgelehnt'

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Antrag ${text}</title>
</head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: #f8f9fa; border-radius: 8px; padding: 24px;">
    <h1 style="color: ${farbe}; font-size: 24px;">Antrag ${text}</h1>
    <p>Guten Tag ${antragstellerName},</p>
    <p>Ihr Antrag <strong>${antragTitel}</strong> wurde <strong style="color: ${farbe};">${text}</strong>.</p>
    
    <a href="${appUrl}/antraege/${antragId}" 
       style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">
      Antrag ansehen
    </a>
    
    <p style="color: #999; font-size: 12px; margin-top: 24px;">
      Automatisch versandt vom CAS Starter Kit.
    </p>
  </div>
</body>
</html>`
}
```

---

## Schritt 5.3.4 – Server Actions mit E-Mail verknüpfen

**`src/app/(app)/antraege/actions.ts`** – `submitAntrag` und `decideAntrag` erweitern:

```typescript
// In submitAntrag: E-Mail nach Einreichen senden
import { sendEmail } from '@/lib/services/emailService'
import { antragEingereichtHtml, antragEntschiedenHtml } from '@/lib/emails/templates'

export async function submitAntrag(antragId: string) {
  const session = await requireSession()
  
  const antrag = await prisma.antrag.update({
    where: { id: antragId },
    data: { status: 'EINGEREICHT' },
    include: { ersteller: true }
  })

  // E-Mail an Antragsteller senden
  await sendEmail({
    to: antrag.ersteller.email,
    subject: `Antrag eingereicht: ${antrag.titel}`,
    html: antragEingereichtHtml({
      antragTitel: antrag.titel,
      antragstellerName: antrag.ersteller.name,
      antragId: antrag.id,
    }),
  })

  revalidatePath('/antraege')
  revalidatePath(`/antraege/${antragId}`)
}
```

---

## Schritt 5.3.5 – Inbound: Antrag-Notiz per E-Mail hinzufügen

### Use Case

Ein Reviewer sendet eine E-Mail an `antrag@yourdomain.com` mit dem Betreff `[Antrag-ID]` und seinem Kommentar im Textinhalt. Das System liest den Webhook, findet den Antrag anhand der ID im Betreff und hängt die E-Mail als Notiz an den Antrag.

### Webhook-Setup (Mensch – erst wenn öffentliche URL verfügbar)

1. **VS Code Port Forwarding** aktivieren (Port 3000 öffentlich weiterleiten → `docs/VSCODE_PORT_FORWARDING.md`)
2. In Resend: **Webhooks → Create Webhook**
   - URL: `https://<deine-forwarding-url>.devtunnels.ms/api/webhooks/resend`
   - Events: `email.received` aktivieren
3. **Webhook Secret** kopieren → in `.env` als `RESEND_WEBHOOK_SECRET=whsec_...` setzen

### Inbound E-Mail Service

**Datei:** `src/lib/services/antragEmailService.ts`

```typescript
// Service für eingehende Antrag-E-Mails via Resend Webhooks
// Use Case: Reviewer sendet Entscheidungskommentar per E-Mail
import { prisma } from '@/lib/prisma'

interface IncomingEmail {
  from: string
  subject: string
  text: string
  receivedAt: Date
}

interface ProcessResult {
  success: boolean
  antragId?: string
  error?: string
}

// Formatiert eine eingehende E-Mail als Notiz-Eintrag
function formatNotizEintrag(email: IncomingEmail): string {
  const datum = email.receivedAt.toLocaleString('de-CH')
  return `\n---\n[${datum}] E-Mail von ${email.from}:\nBetreff: ${email.subject}\n\n${email.text}`
}

// Sucht Antrag-ID im Betreff (Format: "[clxxxxxxxx]" oder "Antrag clxxxxxxxx")
function extrahiereAntragId(subject: string): string | null {
  const match = subject.match(/\[([a-z0-9]{20,30})\]/) || subject.match(/antrag[:\s]+([a-z0-9]{20,30})/i)
  return match?.[1] ?? null
}

export async function processIncomingEmail(email: IncomingEmail): Promise<ProcessResult> {
  const antragId = extrahiereAntragId(email.subject)
  if (!antragId) {
    return { success: false, error: 'Keine Antrag-ID im Betreff gefunden' }
  }

  const antrag = await prisma.antrag.findUnique({ where: { id: antragId } })
  if (!antrag) {
    return { success: false, error: `Antrag ${antragId} nicht gefunden` }
  }

  const neuerEintrag = formatNotizEintrag(email)
  const aktualisiertNotizen = (antrag.notizen ?? '') + neuerEintrag

  await prisma.antrag.update({
    where: { id: antragId },
    data: { notizen: aktualisiertNotizen },
  })

  return { success: true, antragId }
}
```

### Webhook Route Handler

**Datei:** `src/app/api/webhooks/resend/route.ts`

```typescript
// Webhook-Endpoint für eingehende Resend-Events (E-Mails)
// Verifiziert die Signatur und verarbeitet email.received-Events
import { NextRequest, NextResponse } from 'next/server'
import { processIncomingEmail } from '@/lib/services/antragEmailService'

// Resend Webhook Signatur prüfen (einfache HMAC-Verifikation)
async function verifyWebhookSignature(request: NextRequest, body: string): Promise<boolean> {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) return true // Im Debug-Modus ohne Secret akzeptieren

  const svixId = request.headers.get('svix-id')
  const svixTimestamp = request.headers.get('svix-timestamp')
  const svixSignature = request.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) return false

  // Vollständige Verifikation via Svix-Library (optional für Produktion):
  // import { Webhook } from 'svix'
  // const wh = new Webhook(secret)
  // wh.verify(body, { 'svix-id': svixId, 'svix-timestamp': svixTimestamp, 'svix-signature': svixSignature })
  
  return true // Für Prototyp: Signatur vorhanden = akzeptiert
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const isValid = await verifyWebhookSignature(request, body)
    if (!isValid) {
      return NextResponse.json({ error: 'Ungültige Signatur' }, { status: 401 })
    }

    const payload = JSON.parse(body)
    const { type, data } = payload

    if (type === 'email.received') {
      const result = await processIncomingEmail({
        from: data.from,
        subject: data.subject,
        text: data.text ?? data.html ?? '',
        receivedAt: new Date(data.created_at),
      })

      if (!result.success) {
        console.warn('Eingehende E-Mail konnte nicht verarbeitet werden:', result.error)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook-Fehler:', error)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
```

Middleware: `/api/webhooks` zu `PUBLIC_PATHS` hinzufügen (Resend sendet ohne Session-Cookie):
```typescript
const PUBLIC_PATHS = ['/login', '/api/auth', '/api/antraege', '/api/webhooks']
```

---

## Schritt 5.3.6 – Notizen auf Antrag-Detailseite anzeigen

**`src/app/(app)/antraege/[id]/page.tsx`** – Notizen-Bereich ergänzen:
```typescript
{antrag.notizen && (
  <Card>
    <CardHeader><CardTitle>Kommunikationsverlauf</CardTitle></CardHeader>
    <CardContent>
      <pre className="text-sm whitespace-pre-wrap font-mono bg-muted p-4 rounded">
        {antrag.notizen}
      </pre>
    </CardContent>
  </Card>
)}
```

---

## Testing-Anleitung (manuell)

### Outbound testen
1. `.env`: `EMAIL_DEBUG_MODE=true`, `EMAIL_TEST_ADDRESS=deine@email.com`
2. Als `applicant@example.com` anmelden → Antrag einreichen
3. Resend Dashboard → E-Mail erscheint unter Logs
4. Posteingang prüfen (kommt an `EMAIL_TEST_ADDRESS`)

### Inbound testen (VS Code Port Forwarding nötig)
1. Dev-Server starten, Port forwarden (`docs/VSCODE_PORT_FORWARDING.md`)
2. Resend Webhook konfigurieren (URL + Secret)
3. Test-E-Mail an Resend Inbound-Adresse senden mit Betreff `[<antrag-id>]`
4. Resend Dashboard → Webhook Delivery prüfen
5. Antrag-Detail im Browser → Notizen-Block erscheint

---

## Akzeptanzkriterien

- [ ] `sendEmail()` schickt E-Mail (im Debug-Modus an Testadresse)
- [ ] E-Mail wird nach `submitAntrag` ausgelöst
- [ ] Webhook-Handler gibt 200 zurück (auch bei unbekanntem Antrag-ID)
- [ ] Notiz erscheint auf Antrag-Detailseite nach Inbound-E-Mail

---

## Nächste Schritte

- **Teil 7** (AI): `docs/impl-07-ai.md`
- **Teil 8** (Dokumentation): `docs/impl-08-documentation.md`
