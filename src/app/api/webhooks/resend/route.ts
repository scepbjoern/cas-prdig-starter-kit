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
