import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export interface SendEmailResult {
  success: boolean
  error?: string
}

export function getEmailRecipient(email: string): string {
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
