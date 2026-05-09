import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('resend', () => {
  const send = vi.fn().mockResolvedValue({ id: 'email-id' })
  return {
    Resend: class {
      emails = { send }
    },
    __mockSend: send,
  }
})

import { getEmailRecipient, sendEmail } from '@/lib/services/emailService'
import { __mockSend } from 'resend'

describe('getEmailRecipient', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  it('gibt die Original-E-Mail zurück wenn Debug-Modus deaktiviert', () => {
    process.env.EMAIL_DEBUG_MODE = 'false'
    expect(getEmailRecipient('user@example.com')).toBe('user@example.com')
  })

  it('leitet an EMAIL_TEST_ADDRESS um wenn Debug-Modus aktiv', () => {
    process.env.EMAIL_DEBUG_MODE = 'true'
    process.env.EMAIL_TEST_ADDRESS = 'test@example.com'
    expect(getEmailRecipient('user@example.com')).toBe('test@example.com')
  })

  it('fällt auf Original-E-Mail zurück wenn EMAIL_TEST_ADDRESS fehlt', () => {
    process.env.EMAIL_DEBUG_MODE = 'true'
    delete process.env.EMAIL_TEST_ADDRESS
    expect(getEmailRecipient('user@example.com')).toBe('user@example.com')
  })
})

describe('sendEmail', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    process.env.EMAIL_FROM_ADDRESS = 'onboarding@resend.dev'
    process.env.EMAIL_FROM_NAME = 'Test System'
    process.env.EMAIL_DEBUG_MODE = 'false'
    process.env.RESEND_API_KEY = 're_test_key'
    __mockSend.mockResolvedValue({ id: 'email-id' })
  })

  it('gibt success:true zurück bei erfolgreicher Sendung', async () => {
    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
    })
    expect(result.success).toBe(true)
  })

  it('gibt success:false bei Sendefehler zurück', async () => {
    __mockSend.mockRejectedValueOnce(new Error('API Fehler'))

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
    })
    expect(result.success).toBe(false)
    expect(result.error).toBe('API Fehler')
  })

  it('gibt generische Fehlermeldung bei Nicht-Error-Exception zurück', async () => {
    __mockSend.mockRejectedValueOnce('string error')

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
    })
    expect(result.success).toBe(false)
    expect(result.error).toBe('Unbekannter Fehler')
  })
})
