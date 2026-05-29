# Teil 1: Basics – Setup, Datenbank, Auth, UI (Phase 0–4)

> **Hauptdokument:** `impl-00-einstieg.md` → Abschnitt B4  
> **Tech-Stack-Entscheidungen:** `impl-00-tech-stack-decisions.md`
> - Datenbank-Strategie → Abschnitt 1 (SQLite lokal) + Abschnitt 2 (Prisma 7)
> - Auth-Strategie → Abschnitt 4 (Better Auth vs. Auth.js)
> - UI-Entscheidung → Abschnitt 6 (shadcn/ui)
> - Deployment-Strategie → Abschnitt 3 (Lokal + Port Forwarding)
>
> **Status:** ✅ Bereits umgesetzt

---

## Phase 0: Neues Repository vorbereiten

**Schritt 0.1 – Neues GitHub-Repo anlegen**
- Neues GitHub-Repo: `cas-prdig-starter-kit` (leer, ohne README)
- Lokal klonen: `git clone https://github.com/[user]/cas-prdig-starter-kit.git`
- Erwartetes Resultat: Leerer Ordner auf lokalem Rechner

**Schritt 0.2 – Next.js 16 initialisieren**
```bash
npx create-next-app@16 . --typescript --tailwind --app --src-dir no --import-alias "@/*"
```
Optionen: TypeScript ✓, Tailwind ✓, App Router ✓, kein src-Verzeichnis, Import-Alias `@/*`

> **Hinweis:** shadcn initialisiert im nächsten Schritt ein `src/`-Verzeichnis. Das `--src-dir no` hier ist bewusst, da shadcn die src-Struktur eigenständig anlegt.

- Erwartetes Resultat: `npm run dev` startet ohne Fehler, Seite lädt auf `localhost:3000`

---

## Phase 1: Basis-Konfiguration

**Schritt 1.1 – Package.json bereinigen und erweitern**

```bash
npm install prisma @prisma/client better-auth react-hook-form @hookform/resolvers zod lucide-react date-fns openai together-ai resend @prisma/adapter-better-sqlite3 better-sqlite3
npm install -D tsx dotenv @types/better-sqlite3 @playwright/test vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

Scripts in `package.json` ergänzen:
```json
"db:push": "prisma db push && prisma generate",
"db:seed": "tsx prisma/seed.ts",
"db:reset": "prisma db push --force-reset && prisma generate && tsx prisma/seed.ts",
"db:studio": "prisma studio",
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

Prisma-Seed-Config in `package.json`:
```json
"prisma": { "seed": "tsx prisma/seed.ts" }
```

Playwright einmalig installieren (Chromium):
```bash
npx playwright install chromium
```

- Erwartetes Resultat: `npm install` läuft fehlerfrei

**Schritt 1.2 – `tsconfig.json` anpassen**
- `"exclude"` von `["node_modules"]` auf `["node_modules", "prisma"]` erweitern
- Grund: `prisma/seed.ts` ist ein Standalone-Skript; Next.js würde es sonst beim Build kompilieren (Fehler)
- Erwartetes Resultat: `npm run build` kompiliert `prisma/` nicht mehr

**Schritt 1.3 – shadcn/ui initialisieren**

Standardmässig:
```bash
npx shadcn@latest init
```
Antworten: **Radix**, **Nova** ✓ (Farben: Neutral als Base, Sky als Theme)

Oder mit eigenem Dozenten-Preset (empfohlen, spart Klicks):
```bash
npx shadcn@latest init --preset b5J4txmj2 --template next
```
Antworten: Radix, Nova ✓ – Farben bereits vorkonfiguriert (Neutral / Sky)

Danach Basis-Komponenten installieren:
```bash
npx shadcn@latest add button input label card table badge select dropdown-menu avatar separator sheet
```
- Betroffene Dateien: `src/components/ui/`, `components.json`, `src/app/globals.css`
- Erwartetes Resultat: `import { Button } from '@/components/ui/button'` funktioniert

---

## Phase 2: Datenbank (Prisma 7 + SQLite)

> **Warum SQLite?** → Tech-Stack-Review Abschnitt 1: Zero-Setup, kein Account, offline nutzbar, ideal für Prototypen.  
> **Warum `db push` statt `migrate`?** → Tech-Stack-Review Abschnitt 2: Kein Migrations-Overhead bei schnellen Schema-Iterationen.

