// Unit-Tests für den Resend-Webhook-Route-Handler
// Testet: Ereignis-Verarbeitung, API-Aufruf für E-Mail-Body, Fehlerbehandlung und Signatur-Prüfung
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/services/antragEmailService', () => ({
  processIncomingEmail: vi.fn(),
}))

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import { POST } from '@/app/api/webhooks/resend/route'
import { processIncomingEmail } from '@/lib/services/antragEmailService'

const mockProcessIncomingEmail = vi.mocked(processIncomingEmail)

const TEST_ANTRAG_ID = 'cltest12345678901234'
const TEST_EMAIL_ID = 'test-email-id-12345'

function createRequest(body: unknown, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('http://localhost/api/webhooks/resend', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

// Payload enthält nur Metadaten – kein text/html (Resend-Verhalten seit neuem API)
function createEmailReceivedPayload(overrides: Record<string, unknown> = {}) {
  return {
    type: 'email.received',
    data: {
      email_id: TEST_EMAIL_ID,
      from: 'reviewer@example.com',
      subject: `[${TEST_ANTRAG_ID}] Kommentar zum Antrag`,
      created_at: '2025-06-01T10:00:00Z',
      ...overrides,
    },
  }
}

function mockResendApi(text: string | null, html: string | null = null, ok = true) {
  mockFetch.mockResolvedValueOnce({
    ok,
    json: async () => ({ text, html }),
  } as Response)
}

describe('POST /api/webhooks/resend', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    process.env.RESEND_API_KEY = 're_test_key'
    delete process.env.RESEND_WEBHOOK_SECRET
    vi.clearAllMocks()
  })

  describe('email.received-Ereignisse', () => {
    it('verarbeitet gültiges email.received-Event und gibt 200 zurück', async () => {
      mockResendApi('Sieht gut aus.')
      mockProcessIncomingEmail.mockResolvedValueOnce({ success: true, antragId: TEST_ANTRAG_ID })

      const request = createRequest(createEmailReceivedPayload())
      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toEqual({ received: true })
      expect(mockProcessIncomingEmail).toHaveBeenCalledOnce()
    })

    it('holt E-Mail-Body via Resend-API und übergibt ihn an processIncomingEmail', async () => {
      mockResendApi('Sieht gut aus, ich genehmige.')
      mockProcessIncomingEmail.mockResolvedValueOnce({ success: true, antragId: TEST_ANTRAG_ID })

      const request = createRequest(createEmailReceivedPayload())
      await POST(request)

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.resend.com/emails/receiving/${TEST_EMAIL_ID}`,
        { headers: { Authorization: 'Bearer re_test_key' } }
      )
      expect(mockProcessIncomingEmail).toHaveBeenCalledWith({
        from: 'reviewer@example.com',
        subject: `[${TEST_ANTRAG_ID}] Kommentar zum Antrag`,
        text: 'Sieht gut aus, ich genehmige.',
        receivedAt: expect.any(Date),
      })
    })

    it('verwendet html als Fallback wenn text in der API-Antwort fehlt', async () => {
      mockResendApi(null, '<p>HTML-Inhalt</p>')
      mockProcessIncomingEmail.mockResolvedValueOnce({ success: true, antragId: TEST_ANTRAG_ID })

      const request = createRequest(createEmailReceivedPayload())
      await POST(request)

      expect(mockProcessIncomingEmail).toHaveBeenCalledWith(
        expect.objectContaining({ text: '<p>HTML-Inhalt</p>' })
      )
    })

    it('übergibt leeren Text wenn API-Aufruf fehlschlägt', async () => {
      mockResendApi(null, null, false)
      mockProcessIncomingEmail.mockResolvedValueOnce({ success: false, error: 'Keine ID' })

      const request = createRequest(createEmailReceivedPayload())
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockProcessIncomingEmail).toHaveBeenCalledWith(
        expect.objectContaining({ text: '' })
      )
    })

    it('gibt 200 zurück auch wenn Antrag-ID nicht gefunden wurde', async () => {
      mockResendApi('Kommentar')
      mockProcessIncomingEmail.mockResolvedValueOnce({
        success: false,
        error: 'Antrag nicht gefunden',
      })

      const request = createRequest(createEmailReceivedPayload())
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(await response.json()).toEqual({ received: true })
    })
  })

  describe('unbekannte Event-Typen', () => {
    it('ignoriert email.delivered und gibt 200 zurück ohne API-Aufruf', async () => {
      const request = createRequest({ type: 'email.delivered', data: {} })
      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toEqual({ received: true })
      expect(mockFetch).not.toHaveBeenCalled()
      expect(mockProcessIncomingEmail).not.toHaveBeenCalled()
    })

    it('ignoriert unbekannte Event-Typen und gibt 200 zurück', async () => {
      const request = createRequest({ type: 'email.bounced', data: {} })
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('Fehlerbehandlung', () => {
    it('gibt 500 bei ungültigem JSON zurück', async () => {
      const request = new NextRequest('http://localhost/api/webhooks/resend', {
        method: 'POST',
        body: 'kein-gültiges-json{',
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json).toEqual({ error: 'Interner Fehler' })
    })
  })

  describe('Signatur-Prüfung', () => {
    it('akzeptiert Request ohne RESEND_WEBHOOK_SECRET (Prototyp-Modus)', async () => {
      delete process.env.RESEND_WEBHOOK_SECRET
      mockResendApi('Text')
      mockProcessIncomingEmail.mockResolvedValueOnce({ success: true, antragId: TEST_ANTRAG_ID })

      const request = createRequest(createEmailReceivedPayload())
      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('lehnt Request ab wenn Secret gesetzt aber Svix-Header fehlen', async () => {
      process.env.RESEND_WEBHOOK_SECRET = 'whsec_testsecret'

      const request = createRequest(createEmailReceivedPayload())
      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(401)
      expect(json).toEqual({ error: 'Ungültige Signatur' })
      expect(mockFetch).not.toHaveBeenCalled()
      expect(mockProcessIncomingEmail).not.toHaveBeenCalled()
    })

    it('akzeptiert Request wenn Secret gesetzt und alle Svix-Header vorhanden', async () => {
      process.env.RESEND_WEBHOOK_SECRET = 'whsec_testsecret'
      mockResendApi('Text')
      mockProcessIncomingEmail.mockResolvedValueOnce({ success: true, antragId: TEST_ANTRAG_ID })

      const request = createRequest(createEmailReceivedPayload(), {
        'svix-id': 'msg_test123',
        'svix-timestamp': '1735000000',
        'svix-signature': 'v1,signature123',
      })
      const response = await POST(request)

      expect(response.status).toBe(200)
    })
  })
})
