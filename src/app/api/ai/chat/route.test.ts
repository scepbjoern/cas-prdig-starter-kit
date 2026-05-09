import { describe, it, expect, vi, beforeEach } from 'vitest'

function createMockRequest(body: unknown) {
  return {
    json: () => Promise.resolve(body),
  } as unknown as Request
}

const mockGetSession = vi.fn()
vi.mock('@/lib/auth-helpers', () => ({
  getSession: () => mockGetSession(),
}))

const mockAskLLM = vi.fn()
vi.mock('@/lib/ai', () => ({
  askLLM: (...args: unknown[]) => mockAskLLM(...args),
}))

describe('POST /api/ai/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)
    const { POST } = await import('@/app/api/ai/chat/route')
    const request = createMockRequest({ prompt: 'Test' })
    const response = await POST(request as never)
    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data.error).toBe('Nicht authentifiziert')
  })

  it('should return 400 when prompt is empty', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'user_applicant' } })
    const { POST } = await import('@/app/api/ai/chat/route')
    const request = createMockRequest({ prompt: '' })
    const response = await POST(request as never)
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('Ungültige Eingabe')
  })

  it('should return 400 when prompt exceeds max length', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'user_applicant' } })
    const { POST } = await import('@/app/api/ai/chat/route')
    const request = createMockRequest({ prompt: 'a'.repeat(2001) })
    const response = await POST(request as never)
    expect(response.status).toBe(400)
  })

  it('should return antwort on successful LLM call', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'user_applicant' } })
    mockAskLLM.mockResolvedValue('Verbesserter Text')
    const { POST } = await import('@/app/api/ai/chat/route')
    const request = createMockRequest({ prompt: 'Mein Antrag Text' })
    const response = await POST(request as never)
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.antwort).toBe('Verbesserter Text')
  })

  it('should pass systemPrompt and correct options to askLLM', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'admin' } })
    mockAskLLM.mockResolvedValue('OK')
    const { POST } = await import('@/app/api/ai/chat/route')
    const request = createMockRequest({ prompt: 'Test prompt' })
    await POST(request as never)
    expect(mockAskLLM).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: 'Test prompt',
        systemPrompt: expect.any(String),
        maxTokens: 512,
        temperature: 0.7,
      })
    )
  })

  it('should return 500 when LLM call fails', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'user_applicant' } })
    mockAskLLM.mockRejectedValue(new Error('API Error'))
    const { POST } = await import('@/app/api/ai/chat/route')
    const request = createMockRequest({ prompt: 'Test' })
    const response = await POST(request as never)
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('KI-Anfrage fehlgeschlagen')
  })

  it('should reject non-object body', async () => {
    mockGetSession.mockResolvedValue({ user: { role: 'user_applicant' } })
    const { POST } = await import('@/app/api/ai/chat/route')
    const request = createMockRequest('not an object')
    const response = await POST(request as never)
    expect(response.status).toBe(400)
  })
})
