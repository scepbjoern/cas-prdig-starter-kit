import { describe, it, expect } from 'vitest'
import { antragEingereichtHtml, antragEntschiedenHtml } from '@/lib/emails/templates'

describe('antragEingereichtHtml', () => {
  it('enthält den Antragstitel', () => {
    const html = antragEingereichtHtml({
      antragTitel: 'Mein Antrag',
      antragstellerName: 'Max Mustermann',
      antragId: 'cltest12345678901234',
    })
    expect(html).toContain('Mein Antrag')
  })

  it('enthält den Antragstellernamen', () => {
    const html = antragEingereichtHtml({
      antragTitel: 'Mein Antrag',
      antragstellerName: 'Max Mustermann',
      antragId: 'cltest12345678901234',
    })
    expect(html).toContain('Max Mustermann')
  })

  it('enthält den Link zum Antrag', () => {
    const html = antragEingereichtHtml({
      antragTitel: 'Mein Antrag',
      antragstellerName: 'Max Mustermann',
      antragId: 'cltest12345678901234',
    })
    expect(html).toContain('/antraege/cltest12345678901234')
  })

  it('enthält Status EINGEREICHT', () => {
    const html = antragEingereichtHtml({
      antragTitel: 'Mein Antrag',
      antragstellerName: 'Max Mustermann',
      antragId: 'cltest12345678901234',
    })
    expect(html).toContain('EINGEREICHT')
  })

  it('ist gültiges HTML mit DOCTYPE', () => {
    const html = antragEingereichtHtml({
      antragTitel: 'Test',
      antragstellerName: 'Test',
      antragId: 'cltest12345678901234',
    })
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<html lang="de">')
  })
})

describe('antragEntschiedenHtml', () => {
  it('enthält "genehmigt" bei GENEHMIGT', () => {
    const html = antragEntschiedenHtml({
      antragTitel: 'Mein Antrag',
      antragstellerName: 'Max Mustermann',
      entscheidung: 'GENEHMIGT',
      antragId: 'cltest12345678901234',
    })
    expect(html).toContain('genehmigt')
  })

  it('enthält "abgelehnt" bei ABGELEHNT', () => {
    const html = antragEntschiedenHtml({
      antragTitel: 'Mein Antrag',
      antragstellerName: 'Max Mustermann',
      entscheidung: 'ABGELEHNT',
      antragId: 'cltest12345678901234',
    })
    expect(html).toContain('abgelehnt')
  })

  it('enthält grüne Farbe bei GENEHMIGT', () => {
    const html = antragEntschiedenHtml({
      antragTitel: 'Test',
      antragstellerName: 'Test',
      entscheidung: 'GENEHMIGT',
      antragId: 'cltest12345678901234',
    })
    expect(html).toContain('#16a34a')
  })

  it('enthält rote Farbe bei ABGELEHNT', () => {
    const html = antragEntschiedenHtml({
      antragTitel: 'Test',
      antragstellerName: 'Test',
      entscheidung: 'ABGELEHNT',
      antragId: 'cltest12345678901234',
    })
    expect(html).toContain('#dc2626')
  })

  it('enthält den Antragstellernamen', () => {
    const html = antragEntschiedenHtml({
      antragTitel: 'Mein Antrag',
      antragstellerName: 'Anna Beispiel',
      entscheidung: 'GENEHMIGT',
      antragId: 'cltest12345678901234',
    })
    expect(html).toContain('Anna Beispiel')
  })

  it('enthält den Link zum Antrag', () => {
    const html = antragEntschiedenHtml({
      antragTitel: 'Test',
      antragstellerName: 'Test',
      entscheidung: 'GENEHMIGT',
      antragId: 'cltest12345678901234',
    })
    expect(html).toContain('/antraege/cltest12345678901234')
  })
})
