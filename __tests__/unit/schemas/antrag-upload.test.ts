import { describe, it, expect } from 'vitest'
import { antragUploadSchema } from '@/lib/schemas/antrag'

describe('antragUploadSchema', () => {
  it('akzeptiert gültige Upload-Daten', () => {
    const result = antragUploadSchema.safeParse({
      dateiPfad: '/uploads/123-dokument.pdf',
      dateiName: 'dokument.pdf',
    })
    expect(result.success).toBe(true)
  })

  it('lehnt dateiPfad ohne /uploads/ Prefix ab', () => {
    const result = antragUploadSchema.safeParse({
      dateiPfad: '/other/dokument.pdf',
      dateiName: 'dokument.pdf',
    })
    expect(result.success).toBe(false)
  })

  it('lehnt leeren dateiPfad ab', () => {
    const result = antragUploadSchema.safeParse({
      dateiPfad: '',
      dateiName: 'dokument.pdf',
    })
    expect(result.success).toBe(false)
  })

  it('lehnt leeren dateiName ab', () => {
    const result = antragUploadSchema.safeParse({
      dateiPfad: '/uploads/dokument.pdf',
      dateiName: '',
    })
    expect(result.success).toBe(false)
  })

  it('lehnt fehlenden dateiPfad ab', () => {
    const result = antragUploadSchema.safeParse({
      dateiName: 'dokument.pdf',
    })
    expect(result.success).toBe(false)
  })

  it('lehnt fehlenden dateiName ab', () => {
    const result = antragUploadSchema.safeParse({
      dateiPfad: '/uploads/dokument.pdf',
    })
    expect(result.success).toBe(false)
  })

  it('akzeptiert dateiPfad mit Tiefstrich und Sonderzeichen im Dateinamen', () => {
    const result = antragUploadSchema.safeParse({
      dateiPfad: '/uploads/123-my_file_v2.pdf',
      dateiName: 'my file v2.pdf',
    })
    expect(result.success).toBe(true)
  })
})
