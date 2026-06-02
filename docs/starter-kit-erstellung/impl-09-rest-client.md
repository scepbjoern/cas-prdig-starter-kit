# Teil 9: REST-Client – Externe APIs aufrufen (PLZ-Lookup)

> **Hauptdokument:** `impl-00-einstieg.md`  
> **Nutzungsanleitung für Studierende:** `docs/starter-kit-usage/REST_CLIENT_GUIDE.md`  
> **Voraussetzungen:** Teil 1 (impl-01-basics.md) und Teil 2 (impl-02-rest-api.md) vollständig umgesetzt

---

## Übersicht

| Was | Lösung |
|---|---|
| Externe API | OpenPLZ-API (openplzapi.org) – keine Auth, kein SDK |
| Proxy-Endpunkt | `GET /api/plz-lookup?q=<suchbegriff>` |
| UI | PLZ/Ort-Suchfeld mit Dropdown im Antrag-Formular |
| Debouncing | `useEffect` + `setTimeout` (300ms), kein externes Paket |
| Neue DB-Felder | `plzOrt String?` und `kanton String?` auf `Antrag` |

---

## Schritt 9.0 – Prisma-Schema erweitern

> ⚠️ **Schema-Änderung! `db:reset` erforderlich** – alle bestehenden Daten gehen verloren.

`prisma/schema.prisma` – `Antrag`-Modell erweitern:

```prisma
model Antrag {
  // ... bestehende Felder ...

  plzOrt  String?  // Ortsname (z.B. "Zürich") – aus PLZ-Lookup
  kanton  String?  // Kantonskürzel (z.B. "ZH") – aus PLZ-Lookup
}
```

`prisma/seed.ts` – Demo-Anträge mit Beispielwerten ergänzen (zeigt bewusst optional: dritter Eintrag ohne Ort):

```typescript
await prisma.antrag.createMany({
  data: [
    { titel: 'Urlaubsantrag Juli', ..., plzOrt: 'Zürich',     kanton: 'ZH' },
    { titel: 'Weiterbildungsantrag', ..., plzOrt: 'Winterthur', kanton: 'ZH' },
    { titel: 'Materialbestellung',  ..., plzOrt: null,          kanton: null  },
  ]
})
```

Nach der Schema-Änderung:
```bash
npx prisma generate
npm run db:reset
```

---

## Schritt 9.1 – Zod-Schema erweitern

`src/lib/schemas/antrag.ts`:

```typescript
export const antragCreateSchema = z.object({
  titel: z.string().min(1, 'Titel ist erforderlich').max(200),
  beschreibung: z.string().optional(),
  plzOrt: z.string().max(100).optional(),
  kanton: z.string().max(10).optional(),
})
```

`antragUpdateSchema` bleibt ein Alias auf `antragCreateSchema` – die neuen Felder werden automatisch mitgenommen.

---

## Schritt 9.2 – Service und Proxy-Endpunkt

Die Logik ist auf zwei Dateien aufgeteilt: Der Service kapselt den externen API-Call, der Route Handler ist ein dünner HTTP-Wrapper. Das entspricht dem bereits etablierten Muster im Projekt (`emailService.ts`, `antragEmailService.ts`).

**Datei 1:** `src/lib/services/plzService.ts` (neu erstellen)

```typescript
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
```

**Datei 2:** `src/app/api/plz-lookup/route.ts` (neu erstellen)

```typescript
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
```

**Keine Auth-Prüfung** nötig: Der Endpunkt gibt nur öffentliche Ortsdaten zurück. Die Middleware lässt `/api/...` bereits ohne Session durch.

---

## Schritt 9.3 – Server Actions erweitern

`src/app/(app)/antraege/actions.ts` – `createAntrag` und `updateAntrag` lesen die neuen Felder aus `FormData`:

```typescript
// In createAntrag und updateAntrag jeweils:
const raw = {
  titel: formData.get('titel'),
  beschreibung: formData.get('beschreibung') || undefined,
  plzOrt: formData.get('plzOrt') || undefined,
  kanton: formData.get('kanton') || undefined,
}
```

Prisma schreibt die Felder automatisch – da das Zod-Schema sie enthält, landen sie via `...parsed.data` in `prisma.antrag.create/update`.

---

## Schritt 9.4 – Formular-Komponente erweitern

`src/components/antraege/antrag-form.tsx` – die drei wesentlichen Ergänzungen:

### 4a – Neuer lokaler Zustand für die Suche

```typescript
// Lokaler Zustand: nicht im Formular registriert, nur für UI
const [suchbegriff, setSuchbegriff] = useState(
  defaultValues?.plzOrt
    ? `${defaultValues.plzOrt}${defaultValues.kanton ? ` (${defaultValues.kanton})` : ''}`
    : ''
)
const [vorschlaege, setVorschlaege] = useState<PlzSuggestion[]>([])
const [laedt, setLaedt] = useState(false)
const [suchFehler, setSuchFehler] = useState<string | null>(null)
const [dropdownOffen, setDropdownOffen] = useState(false)
const dropdownRef = useRef<HTMLDivElement>(null)
// Verhindert API-Call direkt nach Auswahl einer Ortschaft
const geradAusgewaehlt = useRef(false)
```

### 4b – Debounced API-Aufruf

