import { describe, it, expect } from 'vitest'
import { extrahiereAntragId, formatNotizEintrag } from '@/lib/services/antragEmailService'
import type { IncomingEmail } from '@/lib/services/antragEmailService'

describe('extrahiereAntragId', () => {
  it('extrahiert ID aus eckigen Klammern [clxxxxxxxxxxxxxxxxxx]', () => {
    expect(extrahiereAntragId('[cltest12345678901234]')).toBe('cltest12345678901234')
  })

  it('extrahiert ID mit Format "Antrag clxxxxxxxxxxxxxxxxxx"', () => {
    expect(extrahiereAntragId('Antrag cltest12345678901234')).toBe('cltest12345678901234')
  })

  it('extrahiert ID mit Format "Antrag: clxxxxxxxxxxxxxxxxxx"', () => {
    expect(extrahiereAntragId('Antrag: cltest12345678901234')).toBe('cltest12345678901234')
  })

  it('gibt null zurück bei fehlender ID', () => {
    expect(extrahiereAntragId('Keine ID hier')).toBeNull()
  })

  it('gibt null zurück bei zu kurzer ID', () => {
    expect(extrahiereAntragId('[clshort]')).toBeNull()
  })

  it('extrahiert ID aus Betreff mit zusätzlichem Text', () => {
    expect(extrahiereAntragId('Re: [cltest12345678901234] Kommentar')).toBe('cltest12345678901234')
  })
})

describe('formatNotizEintrag', () => {
  it('formatiert E-Mail als Notiz-Eintrag mit Absender', () => {
    const email: IncomingEmail = {
      from: 'reviewer@example.com',
      subject: 'Re: Antrag',
      text: 'Sieht gut aus!',
      receivedAt: new Date('2025-01-15T10:30:00Z'),
    }
    const result = formatNotizEintrag(email)
    expect(result).toContain('reviewer@example.com')
    expect(result).toContain('Re: Antrag')
    expect(result).toContain('Sieht gut aus!')
  })

  it('beginnt mit Trennzeile', () => {
    const email: IncomingEmail = {
      from: 'test@test.com',
      subject: 'Test',
      text: 'Inhalt',
      receivedAt: new Date('2025-06-01T12:00:00Z'),
    }
    const result = formatNotizEintrag(email)
    expect(result).toContain('\n---\n')
  })

  it('enthält E-Mail-Text', () => {
    const email: IncomingEmail = {
      from: 'a@b.com',
      subject: 'Betreff',
      text: 'Mein Kommentar zum Antrag',
      receivedAt: new Date('2025-03-20T08:00:00Z'),
    }
    const result = formatNotizEintrag(email)
    expect(result).toContain('Mein Kommentar zum Antrag')
  })
})
