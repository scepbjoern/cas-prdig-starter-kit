import { NextRequest, NextResponse } from 'next/server'
import { processIncomingEmail } from '@/lib/services/antragEmailService'

async function verifyWebhookSignature(request: NextRequest): Promise<boolean> {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) return true

  const svixId = request.headers.get('svix-id')
  const svixTimestamp = request.headers.get('svix-timestamp')
  const svixSignature = request.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) return false

  return true
}

// Resend-Webhook-Payload enthält keinen E-Mail-Body – separater API-Aufruf nötig
async function fetchEmailBody(emailId: string): Promise<string> {
  const response = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
  })
  if (!response.ok) return ''
  const email = await response.json()
  return email.text ?? email.html ?? ''
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const isValid = await verifyWebhookSignature(request)
    if (!isValid) {
      return NextResponse.json({ error: 'Ungültige Signatur' }, { status: 401 })
    }

    const payload = JSON.parse(body)
    const { type, data } = payload

    if (type === 'email.received') {
      const emailText = await fetchEmailBody(data.email_id)

      const result = await processIncomingEmail({
        from: data.from,
        subject: data.subject,
        text: emailText,
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
