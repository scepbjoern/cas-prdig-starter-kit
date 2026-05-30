import { describe, it, expect, vi, beforeEach } from 'vitest'
import { askLLM } from '@/lib/ai'

const mockOpenAICreate = vi.fn().mockResolvedValue({
  choices: [{ message: { content: 'Verbesserter Text von OpenAI' } }],
})

vi.mock('openai', () => {
  return {
    default: class MockOpenAI {
      constructor() {}
      chat = { completions: { create: mockOpenAICreate } }
    },
  }
})

const mockTogetherCreate = vi.fn().mockResolvedValue({
  choices: [{ message: { content: 'Verbesserter Text von Together' } }],
})

vi.mock('together-ai', () => {
  return {
    default: class MockTogether {
      constructor() {}
      chat = { completions: { create: mockTogetherCreate } }
    },
  }
})

describe('askLLM', () => {
  beforeEach(() => {
    mockOpenAICreate.mockClear()
    mockTogetherCreate.mockClear()
    mockOpenAICreate.mockResolvedValue({
      choices: [{ message: { content: 'Verbesserter Text von OpenAI' } }],
    })
    mockTogetherCreate.mockResolvedValue({
      choices: [{ message: { content: 'Verbesserter Text von Together' } }],
    })
  })

  it('should throw if OPENAI_API_KEY is missing when provider is openai', async () => {
    const original = process.env.OPENAI_API_KEY
    delete process.env.OPENAI_API_KEY
    process.env.LLM_PROVIDER = 'openai'

    await expect(askLLM({ prompt: 'test' })).rejects.toThrow('OPENAI_API_KEY fehlt in .env')

    process.env.OPENAI_API_KEY = original
    delete process.env.LLM_PROVIDER
  })

  it('should throw if TOGETHERAI_API_KEY is missing when provider is together', async () => {
    const original = process.env.TOGETHERAI_API_KEY
    delete process.env.TOGETHERAI_API_KEY
    process.env.LLM_PROVIDER = 'together'

    await expect(askLLM({ prompt: 'test' })).rejects.toThrow('TOGETHERAI_API_KEY fehlt in .env')

    process.env.TOGETHERAI_API_KEY = original
    delete process.env.LLM_PROVIDER
  })

  it('should call Together client when LLM_PROVIDER is together', async () => {
    process.env.LLM_PROVIDER = 'together'
    process.env.TOGETHERAI_API_KEY = 'test-key'

    const result = await askLLM({ prompt: 'Hello' })

    expect(result).toBe('Verbesserter Text von Together')
    expect(mockTogetherCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({ role: 'user', content: 'Hello' }),
        ]),
      })
    )

    delete process.env.LLM_PROVIDER
    delete process.env.TOGETHERAI_API_KEY
  })

  it('should call OpenAI client when LLM_PROVIDER is openai', async () => {
    process.env.LLM_PROVIDER = 'openai'
    process.env.OPENAI_API_KEY = 'test-key'

    const result = await askLLM({ prompt: 'Hello' })

    expect(result).toBe('Verbesserter Text von OpenAI')
    expect(mockOpenAICreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({ role: 'user', content: 'Hello' }),
        ]),
      })
    )

    delete process.env.LLM_PROVIDER
    delete process.env.OPENAI_API_KEY
  })

  it('should default to openrouter provider', async () => {
    delete process.env.LLM_PROVIDER
    process.env.OPENROUTER_API_KEY = 'test-key'

    const result = await askLLM({ prompt: 'Hello' })
    expect(result).toBe('Verbesserter Text von OpenAI')
    expect(mockOpenAICreate).toHaveBeenCalled()

    delete process.env.OPENROUTER_API_KEY
  })

  it('should throw if OPENROUTER_API_KEY is missing when provider is openrouter', async () => {
    const original = process.env.OPENROUTER_API_KEY
    delete process.env.OPENROUTER_API_KEY
    process.env.LLM_PROVIDER = 'openrouter'

    await expect(askLLM({ prompt: 'test' })).rejects.toThrow('OPENROUTER_API_KEY fehlt in .env')

    if (original) process.env.OPENROUTER_API_KEY = original
    delete process.env.LLM_PROVIDER
  })

  it('should call OpenRouter client when LLM_PROVIDER is openrouter', async () => {
    process.env.LLM_PROVIDER = 'openrouter'
    process.env.OPENROUTER_API_KEY = 'test-key'

    const result = await askLLM({ prompt: 'Hello' })

    expect(result).toBe('Verbesserter Text von OpenAI')
    expect(mockOpenAICreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({ role: 'user', content: 'Hello' }),
        ]),
      })
    )

    delete process.env.LLM_PROVIDER
    delete process.env.OPENROUTER_API_KEY
  })

  it('should use max_completion_tokens for openrouter provider', async () => {
    process.env.LLM_PROVIDER = 'openrouter'
    process.env.OPENROUTER_API_KEY = 'test-key'

    await askLLM({ prompt: 'Hello', maxTokens: 512 })

    expect(mockOpenAICreate).toHaveBeenCalledWith(
      expect.objectContaining({
        max_completion_tokens: 512,
      })
    )

    delete process.env.LLM_PROVIDER
    delete process.env.OPENROUTER_API_KEY
  })

  it('should pass systemPrompt when provided', async () => {
    process.env.LLM_PROVIDER = 'together'
    process.env.TOGETHERAI_API_KEY = 'test-key'

    await askLLM({ prompt: 'Hello', systemPrompt: 'You are helpful' })

    expect(mockTogetherCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({ role: 'system', content: 'You are helpful' }),
        ]),
      })
    )

    delete process.env.LLM_PROVIDER
    delete process.env.TOGETHERAI_API_KEY
  })

  it('should not include system message when systemPrompt is omitted', async () => {
    process.env.LLM_PROVIDER = 'together'
    process.env.TOGETHERAI_API_KEY = 'test-key'

    await askLLM({ prompt: 'Hello' })

    const callArgs = mockTogetherCreate.mock.calls[0][0]
    const hasSystemMsg = callArgs.messages.some((m: { role: string }) => m.role === 'system')
    expect(hasSystemMsg).toBe(false)

    delete process.env.LLM_PROVIDER
    delete process.env.TOGETHERAI_API_KEY
  })

  it('should use custom maxTokens and temperature', async () => {
    process.env.LLM_PROVIDER = 'together'
    process.env.TOGETHERAI_API_KEY = 'test-key'

    await askLLM({ prompt: 'Hello', maxTokens: 256, temperature: 0.5 })

    expect(mockTogetherCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        max_tokens: 256,
        temperature: 0.5,
      })
    )

    delete process.env.LLM_PROVIDER
    delete process.env.TOGETHERAI_API_KEY
  })

  it('should use default maxTokens and temperature when not provided', async () => {
    process.env.LLM_PROVIDER = 'together'
    process.env.TOGETHERAI_API_KEY = 'test-key'

    await askLLM({ prompt: 'Hello' })

    expect(mockTogetherCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        max_tokens: 1024,
        temperature: 0.7,
      })
    )

    delete process.env.LLM_PROVIDER
    delete process.env.TOGETHERAI_API_KEY
  })

  it('should return empty string when LLM returns no content', async () => {
    process.env.LLM_PROVIDER = 'together'
    process.env.TOGETHERAI_API_KEY = 'test-key'
    mockTogetherCreate.mockResolvedValueOnce({
      choices: [{ message: { content: null } }],
    })

    const result = await askLLM({ prompt: 'Hello' })
    expect(result).toBe('')

    delete process.env.LLM_PROVIDER
    delete process.env.TOGETHERAI_API_KEY
  })

  it('should use max_completion_tokens for OpenAI provider', async () => {
    process.env.LLM_PROVIDER = 'openai'
    process.env.OPENAI_API_KEY = 'test-key'

    await askLLM({ prompt: 'Hello', maxTokens: 512 })

    expect(mockOpenAICreate).toHaveBeenCalledWith(
      expect.objectContaining({
        max_completion_tokens: 512,
      })
    )

    delete process.env.LLM_PROVIDER
    delete process.env.OPENAI_API_KEY
  })
})
