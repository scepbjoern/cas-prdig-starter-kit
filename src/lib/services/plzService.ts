// Ruft die öffentliche OpenPLZ-API auf und gibt vereinfachte Ortschaftsdaten zurück.
// Wird von /api/plz-lookup/route.ts als Proxy-Endpunkt genutzt.

export interface PlzSuggestion {
  postalCode: string
  name: string
  canton: string
}

interface OpenPlzLocality {
  postalCode: string
  name: string
  canton: { shortName: string; name: string }
}

export async function searchPlz(q: string): Promise<PlzSuggestion[]> {
  const isNumeric = /^\d+$/.test(q)
  const url = isNumeric
    ? `https://openplzapi.org/ch/Localities?postalCode=${encodeURIComponent(q)}&page=1&pageSize=10`
    : `https://openplzapi.org/ch/Localities?name=${encodeURIComponent(q)}&page=1&pageSize=10`

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`OpenPLZ-API antwortete mit Fehler ${response.status}`)
  }

  const daten: OpenPlzLocality[] = await response.json()
  return daten.map((eintrag) => ({
    postalCode: eintrag.postalCode,
    name: eintrag.name,
    canton: eintrag.canton.shortName,
  }))
}
