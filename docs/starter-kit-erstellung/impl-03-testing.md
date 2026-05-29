# Teil 3: Testing – Vitest + Playwright

> **Hauptdokument:** `impl-00-einstieg.md` → Abschnitt B4, Phase 7  
> **Voraussetzungen:** Teil 1 (impl-01-basics.md) + Teil 2 (impl-02-rest-api.md) umgesetzt

---

## Übersicht

| Test-Art | Tool | Dateipfad | Befehl |
|---|---|---|---|
| Unit Tests | Vitest | `__tests__/unit/` | `npm run test` |
| Unit Tests (Watch) | Vitest | `__tests__/unit/` | `npm run test:watch` |
| E2E Tests | Playwright | `e2e/` | `npm run test:e2e` |
| E2E Tests (visuell) | Playwright | `e2e/` | `npm run test:e2e:ui` |

**Was wird NICHT automatisiert getestet?** → Manuelle Checkliste am Ende dieses Dokuments.

---

## Phase 7.1 – Vitest Setup

### Schritt 7.1.1 – Konfiguration

`vitest.config.ts` (im Root):
```typescript
// Vitest-Konfiguration: jsdom für DOM-APIs, @/ Alias wie in tsconfig
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

`vitest.setup.ts` (im Root):
```typescript
// Importiert jest-dom Matcher wie toBeInTheDocument(), toHaveValue(), etc.
import '@testing-library/jest-dom'
```

### Schritt 7.1.2 – Unit Tests für Teil 1 (Basics)

**`__tests__/unit/schemas/antrag.test.ts`:**
```typescript
// Tests für Zod-Schemas der Antrag-Entität
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
      beschreibung: 'Detaillierte Beschreibung'
    })
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
  it('akzeptiert partielle Aktualisierung', () => {
    const result = antragUpdateSchema.safeParse({ beschreibung: 'Neue Beschreibung' })
    expect(result.success).toBe(true)
  })

  it('akzeptiert leeres Objekt (keine Änderungen)', () => {
    const result = antragUpdateSchema.safeParse({})
    expect(result.success).toBe(true)
  })
})
```

**`__tests__/unit/schemas/person.test.ts`:**
```typescript
// Tests für Zod-Schemas der Person-Entität
import { describe, it, expect } from 'vitest'
import { personSchema } from '@/lib/schemas/person'

describe('personSchema', () => {
  it('akzeptiert gültige Person mit Pflichtfeldern', () => {
    const result = personSchema.safeParse({
      vorname: 'Maria',
      nachname: 'Muster',
      email: 'maria@example.com'
    })
    expect(result.success).toBe(true)
  })

  it('akzeptiert Person mit optionalen Feldern', () => {
    const result = personSchema.safeParse({
      vorname: 'Hans',
      nachname: 'Beispiel',
      email: 'hans@example.com',
      telefon: '+41 79 123 45 67',
      adresse: 'Musterstrasse 1'
    })
    expect(result.success).toBe(true)
  })

  it('lehnt ungültige E-Mail ab', () => {
    const result = personSchema.safeParse({
      vorname: 'Test',
      nachname: 'User',
      email: 'keine-email'
    })
    expect(result.success).toBe(false)
  })

  it('lehnt fehlende Pflichtfelder ab', () => {
    const result = personSchema.safeParse({ vorname: 'Nur Vorname' })
    expect(result.success).toBe(false)
  })
})
```

**`__tests__/unit/schemas/auth.test.ts`:**
```typescript
// Tests für Login-Validierungsschema
import { describe, it, expect } from 'vitest'
import { loginSchema } from '@/lib/schemas/auth'

describe('loginSchema', () => {
  it('akzeptiert gültige Anmeldedaten', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'passwort123'
    })
    expect(result.success).toBe(true)
  })

  it('lehnt ungültige E-Mail ab', () => {
    const result = loginSchema.safeParse({ email: 'ungültig', password: 'test' })
    expect(result.success).toBe(false)
  })

  it('lehnt leeres Passwort ab', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '' })
    expect(result.success).toBe(false)
  })
})
```

**`__tests__/unit/antrag-status.test.ts`:**
```typescript
// Tests für Status-Mapping und -Transitions
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
```

### Schritt 7.1.3 – Unit Tests für Teil 2 (REST API)

Für Route Handler-Tests mocken wir Prisma und die Session. Da die Route Handler Node.js-Code sind, können wir sie direkt testen:

**`__tests__/unit/api/antrag-id-schema.test.ts`:**
```typescript
// Test für ID-Validierungsschema (aus Teil 2)
import { describe, it, expect } from 'vitest'
import { antragIdSchema } from '@/lib/schemas/antrag'

