import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { NextRequest } from 'next/server'

function createMockRequest(body: unknown): NextRequest {
  return {
    json: () => Promise.resolve(body),
  } as unknown as NextRequest
}

const mockGetSession = vi.fn()
vi.mock('@/lib/auth-helpers', () => ({
  getSession: () => mockGetSession(),
}))

const mockAskLLM = vi.fn()
const mockReadPdfAsBase64 = vi.fn()
vi.mock('@/lib/ai', () => ({
  askLLM: (...args: unknown[]) => mockAskLLM(...args),
  readPdfAsBase64: (...args: unknown[]) => mockReadPdfAsBase64(...args),
}))

const mockFindUnique = vi.fn()
const mockUpdate = vi.fn()
vi.mock('@/lib/prisma', () => ({
  prisma: {
    antrag: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
  },
}))

let POST: (request: NextRequest) => Promise<Response>

beforeEach(async () => {
  vi.clearAllMocks()
  mockReadPdfAsBase64.mockResolvedValue({ base64: 'ZmFrZS1wZGYtY29udGVudA==', sizeKb: 1 })
  const mod = await import('@/app/api/ai/analyze-document/route')
  POST = mod.POST
})

describe('POST /api/ai/analyze-document', () => {
  it('should return 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)
    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))
    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data.error).toBe('Nicht authentifiziert')
  })

  it('should return 403 when user is applicant', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'user_applicant' } })
    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))
    expect(response.status).toBe(403)
    const data = await response.json()
    expect(data.error).toBe('Keine Berechtigung')
  })

  it('should allow admin to analyze', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'admin' } })
    mockFindUnique.mockResolvedValue({
      id: 'clxxxxxxxxxxxxx0000000001',
      titel: 'Test',
      beschreibung: 'Desc',
      dateiPfad: '/uploads/test.pdf',
      ersteller: { name: 'Max' },
    })
    mockAskLLM.mockResolvedValue('{"zusammenfassung":"Test","vollstaendig":true,"kernpunkte":["K1"],"empfehlung":"Genehmigen"}')
    mockUpdate.mockResolvedValue({})
    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))
    expect(response.status).toBe(200)
  })

  it('should allow reviewer to analyze', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'user_reviewer' } })
    mockFindUnique.mockResolvedValue({
      id: 'clxxxxxxxxxxxxx0000000001',
      titel: 'Test',
      beschreibung: 'Desc',
      dateiPfad: '/uploads/test.pdf',
      ersteller: { name: 'Max' },
    })
    mockAskLLM.mockResolvedValue('{"zusammenfassung":"OK","vollstaendig":true,"kernpunkte":[],"empfehlung":"Genehmigen"}')
    mockUpdate.mockResolvedValue({})
    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))
    expect(response.status).toBe(200)
  })

  it('should return 400 for invalid antragId', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'admin' } })
    const response = await POST(createMockRequest({ antragId: 'not-a-cuid' }))
    expect(response.status).toBe(400)
  })

  it('should return 404 when antrag not found', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'admin' } })
    mockFindUnique.mockResolvedValue(null)
    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))
    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data.error).toBe('Antrag nicht gefunden')
  })

  it('should return 400 when antrag has no document', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'admin' } })
    mockFindUnique.mockResolvedValue({
      id: 'clxxxxxxxxxxxxx0000000001',
      titel: 'Test',
      beschreibung: null,
      dateiPfad: null,
      ersteller: { name: 'Max' },
    })
    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('Kein Dokument hochgeladen')
  })

  it('should parse JSON from LLM response and save to antrag', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'admin' } })
    mockFindUnique.mockResolvedValue({
      id: 'clxxxxxxxxxxxxx0000000001',
      titel: 'Urlaubsantrag',
      beschreibung: 'Urlaub',
      dateiPfad: '/uploads/test.pdf',
      ersteller: { name: 'Max' },
    })
    const llmResult = '{"zusammenfassung":"Ein Urlaubsantrag","vollstaendig":true,"kernpunkte":["Juli"],"empfehlung":"Genehmigen"}'
    mockAskLLM.mockResolvedValue(llmResult)
    mockUpdate.mockResolvedValue({})

    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.analyse.zusammenfassung).toBe('Ein Urlaubsantrag')
    expect(data.analyse.vollstaendig).toBe(true)
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'clxxxxxxxxxxxxx0000000001' },
      data: { kiAnalyse: llmResult },
    })
  })

  it('should handle non-JSON LLM response gracefully', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'admin' } })
    mockFindUnique.mockResolvedValue({
      id: 'clxxxxxxxxxxxxx0000000001',
      titel: 'Test',
      beschreibung: null,
      dateiPfad: '/uploads/test.pdf',
      ersteller: { name: 'Max' },
    })
    mockAskLLM.mockResolvedValue('Dies ist keine JSON-Antwort')
    mockUpdate.mockResolvedValue({})

    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.analyse.zusammenfassung).toBe('Dies ist keine JSON-Antwort')
    expect(data.analyse.vollstaendig).toBeNull()
  })

  it('should handle LLM response with JSON embedded in text', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'admin' } })
    mockFindUnique.mockResolvedValue({
      id: 'clxxxxxxxxxxxxx0000000001',
      titel: 'Test',
      beschreibung: null,
      dateiPfad: '/uploads/test.pdf',
      ersteller: { name: 'Max' },
    })
    mockAskLLM.mockResolvedValue('Hier ist die Analyse:\n{"zusammenfassung":"Test","vollstaendig":false,"fehlendePunkte":["Unterschrift"],"kernpunkte":["K1"]}')
    mockUpdate.mockResolvedValue({})

    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.analyse.zusammenfassung).toBe('Test')
    expect(data.analyse.vollstaendig).toBe(false)
  })

  it('should return 500 when LLM call fails', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'admin' } })
    mockFindUnique.mockResolvedValue({
      id: 'clxxxxxxxxxxxxx0000000001',
      titel: 'Test',
      beschreibung: null,
      dateiPfad: '/uploads/test.pdf',
      ersteller: { name: 'Max' },
    })
    mockAskLLM.mockRejectedValue(new Error('API down'))

    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('Analyse fehlgeschlagen')
  })

  it('should pass correct parameters to readPdfAsBase64', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'admin' } })
    mockFindUnique.mockResolvedValue({
      id: 'clxxxxxxxxxxxxx0000000001',
      titel: 'Test',
      beschreibung: null,
      dateiPfad: '/uploads/test.pdf',
      ersteller: { name: 'Max' },
    })
    mockAskLLM.mockResolvedValue('{"zusammenfassung":"OK","vollstaendig":true}')
    mockUpdate.mockResolvedValue({})

    await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))
    expect(mockReadPdfAsBase64).toHaveBeenCalledWith('/uploads/test.pdf')
  })

  it('should pass antrag metadata to askLLM prompt', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'admin' } })
    mockFindUnique.mockResolvedValue({
      id: 'clxxxxxxxxxxxxx0000000001',
      titel: 'Urlaubsantrag',
      beschreibung: 'Urlaub vom 1.-14. Juli',
      dateiPfad: '/uploads/test.pdf',
      ersteller: { name: 'Hans Müller' },
    })
    mockAskLLM.mockResolvedValue('{"zusammenfassung":"OK","vollstaendig":true}')
    mockUpdate.mockResolvedValue({})

    await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))
    expect(mockAskLLM).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('Urlaubsantrag'),
        temperature: 0.3,
        maxTokens: 1024,
      })
    )
    const callArgs = mockAskLLM.mock.calls[0][0]
    expect(callArgs.prompt).toContain('Hans Müller')
    expect(callArgs.prompt).toContain('Urlaub vom 1.-14. Juli')
  })
})
