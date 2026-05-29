# cas-prdig-starter-kit

Starter-Repo für den CAS Prozessdigitalisierung, ZHAW.

**Stack:** Next.js 16 · shadcn/ui · Better Auth · Prisma 7 + SQLite · OpenAI/Together.ai · Resend

---

## Setup (5 Schritte)

1. **Repository klonen:**
   ```bash
   git clone https://github.com/[user]/cas-prdig-starter-kit.git
   cd cas-prdig-starter-kit
   ```

2. **Dependencies installieren:**
   ```bash
   npm install
   npx playwright install chromium
   ```

3. **Umgebungsvariablen einrichten:**
   ```bash
   cp .env.example .env
   # .env öffnen und Werte eintragen (BETTER_AUTH_SECRET, API-Keys, usw.)
   ```

4. **Datenbank einrichten:**
   ```bash
   npm run db:reset
   ```
   → Erstellt die SQLite-Datenbank und lädt Demo-Daten

5. **App starten:**
   ```bash
   npm run dev
   ```
   → http://localhost:3000

---

## Testlogins

| Rolle | E-Mail | Passwort |
|---|---|---|
| Admin | `admin@example.com` | `a` |
| Antragsteller | `applicant@example.com` | `a` |
| Prüfer | `reviewer@example.com` | `a` |

---

## Hilfreiche Befehle

| Befehl | Zweck |
|---|---|
| `npm run db:push` | Schema in DB übernehmen (ohne Reset) |
| `npm run db:seed` | Testdaten laden |
| `npm run db:reset` | DB zurücksetzen + Testdaten laden |
| `npm run db:studio` | Prisma Studio (DB-Browser) |
| `npm run test` | Unit Tests (Vitest) |
| `npm run test:watch` | Unit Tests im Watch-Modus |
| `npm run test:e2e` | E2E Tests (Playwright, headless) |
| `npm run test:e2e:ui` | E2E Tests visuell |

---

## Dokumentation

- [`docs/starter-kit-usage/INDEX.md`](docs/starter-kit-usage/INDEX.md) – Dokumentations-Einstieg (alle Guides)
- [`docs/starter-kit-usage/GETTING_STARTED.md`](docs/starter-kit-usage/GETTING_STARTED.md) – Starter Kit für eigenes Projekt anpassen
- [`KILO_INSTRUCTIONS.md`](KILO_INSTRUCTIONS.md) – Coding-Guide für Kilo Code
- [`AGENTS.md`](AGENTS.md) – Projektkontext (TODO: anpassen)

---

## Nächste Schritte nach dem Setup

1. [`docs/starter-kit-usage/GETTING_STARTED.md`](docs/starter-kit-usage/GETTING_STARTED.md) lesen: Starter Kit für euren Prozess anpassen
2. `AGENTS.md` öffnen und alle `[TODO]`-Einträge ausfüllen
3. Mit Kilo Code Features implementieren (PIV-Loop: Plan → Implement → Validate)
