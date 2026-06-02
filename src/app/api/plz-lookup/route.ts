// Proxy-Endpunkt für PLZ- und Ortsnamens-Suche.
// Kapselt den externen API-Call serverseitig und vermeidet CORS-Probleme im Browser.
// Die eigentliche Logik liegt in src/lib/services/plzService.ts.

import { NextResponse } from 'next/server'
import { searchPlz } from '@/lib/services/plzService'

export type { PlzSuggestion } from '@/lib/services/plzService'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() ?? ''

  if (q.length < 2) {
    return NextResponse.json([])
  }

  try {
    const ergebnis = await searchPlz(q)
    return NextResponse.json(ergebnis)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Verbindung zur Ortsdaten-API fehlgeschlagen'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