**Schritt 2.1 – Prisma initialisieren**
```bash
npx prisma init --datasource-provider sqlite
```
- Betroffene Dateien: `prisma/schema.prisma`, `prisma.config.ts`, `.env`
- Hinweis: `prisma.config.ts` wird automatisch erstellt mit `datasource: { url: process.env['DATABASE_URL'] }` – **nicht manuell ändern**
- Hinweis: `prisma.config.ts` importiert `dotenv/config` – deshalb `dotenv` als devDependency nötig
- Erwartetes Resultat: `prisma/schema.prisma` mit `provider = "sqlite"`

**Schritt 2.2 – Schema definieren**

`prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"  // src/-Layout: @/ zeigt auf src/
}

datasource db {
  provider = "sqlite"
  // Kein url hier! Prisma 7: URL wird in prisma.config.ts konfiguriert
}

// ========== BETTER AUTH MODELS ==========
// Diese Models werden von Better Auth benötigt (nicht manuell ändern)

model User {
  id            String   @id
  name          String
  email         String   @unique
  emailVerified Boolean  @default(false)
  image         String?
  role          String   @default("user_applicant") // "admin" | "user_applicant" | "user_reviewer"
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  sessions Session[]
  accounts Account[]
  antraege Antrag[]

  @@map("users")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("accounts")
}

model Verification {
  id         String    @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime? @default(now())
  updatedAt  DateTime? @updatedAt

  @@map("verifications")
}

// ========== DEMO-ENTITÄTEN (als Muster – durch eigene Entitäten ersetzen/ergänzen) ==========

enum AntragStatus {
  ENTWURF     // Noch nicht eingereicht
  EINGEREICHT // Wartet auf Prüfung
  GENEHMIGT   // Genehmigt
  ABGELEHNT   // Abgelehnt
}

// Demo-Entität 1: Antrag (generisches Prozessobjekt mit Status-Workflow)
model Antrag {
  id             String       @id @default(cuid())
  titel          String
  beschreibung   String?
  status         AntragStatus @default(ENTWURF)
  erstellerId    String
  ersteller      User         @relation(fields: [erstellerId], references: [id], onDelete: Cascade)
  erstelltAm     DateTime     @default(now())
  aktualisiertAm DateTime     @updatedAt

  @@map("antraege")
}

// Demo-Entität 2: Person (generisches Stammdaten-Objekt)
model Person {
  id             String   @id @default(cuid())
  vorname        String
  nachname       String
  email          String   @unique
  telefon        String?
  adresse        String?
  erstelltAm     DateTime @default(now())
  aktualisiertAm DateTime @updatedAt

  @@map("personen")
}
```

