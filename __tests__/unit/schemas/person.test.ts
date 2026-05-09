import { describe, it, expect } from 'vitest'
import { personSchema } from '@/lib/schemas/person'

describe('personSchema', () => {
  it('akzeptiert gültige Person mit Pflichtfeldern', () => {
    const result = personSchema.safeParse({
      vorname: 'Maria',
      nachname: 'Muster',
      email: 'maria@example.com',
    })
    expect(result.success).toBe(true)
  })

  it('akzeptiert Person mit optionalen Feldern', () => {
    const result = personSchema.safeParse({
      vorname: 'Hans',
      nachname: 'Beispiel',
      email: 'hans@example.com',
      telefon: '+41 79 123 45 67',
      adresse: 'Musterstrasse 1',
    })
    expect(result.success).toBe(true)
  })

  it('lehnt ungültige E-Mail ab', () => {
    const result = personSchema.safeParse({
      vorname: 'Test',
      nachname: 'User',
      email: 'keine-email',
    })
    expect(result.success).toBe(false)
  })

  it('lehnt fehlende Pflichtfelder ab', () => {
    const result = personSchema.safeParse({ vorname: 'Nur Vorname' })
    expect(result.success).toBe(false)
  })
})
