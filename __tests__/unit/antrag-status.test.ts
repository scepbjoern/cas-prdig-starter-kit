import { describe, it, expect } from 'vitest'
import { ANTRAG_STATUS_LABEL, ANTRAG_STATUS_TRANSITIONS } from '@/lib/antrag-status'

describe('ANTRAG_STATUS_LABEL', () => {
  it('hat deutsche Labels für alle Status', () => {
    expect(ANTRAG_STATUS_LABEL.ENTWURF).toBeTruthy()
    expect(ANTRAG_STATUS_LABEL.EINGEREICHT).toBeTruthy()
    expect(ANTRAG_STATUS_LABEL.GENEHMIGT).toBeTruthy()
    expect(ANTRAG_STATUS_LABEL.ABGELEHNT).toBeTruthy()
  })
})

describe('ANTRAG_STATUS_TRANSITIONS', () => {
  it('erlaubt Einreichen eines Entwurfs', () => {
    expect(ANTRAG_STATUS_TRANSITIONS.ENTWURF).toContain('EINGEREICHT')
  })

  it('erlaubt Genehmigen eines eingereichten Antrags', () => {
    expect(ANTRAG_STATUS_TRANSITIONS.EINGEREICHT).toContain('GENEHMIGT')
  })

  it('erlaubt Ablehnen eines eingereichten Antrags', () => {
    expect(ANTRAG_STATUS_TRANSITIONS.EINGEREICHT).toContain('ABGELEHNT')
  })

  it('erlaubt keine Übergänge von GENEHMIGT', () => {
    expect(ANTRAG_STATUS_TRANSITIONS.GENEHMIGT).toHaveLength(0)
  })
})