**Schritt 2.3 – `.env` und `.env.example`**
```env
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="[zufälliger-32-zeichen-string]"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

- `src/generated/` in `.gitignore` einfügen (wird nach `db:push` neu generiert, nicht committen)
- Hinweis: Das Projekt hat ein `src/`-Verzeichnis (durch shadcn-Preset). Der `@/`-Alias zeigt auf `src/`. Deshalb liegt der generierte Client in `src/generated/prisma/` (nicht im Root).
- **Prisma 7 Breaking Change:** `PrismaClient` benötigt zwingend einen Datenbank-Adapter (siehe Phase 3).

```bash
npm run db:push
```
- Erwartetes Resultat: `prisma/dev.db` und `src/generated/prisma/` werden erstellt
- **Wichtig:** `npm run db:seed` erst nach Phase 3 ausführen (Seed-Datei importiert `lib/auth.ts`)

**Schritt 2.4 – Seed-Datei**

`prisma/seed.ts`:
```typescript
// Seed-Datei: Erstellt Demo-Nutzer und Testdaten
// Pfade relativ zu prisma/ => src/ liegt eine Ebene höher
// Hinweis: seed.ts kann erst nach Phase 3 (lib/auth.ts) ausgeführt werden!
import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { auth } from '../src/lib/auth'

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Lösche bestehende Daten...')
  await prisma.antrag.deleteMany()
  await prisma.person.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  console.log('Erstelle Benutzer...')
  await auth.api.signUpEmail({
    body: { email: 'admin@example.com', password: 'a', name: 'Admin Benutzer' }
  })
  await prisma.user.update({
    where: { email: 'admin@example.com' },
    data: { role: 'admin' }
  })

  await auth.api.signUpEmail({
    body: { email: 'applicant@example.com', password: 'a', name: 'Test Antragsteller' }
  })
  // role bleibt 'user_applicant' (Default)

  await auth.api.signUpEmail({
    body: { email: 'reviewer@example.com', password: 'a', name: 'Test Prüfer' }
  })
  await prisma.user.update({
    where: { email: 'reviewer@example.com' },
    data: { role: 'user_reviewer' }
  })

  const applicant = await prisma.user.findUniqueOrThrow({ where: { email: 'applicant@example.com' } })

  console.log('Erstelle Demo-Anträge...')
  await prisma.antrag.createMany({
    data: [
      { titel: 'Urlaubsantrag Juli', beschreibung: 'Urlaub vom 1.–14. Juli', status: 'EINGEREICHT', erstellerId: applicant.id },
      { titel: 'Weiterbildungsantrag', beschreibung: 'CAS Kurs ZHAW', status: 'GENEHMIGT', erstellerId: applicant.id },
      { titel: 'Materialbestellung', status: 'ENTWURF', erstellerId: applicant.id },
    ]
  })

  console.log('Erstelle Demo-Personen...')
  await prisma.person.createMany({
    data: [
      { vorname: 'Maria', nachname: 'Muster', email: 'maria.muster@example.com', telefon: '+41 79 123 45 67' },
      { vorname: 'Hans', nachname: 'Beispiel', email: 'hans.beispiel@example.com' },
      { vorname: 'Anna', nachname: 'Test', email: 'anna.test@example.com', adresse: 'Musterstrasse 1, 8000 Zürich' },
    ]
  })

  console.log('✓ Seed abgeschlossen')
  console.log('  Admin:      admin@example.com / a')
  console.log('  Applicant:  applicant@example.com / a')
  console.log('  Reviewer:   reviewer@example.com / a')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```
- Erwartetes Resultat: `npm run db:seed` läuft fehlerfrei, 3 Nutzer und 6 Datensätze in DB

---

## Phase 3: Better Auth Setup

> **Warum Better Auth?** → Tech-Stack-Review Abschnitt 4: RBAC-Plugin, vollständig lokal, kein Cloud-Account, TypeScript-first.

**Schritt 3.1 – Auth-Konfiguration**

`src/lib/auth.ts`:
```typescript
// Zentrale Better Auth Konfiguration
// Definiert welche Login-Methoden erlaubt sind und welche Datenbank verwendet wird
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'sqlite' }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      // Muss dem Prisma-Schema-Default entsprechen: @default("user_applicant")
      role: { type: 'string', defaultValue: 'user_applicant' }
    }
  }
})
```

**Schritt 3.2 – Auth Route Handler**

`src/app/api/auth/[...all]/route.ts`:
- Verzeichnis `src/app/api/auth/[...all]/` zuerst anlegen (existiert noch nicht nach create-next-app)
```typescript
// Dieser Route Handler leitet alle Auth-Anfragen an Better Auth weiter
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { GET, POST } = toNextJsHandler(auth)
```

**Schritt 3.3 – Client-seitiger Auth Hook**

`src/lib/auth-client.ts`:
```typescript
// Client-seitiger Better Auth Hook für React-Komponenten
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
})

export const { signIn, signOut, signUp, useSession } = authClient
```

**Schritt 3.4 – Prisma-Singleton**

`src/lib/prisma.ts`:
```typescript
// Prisma-Client als Singleton (verhindert zu viele DB-Verbindungen im Development)
// Prisma 7: PrismaClient benötigt zwingend einen Datenbank-Adapter (Breaking Change v7)
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || 'file:./dev.db'
  })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Schritt 3.5 – Middleware**

`src/middleware.ts` (Next.js erkennt `middleware.ts` auch in `src/`):
```typescript
// Schützt alle Routen ausser /login – leitet unangemeldete Benutzer weiter
import { betterFetch } from '@better-fetch/fetch'
import type { Session } from 'better-auth/types'
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/api/auth']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next()

  const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
    baseURL: request.nextUrl.origin,
    headers: { cookie: request.headers.get('cookie') ?? '' }
  })

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
```

Jetzt `db:seed` ausführen:
```bash
npm run db:seed
```

- Erwartetes Resultat: `npm run dev` → Login-Seite erscheint, nach Login Dashboard sichtbar

---

## Phase 4: UI-Aufbau (Layout + shadcn/ui + CRUD)

Geschützte Seiten unter Route Group `src/app/(app)/...`; `/login` bleibt ausserhalb. Forms via RHF + Zod + shadcn `<Form>`; Submit via Server Action mit identischem Zod-Schema serverseitig. Toast-Feedback via `sonner`.