```typescript
useEffect(() => {
  // Kein API-Call wenn der Text gerade durch eine Auswahl gesetzt wurde
  if (geradAusgewaehlt.current) {
    geradAusgewaehlt.current = false
    return
  }

  if (suchbegriff.length < 2) {
    setVorschlaege([])
    setDropdownOffen(false)
    return
  }

  const timer = setTimeout(async () => {
    setLaedt(true)
    setSuchFehler(null)
    try {
      const res = await fetch(`/api/plz-lookup?q=${encodeURIComponent(suchbegriff)}`)
      if (!res.ok) {
        setSuchFehler('Ortsdaten konnten nicht geladen werden.')
        return
      }
      const daten: PlzSuggestion[] = await res.json()
      setVorschlaege(daten)
      setDropdownOffen(daten.length > 0)
    } catch {
      setSuchFehler('Verbindungsfehler beim Laden der Ortsdaten.')
    } finally {
      setLaedt(false)
    }
  }, 300)

  return () => clearTimeout(timer)
}, [suchbegriff])
```

### 4c – Auswahl-Handler und versteckte Formularfelder

```typescript
function ortschaftWaehlen(suggestion: PlzSuggestion) {
  form.setValue('plzOrt', suggestion.name)
  form.setValue('kanton', suggestion.canton)
  geradAusgewaehlt.current = true
  setSuchbegriff(`${suggestion.postalCode} ${suggestion.name} (${suggestion.canton})`)
  setVorschlaege([])
  setDropdownOffen(false)
}
```

Im JSX: Das Suchfeld ist **kein** registriertes Formularfeld. Die tatsächlichen Werte werden über `form.setValue` gesetzt und als `<input type="hidden">` übermittelt:

```tsx
{/* Sichtbares Suchfeld (lokaler Zustand) */}
<Input
  value={suchbegriff}
  onChange={(e) => {
    setSuchbegriff(e.target.value)
    if (form.getValues('plzOrt')) {
      form.setValue('plzOrt', '')
      form.setValue('kanton', '')
    }
  }}
  autoComplete="off"
/>

{/* Dropdown */}
{dropdownOffen && vorschlaege.length > 0 && (
  <ul>
    {vorschlaege.map((v, i) => (
      <li key={`${v.postalCode}-${v.name}-${i}`}>
        {/* Index i im Key verhindert Warnung bei doppelten PLZ/Ort-Kombinationen */}
        <button type="button" onMouseDown={(e) => { e.preventDefault(); ortschaftWaehlen(v) }}>
          {v.postalCode} {v.name} ({v.canton})
        </button>
      </li>
    ))}
  </ul>
)}

{/* Versteckte RHF-Felder */}
<input type="hidden" {...form.register('plzOrt')} />
<input type="hidden" {...form.register('kanton')} />
```

> **Hinweis `onMouseDown` statt `onClick`:** Bei `onClick` verliert das Input-Feld zuerst den Fokus, was den `onBlur`-Handler (Dropdown schliessen) vor dem `onClick` auslöst. `onMouseDown` mit `e.preventDefault()` umgeht dieses Race-Condition-Problem.

> **Index im Key:** Die OpenPLZ-API kann mehrere Einträge mit identischer PLZ und identischem Ortsnamen zurückgeben (verschiedene Gemeinden). Ohne Index-Suffix würde React eine Warnung über doppelte Keys ausgeben.

---

## Schritt 9.5 – Bearbeitungsseite

`src/app/(app)/antraege/[id]/bearbeiten/page.tsx` – `defaultValues` um bestehende Werte erweitern:

```typescript
<AntragForm
  mode="edit"
  defaultValues={{
    titel: antrag.titel,
    beschreibung: antrag.beschreibung ?? '',
    plzOrt: antrag.plzOrt ?? '',
    kanton: antrag.kanton ?? '',
  }}
  action={action}
/>
```

---

## Schritt 9.6 – Detailansicht

`src/app/(app)/antraege/[id]/page.tsx` – Ort und Kanton im Details-Grid anzeigen:

```tsx
{antrag.plzOrt && (
  <>
    <span>Ort</span>
    <span>
      {antrag.plzOrt}
      {antrag.kanton && <span className="ml-1">({antrag.kanton})</span>}
    </span>
  </>
)}
```

---

## Externe API: OpenPLZ-API

- **Docs:** [openplzapi.org](https://openplzapi.org)
- **Swagger:** [openplzapi.org/swagger/index.html](https://openplzapi.org/swagger/index.html)
- PLZ-Suche CH: `GET https://openplzapi.org/ch/Localities?postalCode=8001&page=1&pageSize=10`
- Namens-Suche CH: `GET https://openplzapi.org/ch/Localities?name=Zuerich&page=1&pageSize=10`

**Antwort-Format:**
```json
[
  {
    "postalCode": "8001",
    "name": "Zürich",
    "commune": { "key": "261", "name": "Zürich", "shortName": "Zürich" },
    "district": { "key": "112", "name": "Bezirk Zürich", "shortName": "Zürich" },
    "canton": { "key": "1", "name": "Zürich", "shortName": "ZH" }
  }
]
```

Der Proxy gibt davon nur `{ postalCode, name, canton }` weiter.

---

## Akzeptanzkriterien

- [ ] PLZ eingeben → Vorschläge erscheinen nach max. 300ms
- [ ] Ortsname eingeben → Suche funktioniert gleichermassen
- [ ] Auswahl füllt Formularfeld aus, kein weiterer API-Call danach
- [ ] Feld ist optional – Antrag ohne Ort ist gültig und speicherbar
- [ ] Gewählter Ort und Kanton erscheinen in der Antrag-Detailansicht
- [ ] Bei Fehler der externen API: Fehlermeldung unter dem Feld, kein Absturz
- [ ] `npm run test` – alle Tests grün
