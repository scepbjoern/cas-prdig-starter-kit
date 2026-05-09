import { describe, it, expect } from 'vitest'
import { antragIdSchema } from '@/lib/schemas/antrag'

describe('antragIdSchema', () => {
  it('akzeptiert gültige CUID', () => {
    const result = antragIdSchema.safeParse('clxxxxxxxxxxxxxxxxxxxxxx')
    expect(result.success).toBe(true)
  })

  it('lehnt leere ID ab', () => {
    const result = antragIdSchema.safeParse('')
    expect(result.success).toBe(false)
  })

  it('lehnt undefined ab', () => {
    const result = antragIdSchema.safeParse(undefined)
    expect(result.success).toBe(false)
  })
})
