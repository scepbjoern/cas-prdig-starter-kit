import { describe, it, expect } from 'vitest'
import { loginSchema } from '@/lib/schemas/auth'

describe('loginSchema', () => {
  it('akzeptiert gültige Anmeldedaten', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'passwort123',
    })
    expect(result.success).toBe(true)
  })

  it('lehnt ungültige E-Mail ab', () => {
    const result = loginSchema.safeParse({ email: 'ungültig', password: 'test' })
    expect(result.success).toBe(false)
  })

  it('lehnt leeres Passwort ab', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '' })
    expect(result.success).toBe(false)
  })
})
