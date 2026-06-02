import { describe, it, expect } from 'vitest'
import { antragCreateSchema, antragUpdateSchema } from '@/lib/schemas/antrag'

describe('antragCreateSchema', () => {
  it('akzeptiert gültigen Antrag mit Titel', () => {
    const result = antragCreateSchema.safeParse({ titel: 'Mein Antrag' })
    expect(result.success).toBe(true)
  })

  it('akzeptiert Antrag mit Titel und Beschreibung', () => {
    const result = antragCreateSchema.safeParse({
      titel: 'Mein Antrag',
      beschreibung: 'Detaillierte Beschreibung',
    })
    expect(result.success).toBe(true)
  })

  it('akzeptiert Antrag mit PLZ-Ort und Kanton', () => {
    const result = antragCreateSchema.safeParse({
      titel: 'Antrag mit Ort',
      plzOrt: 'Zürich',
      kanton: 'ZH',
    })
    expect(result.success).toBe(true)
  })

  it('akzeptiert Antrag ohne PLZ-Ort (optionales Feld)', () => {
    const result = antragCreateSchema.safeParse({ titel: 'Antrag ohne Ort' })
    expect(result.success).toBe(true)
  })

  it('lehnt leeren Titel ab', () => {
    const result = antragCreateSchema.safeParse({ titel: '' })
    expect(result.success).toBe(false)
  })

  it('lehnt fehlenden Titel ab', () => {
    const result = antragCreateSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('antragUpdateSchema', () => {
  it('akzeptiert partielle Aktualisierung mit Beschreibung', () => {
    const result = antragUpdateSchema.safeParse({ beschreibung: 'Neue Beschreibung' })
    expect(result.success).toBe(false)
  })

  it('akzeptiert vollständige Aktualisierung mit Titel', () => {
    const result = antragUpdateSchema.safeParse({ titel: 'Aktualisierter Titel' })
    expect(result.success).toBe(true)
  })

  it('akzeptiert Aktualisierung mit neuem Ort', () => {
    const result = antragUpdateSchema.safeParse({ titel: 'Titel', plzOrt: 'Bern', kanton: 'BE' })
    expect(result.success).toBe(true)
  })

  it('lehnt leeren Titel ab', () => {
    const result = antragUpdateSchema.safeParse({ titel: '' })
    expect(result.success).toBe(false)
  })
})
