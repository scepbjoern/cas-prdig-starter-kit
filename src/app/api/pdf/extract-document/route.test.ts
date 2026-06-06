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
  const mod = await import('@/app/api/pdf/extract-document/route')
  POST = mod.POST
})

describe('POST /api/pdf/extract-document', () => {
  it('should return 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)
    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))
    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data.error).toBe('Nicht authentifiziert')
  })

  it('should return 403 when user is applicant and not owner', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'user_applicant', id: 'clxxxxxxxxxxxxx0000000002' } })
    mockFindUnique.mockResolvedValue({ id: 'clxxxxxxxxxxxxx0000000001', erstellerId: 'clxxxxxxxxxxxxx0000000003', dateiPfad: '/uploads/test.pdf' })
    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))
    expect(response.status).toBe(403)
    const data = await response.json()
    expect(data.error).toBe('Keine Berechtigung')
  })

  it('should allow applicant owner to extract their own document', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'user_applicant', id: 'clxxxxxxxxxxxxx0000000001' } })
    mockFindUnique.mockResolvedValue({ id: 'clxxxxxxxxxxxxx0000000001', erstellerId: 'clxxxxxxxxxxxxx0000000001', dateiPfad: '/uploads/test.pdf' })
    mockAskLLM.mockResolvedValue(JSON.stringify({
      verbeistandetePerson: { vorname: 'Anna', nachname: 'Muster' },
      adresse: 'Musterstrasse 1',
      domiziladresse: '',
      verfuegung: 'Beistandschaft gem. Art. XY',
      gesetzesartikel: 'Art. 398 ZGB',
      beistand: { vorname: 'Hans', nachname: 'Meier', telefon: '079 123 45 67' },
      anlageprofil: 'Aktien',
      verfuegungsdatum: '01.06.2026',
      fehlendeAngaben: [],
    }))
    mockUpdate.mockResolvedValue({})

    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.extracted.verbeistandetePerson.vorname).toBe('Anna')
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'clxxxxxxxxxxxxx0000000001' },
      data: { kiAnalyse: expect.any(String) },
    })
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
    mockFindUnique.mockResolvedValue({ id: 'clxxxxxxxxxxxxx0000000001', dateiPfad: null })
    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('Kein Dokument hochgeladen')
  })

  it('should save extracted data to antrag', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'admin' } })
    mockFindUnique.mockResolvedValue({ id: 'clxxxxxxxxxxxxx0000000001', dateiPfad: '/uploads/test.pdf' })
    mockAskLLM.mockResolvedValue('{"verbeistandetePerson":{"vorname":"Anna","nachname":"Muster"},"adresse":"Musterstrasse 1","domiziladresse":"","verfuegung":"Beistandschaft gem. Art. XY","gesetzesartikel":"Art. 398 ZGB","beistand":{"vorname":"Hans","nachname":"Meier","telefon":"079 123 45 67"},"anlageprofil":"Aktien","verfuegungsdatum":"01.06.2026","fehlendeAngaben":[]}')
    mockUpdate.mockResolvedValue({})

    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.extracted.verbeistandetePerson.vorname).toBe('Anna')
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'clxxxxxxxxxxxxx0000000001' },
      data: { kiAnalyse: expect.any(String) },
    })
  })

  it('should return 400 when extraction does not detect a Pflichtdokument', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'admin' } })
    mockFindUnique.mockResolvedValue({ id: 'clxxxxxxxxxxxxx0000000001', dateiPfad: '/uploads/test.pdf' })
    mockAskLLM.mockResolvedValue('{"verbeistandetePerson":{"vorname":"","nachname":""},"adresse":"","domiziladresse":"","verfuegung":"","gesetzesartikel":"","beistand":{"vorname":"","nachname":"","telefon":""},"anlageprofil":"","verfuegungsdatum":"","fehlendeAngaben":["Kein Pflichtdokument erkannt"]}')
    const response = await POST(createMockRequest({ antragId: 'clxxxxxxxxxxxxx0000000001' }))
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('Das hochgeladene Dokument ist kein gültiges Pflichtdokument oder enthält keine erkennbaren Pflichtangaben.')
    expect(mockUpdate).not.toHaveBeenCalled()
  })
})