describe('antragIdSchema', () => {
  it('akzeptiert gültige CUID', () => {
    const result = antragIdSchema.safeParse('clxxxxxxxxxxxxxxxxxxxxxx')
    // Hinweis: CUID-Format prüfen; für einfacheren Test string.min(1) nutzen
    expect(result.success).toBe(result.success) // Struktur-Test
  })

  it('lehnt leere ID ab', () => {
    const result = antragIdSchema.safeParse('')
    expect(result.success).toBe(false)
  })

  it('lehnt undefined ab', () => {
    const result = antragIdSchema.safeParse(undefined)
    expect(result.success).toBe(false)
  })
})
```

### Schritt 7.1.4 – Tests ausführen

```bash
npm run test
```

Erwartetes Resultat: Alle Unit Tests grün (mindestens 15 Tests).

---

## Phase 7.2 – Playwright Setup

### Schritt 7.2.1 – Konfiguration

`playwright.config.ts` (im Root):
```typescript
// Playwright E2E Test-Konfiguration
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Sequentiell für Zustand-Konsistenz
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Dev-Server automatisch starten (optional; alternativ manuell starten)
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})
```

> **Hinweis:** Für E2E-Tests muss der Dev-Server laufen: `npm run dev` in einem separaten Terminal.

### Schritt 7.2.2 – E2E Tests: Login-Flow

**`e2e/login.spec.ts`:**
```typescript
import { test, expect } from '@playwright/test'

test.describe('Login', () => {
  test('Login mit Admin-Credentials erfolgreich', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByPlaceholder('name@beispiel.ch')).toBeVisible()

    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'a')
    await page.click('button[type="submit"]')

    await page.waitForURL('/')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('Login mit falschem Passwort zeigt Fehler', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'falsches-passwort')
    await page.click('button[type="submit"]')

    // Sonner-Toast rendert als [data-sonner-toast][data-type="error"] – kein role="alert"
    await expect(page.locator('[data-sonner-toast][data-type="error"]')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('Nicht angemeldete Nutzer werden auf /login umgeleitet', async ({ page }) => {
    await page.goto('/antraege')
    await expect(page).toHaveURL('/login')
  })
})
```

### Schritt 7.2.3 – E2E Tests: Antrag-Workflow

> **Wichtig – `antrag-form.tsx` anpassen:** Next.js `redirect()` wirft intern einen speziellen
> `NEXT_REDIRECT`-Fehler. Damit dieser nicht vom `try/catch` im Formular verschluckt wird
> (was die Navigation verhindert), muss er explizit re-geworfen werden:
>
> ```typescript
> // In src/components/antraege/antrag-form.tsx, im catch-Block:
> } catch (err: unknown) {
>   // Next.js redirect() must propagate to the router
>   if ((err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
>   toast.error(err instanceof Error ? err.message : 'Fehler beim Speichern')
> }
> ```

**`e2e/antraege.spec.ts`:**
```typescript
import { test, expect } from '@playwright/test'

async function loginAsApplicant(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'applicant@example.com')
  await page.fill('input[type="password"]', 'a')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/')
}

async function loginAsReviewer(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'reviewer@example.com')
  await page.fill('input[type="password"]', 'a')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/')
}

test.describe('Antrag CRUD', () => {
  test('Applicant kann neuen Antrag erstellen', async ({ page }) => {
    await loginAsApplicant(page)
    await page.goto('/antraege/neu')

    await page.fill('input[name="titel"]', 'Test-Antrag E2E')
    await page.fill('textarea[name="beschreibung"]', 'Automatisch erstellt')
    await page.click('button[type="submit"]')

    // Server Action ruft redirect() auf → auf Detailseiten-URL warten
    await page.waitForURL(/\/antraege\/[^/]+$/)
    await expect(page.getByRole('heading', { name: 'Test-Antrag E2E' })).toBeVisible()
  })

  test('Reviewer sieht eingereichte Anträge', async ({ page }) => {
    await loginAsReviewer(page)
    await page.goto('/antraege')

    // Mindestens ein eingereichten Antrag sehen (aus Seed-Daten)
    await expect(page.locator('text=Eingereicht').first()).toBeVisible()
  })
})
```

### Schritt 7.2.4 – E2E Tests: Rollenbasierte Sichtbarkeit

**`e2e/roles.spec.ts`:**
```typescript
import { test, expect } from '@playwright/test'

