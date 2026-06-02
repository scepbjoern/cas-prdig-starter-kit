// Proxy-Endpunkt für PLZ- und Ortsnamens-Suche via OpenPLZ-API.
// Kapselt den externen API-Call serverseitig und vermeidet CORS-Probleme im Browser.

import { NextResponse } from 'next/server'

// Typ für einen Eintrag aus der OpenPLZ-API
interface OpenPlzLocality {
  postalCode: string
  name: string
  canton: {
    shortName: string
    name: string
  }
}

// Typ für die vereinfachte Antwort an den Client
export interface PlzSuggestion {
  postalCode: string
  name: string
  canton: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() ?? ''

  if (q.length < 2) {
    return NextResponse.json([])
  }

  // Nur Ziffern → PLZ-Suche; sonst Namens-Suche
  const isNumeric = /^\d+$/.test(q)
  const externalUrl = isNumeric
    ? `https://openplzapi.org/ch/Localities?postalCode=${encodeURIComponent(q)}&page=1&pageSize=10`
    : `https://openplzapi.org/ch/Localities?name=${encodeURIComponent(q)}&page=1&pageSize=10`

  let response: Response
  try {
    response = await fetch(externalUrl, {
      headers: { Accept: 'application/json' },
      // Kein Cache: Jede Anfrage soll aktuelle Daten liefern
      cache: 'no-store',
    })
  } catch {
    return NextResponse.json(
      { error: 'Verbindung zur Ortsdaten-API fehlgeschlagen' },
      { status: 502 }
    )
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: `Ortsdaten-API antwortete mit Fehler ${response.status}` },
      { status: 502 }
    )
  }

  const daten: OpenPlzLocality[] = await response.json()

  const ergebnis: PlzSuggestion[] = daten.map((eintrag) => ({
    postalCode: eintrag.postalCode,
    name: eintrag.name,
    canton: eintrag.canton.shortName,
  }))

  return NextResponse.json(ergebnis)
}
