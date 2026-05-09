import OpenAI from 'openai'
import Together from 'together-ai'

export interface ChatOptions {
  prompt: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
}

function getOpenAIClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY fehlt in .env.local')
  return new OpenAI({ apiKey: key })
}

function getTogetherClient(): Together {
  const key = process.env.TOGETHERAI_API_KEY
  if (!key) throw new Error('TOGETHERAI_API_KEY fehlt in .env.local')
  return new Together({ apiKey: key })
}

async function chatOpenAI(options: ChatOptions): Promise<string> {
  const client = getOpenAIClient()
  const model = process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini'

  const response = await client.chat.completions.create({
    model,
    messages: [
      ...(options.systemPrompt ? [{ role: 'system' as const, content: options.systemPrompt }] : []),
      { role: 'user', content: options.prompt },
    ],
    max_completion_tokens: options.maxTokens ?? 1024,
    temperature: options.temperature ?? 0.7,
  })

  return response.choices[0]?.message?.content ?? ''
}

async function chatTogether(options: ChatOptions): Promise<string> {
  const client = getTogetherClient()
  const model = process.env.TOGETHERAI_CHAT_MODEL ?? 'meta-llama/Llama-3.3-70B-Instruct-Turbo'

  const response = await client.chat.completions.create({
    model,
    messages: [
      ...(options.systemPrompt ? [{ role: 'system' as const, content: options.systemPrompt }] : []),
      { role: 'user', content: options.prompt },
    ],
    max_tokens: options.maxTokens ?? 1024,
    temperature: options.temperature ?? 0.7,
  })

  return response.choices[0]?.message?.content ?? ''
}

export async function askLLM(options: ChatOptions): Promise<string> {
  const provider = process.env.LLM_PROVIDER ?? 'together'
  if (provider === 'openai') return chatOpenAI(options)
  return chatTogether(options)
}

export async function readPdfAsBase64(dateiPfad: string): Promise<{ base64: string; sizeKb: number }> {
  const { readFile } = await import('fs/promises')
  const { join } = await import('path')
  const filePath = join(process.cwd(), 'public', dateiPfad.replace(/^\//, ''))
  const fileBuffer = await readFile(filePath)
  return {
    base64: fileBuffer.toString('base64'),
    sizeKb: Math.round(fileBuffer.length / 1024),
  }
}
