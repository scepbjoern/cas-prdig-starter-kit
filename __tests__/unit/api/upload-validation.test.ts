import { describe, it, expect } from 'vitest'

const MAX_SIZE_BYTES = 10 * 1024 * 1024

function validateUploadInput(file: { type: string; size: number } | null, isAuthenticated: boolean) {
  if (!isAuthenticated) return { error: 'Nicht authentifiziert', status: 401 }
  if (!file) return { error: 'Keine Datei übermittelt', status: 400 }
  if (file.type !== 'application/pdf') return { error: 'Nur PDF-Dateien erlaubt', status: 400 }
  if (file.size > MAX_SIZE_BYTES) return { error: 'Datei zu gross (max. 10 MB)', status: 400 }
  return null
}

describe('Upload-Validierung', () => {
  it('lehnt unauthentifizierte Requests ab', () => {
    const result = validateUploadInput({ type: 'application/pdf', size: 1024 }, false)
    expect(result).toEqual({ error: 'Nicht authentifiziert', status: 401 })
  })

  it('lehnt fehlende Datei ab', () => {
    const result = validateUploadInput(null, true)
    expect(result).toEqual({ error: 'Keine Datei übermittelt', status: 400 })
  })

  it('lehnt Nicht-PDF-Dateien ab', () => {
    const result = validateUploadInput({ type: 'image/png', size: 1024 }, true)
    expect(result).toEqual({ error: 'Nur PDF-Dateien erlaubt', status: 400 })
  })

  it('lehnt zu grosse Dateien ab', () => {
    const result = validateUploadInput({ type: 'application/pdf', size: MAX_SIZE_BYTES + 1 }, true)
    expect(result).toEqual({ error: 'Datei zu gross (max. 10 MB)', status: 400 })
  })

  it('akzeptiert gültige PDF-Datei unter 10 MB', () => {
    const result = validateUploadInput({ type: 'application/pdf', size: 1024 }, true)
    expect(result).toBeNull()
  })

  it('akzeptiert PDF-Datei exakt 10 MB', () => {
    const result = validateUploadInput({ type: 'application/pdf', size: MAX_SIZE_BYTES }, true)
    expect(result).toBeNull()
  })
})

describe('Dateinamen-Bereinigung', () => {
  function sanitizeFileName(name: string): string {
    return name.replace(/[^a-zA-Z0-9.-]/g, '_')
  }

  it('ersetzt Leerzeichen durch Unterstriche', () => {
    expect(sanitizeFileName('my document.pdf')).toBe('my_document.pdf')
  })

  it('ersetzt Sonderzeichen durch Unterstriche', () => {
    expect(sanitizeFileName('file (1).pdf')).toBe('file__1_.pdf')
  })

  it('behält alphanumerische Zeichen, Punkte und Bindestriche', () => {
    expect(sanitizeFileName('my-file_v2.pdf')).toBe('my-file_v2.pdf')
  })

  it('ersetzt Umlaute durch Unterstriche', () => {
    expect(sanitizeFileName('änträge.pdf')).toBe('_ntr_ge.pdf')
  })
})