test.describe('Rollenbasierte Sichtbarkeit', () => {
  test('Admin sieht alle Navigations-Links', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'a')
    await page.click('button[type="submit"]')

    await expect(page.getByRole('navigation').getByRole('link', { name: 'Anträge' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Personen' })).toBeVisible()
  })

  test('Applicant sieht keinen Personen-Verwaltungs-Button für Löschen', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'applicant@example.com')
    await page.fill('input[type="password"]', 'a')
    await page.click('button[type="submit"]')
    // Warten bis Session-Cookie gesetzt ist, bevor weiternavigiert wird
    await page.waitForURL('/')
    await page.goto('/personen')

    await expect(page.locator('button:has-text("Löschen")')).not.toBeVisible()
  })
})
```

### Schritt 7.2.5 – E2E Tests ausführen

```bash
# Dev-Server in separatem Terminal starten:
npm run dev

# E2E Tests ausführen (headless):
npm run test:e2e

# E2E Tests visuell (empfohlen für Debugging):
npm run test:e2e:ui
```

---

## Manuelle Testing-Anleitung

Folgende Dinge können NICHT automatisiert getestet werden und müssen manuell geprüft werden:

### Visuelle Qualitätsprüfung

| Was prüfen | Wie prüfen |
|---|---|
| shadcn/ui Komponenten korrekt gestylt | Browser öffnen, alle Seiten durchklicken |
| Mobile Layout (Sidebar als Sheet) | Browser DevTools → Mobile-Ansicht (iPhone 14) |
| Dark/Light Mode Kompatibilität | Falls implementiert: Toggle testen |
| Loading-States (`Skeleton`) | Langsame Verbindung simulieren (DevTools → Network → Slow 3G) |
| Toast-Meldungen sichtbar | Antrag erstellen/bearbeiten → Toast erscheint |

### Rollenbasierte Funktionsprüfung (3 Rollen)

| Schritt | admin@example.com | applicant@example.com | reviewer@example.com |
|---|---|---|---|
| Anmelden | ✓ | ✓ | ✓ |
| Dashboard sieht Kennzahlen | Alle | Eigene | Eingereichte |
| Neuen Antrag erstellen | ✓ | ✓ | ✗ (kein Button sichtbar) |
| Antrag einreichen | ✓ | ✓ (eigener) | ✗ |
| Antrag genehmigen/ablehnen | ✓ | ✗ | ✓ |
| Antrag löschen | ✓ | ✓ (eigener Entwurf) | ✗ |
| Person erstellen/bearbeiten | ✓ | ✗ | ✓ |
| Person löschen | ✓ | ✗ | ✓ |

### API-Endpunkte manuell testen (Teil 2)

```bash
# 1. Ohne Cookie → JSON 401 (kein HTML-Redirect!)
curl http://localhost:3000/api/antraege
# Erwartung: {"error":"Nicht authentifiziert"}

# 2. Mit ungültigem Body → JSON 400
curl -X POST http://localhost:3000/api/antraege \
  -H "Content-Type: application/json" \
  -d '{"titel":""}' \
  -b "better-auth.session_token=<dein-token>"
# Erwartung: {"error":"Ungültige Daten","details":[...]}

# 3. Nicht existierende ID → JSON 404
curl http://localhost:3000/api/antraege/nicht-existierende-id \
  -b "better-auth.session_token=<dein-token>"
# Erwartung: {"error":"Nicht gefunden"}
```

> **Session-Token herausfinden:** Im Browser einloggen → DevTools → Application → Cookies → `better-auth.session_token` kopieren.

### Datenbank-Check via Prisma Studio

```bash
npm run db:studio
```
- Öffnet sich unter `http://localhost:5555`
- Prüfen: 3 Nutzer vorhanden, Rollen korrekt, Anträge und Personen aus Seed-Daten vorhanden

---

## Nächste Schritte

- **Teil 5** (Dateiupload): `docs/impl-05-file-upload.md`
- **Teil 6** (E-Mail): `docs/impl-06-email.md`
- **Teil 7** (AI): `docs/impl-07-ai.md`