**Schritt 4.0 – Fundament**
```bash
npx shadcn@latest add form textarea dialog sonner skeleton
```
- `src/lib/auth-helpers.ts` – `getSession()` (wraps `auth.api.getSession({ headers: await headers() })`), `requireSession()` (redirect → `/login`), `requireRole(roles[])` (redirect → `/`), Type `Role`
- `src/lib/antrag-status.ts` – Label-, Variant- und Transitions-Mapping pro Status
- `src/lib/navigation.ts` – zentrale Nav-Liste `{ href, label, icon, roles[] }` (von Sidebar konsumiert)
- `src/app/layout.tsx` – `<Toaster />` aus `sonner` ergänzen

> **Hinweis zu `requireSession()`:** Nutzt `headers()` aus `next/headers` – zwingend für Server Components:
> ```typescript
> import { headers } from 'next/headers'
> export async function getSession() {
>   return auth.api.getSession({ headers: await headers() })
> }
> ```

**Schritt 4.1 – Login-Seite refactorn**
- `src/lib/schemas/auth.ts` – `loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) })`
- `src/app/login/page.tsx` – shadcn Card + RHF Form; `signIn.email(...)` aus `@/lib/auth-client`; Fehler → Toast + Inline via `FormMessage`; Erfolg → `router.replace('/')` + `router.refresh()`

**Schritt 4.2 – App-Shell**
- `src/app/(app)/layout.tsx` – Server Component: `requireSession()` → `<AppShell session={...}>`
- `src/components/app-shell.tsx` – Two-Column-Layout (Sidebar Desktop + Sheet Mobile)
- `src/components/sidebar.tsx` – filtert NAV_ITEMS nach Rolle via `session.user.role`, hebt aktive Route hervor via `usePathname()`
- `src/components/topbar.tsx` – Rollen-Badge, Avatar mit Initialen, DropdownMenu (Logout via Server Action)
- `src/app/(app)/actions.ts` – `logoutAction()` → `auth.api.signOut(...)` + `redirect('/login')`
- `src/app/page.tsx` → verschieben nach `src/app/(app)/page.tsx`

**Schritt 4.3 – Dashboard**
- `src/app/(app)/page.tsx` – Server Component; rollenabhängige KPI-Cards via `Promise.all` (Antrag-Counts nach Status, Personen-Count, User-Count); `loading.tsx` mit `Skeleton`-Karten

**Schritt 4.4 – Demo-Entität: Anträge**
- `src/lib/schemas/antrag.ts` – `antragCreateSchema`, `antragUpdateSchema`, `antragStatusSchema`
- `src/app/(app)/antraege/actions.ts` – `createAntrag`, `updateAntrag`, `submitAntrag`, `decideAntrag`, `deleteAntrag`; alle mit `requireSession()` + Zod-Parse + Authz + `revalidatePath`
- `src/app/(app)/antraege/page.tsx` – rollenbasierte Query (applicant: eigene; reviewer: EINGEREICHT; admin: alle); Table + Status-Badge + Aktionen
- `src/components/antraege/antrag-form.tsx` – RHF + Zod, `mode="create"|"edit"`
- `src/app/(app)/antraege/neu/page.tsx` – `requireRole(['user_applicant', 'admin'])`
- `src/app/(app)/antraege/[id]/page.tsx` – Stammdaten + Status-Block (Buttons je Rolle + Confirm-Dialog) + Edit-Modus
- `loading.tsx` + `error.tsx` für `/antraege` und `/antraege/[id]`

**Schritt 4.5 – Demo-Entität: Personen** (kein Status-Workflow)
- `src/lib/schemas/person.ts`, `src/app/(app)/personen/actions.ts` – CRUD; Schreiben nur `admin` + `user_reviewer`
- Liste, Neu, Detail analog zu Anträgen; `<PersonForm />` in `src/components/personen/person-form.tsx`

**Schritt 4.6 – Aufräumen**
- `npm run lint` → 0 Fehler
- `npm run build` → alle Routen kompilieren

**Akzeptanzkriterien Phase 4:**
- [ ] 3 Rollen melden sich an, sehen Rolle-spezifische Nav + KPIs
- [ ] Antrag-Workflow (ENTWURF→EINGEREICHT→GENEHMIGT/ABGELEHNT) funktioniert
- [ ] Personen-CRUD funktioniert
- [ ] `npm run build` fehlerfrei

---

## Nächste Schritte

- **Teil 2** (REST API): `docs/impl-02-rest-api.md`
- **Teil 3** (Testing): `docs/impl-03-testing.md`
- **Teil 4** (AI Coding Instructions): `docs/impl-04-ai-coding-instructions.md`
