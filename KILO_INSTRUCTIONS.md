# KILO_INSTRUCTIONS.md – Coding-Guide für cas-prdig-starter-kit

> Diese Datei steuert, wie Kilo Code in diesem Projekt arbeitet.
> Projektkontext (Was/Warum) → siehe AGENTS.md

## Tech-Stack (nicht verhandelbar)

| Bereich | Technologie |
|---|---|
| Framework | Next.js 16.2.6 (App Router, TypeScript strict) |
| Styling | Tailwind CSS 4 + shadcn/ui (Radix) |
| Icons | lucide-react |
| Formulare | React Hook Form + Zod (zodResolver) |
| ORM | Prisma 7.8 + SQLite lokal (Singleton: `src/lib/prisma.ts`) |
| Auth | Better Auth 1.6 (Prisma-Adapter, 3 Rollen: `admin`/`user_applicant`/`user_reviewer`) |
| REST API (Server) | Native Next.js Route Handlers + Zod (Pizzeria-Analogie: URL = Speisekarte, Handler = Kellner, Zod = Bestellprüfung) |
| REST API (Client) | Nativer `fetch()` in Route Handlers (kein Axios); externe Calls immer serverseitig über Proxy-Endpunkt, nie direkt aus dem Browser |
| LLM | OpenAI SDK, OpenRouter oder together.ai (`src/lib/ai.ts`, kein LangChain, kein RAG) |
| E-Mail | Resend + HTML-Template-Strings (`src/lib/services/emailService.ts`, kein React Email) |
| File Upload | `public/uploads/` + Node.js `fs` (lokal), optional UploadThing |
| Testing | Vitest (Unit) + Playwright (E2E) |
| Deployment | Lokal via VS Code Port Forwarding |

**Verboten:** Supabase, DaisyUI, Redux, Axios, LangChain, ts-rest, tRPC, Prisma Migrations, Raw-SQL, `new PrismaClient()` ohne Adapter.

## Sprache und Stil

- UI-Texte: **Deutsch**
- Code: **TypeScript strict** (kein `any`, kein unbegründetes `as`)
- Kommentare: **Deutsch**, laienverständlich; jede neue Datei mit 1–2 Sätzen Kopf-Kommentar
- Namen: ausführlich und selbsterklärend (`createAntragAction`, `validateFormData`)
- Keine Emojis, ausser explizit gewünscht

## Dokumentationsstruktur (docs/)

- `docs/starter-kit-usage/` – Anleitungen für Studierende: Was tut ein Feature, wie nutze ich es? Kein tiefer Code, keine Implementierungsdetails.
- `docs/starter-kit-erstellung/` – Implementierungsanleitungen für Agents und technisch Interessierte: Vollständiger Code, Schritt-für-Schritt, Architekturentscheide.

## Projektstruktur (src/-Layout)

```
src/
├── app/
│   ├── (app)/          # Geschützte Seiten (Route Group)
│   ├── login/          # Öffentlich
│   └── api/            # Route Handlers
├── components/
│   └── ui/             # shadcn-Komponenten (via CLI)
├── generated/prisma/   # Auto-generiert (.gitignore)
└── lib/
    ├── auth.ts
    ├── auth-client.ts
    ├── auth-helpers.ts
    ├── prisma.ts
    ├── ai.ts
    ├── schemas/
    ├── services/
    └── emails/
```

## Next.js Konventionen

- **Server Components** als Standard; `'use client'` nur für Formulare, Browser-Hooks, shadcn-interaktive Komponenten
- **Server Actions** (`'use server'`) für alle DB-Operationen aus Formularen
- **Route Handlers** (`app/api/.../route.ts`) für externe Clients / REST API
- Fehlerbehandlung: `try/catch` in Server Actions; Fehlermeldungen auf Deutsch
- In Route Handlern: `getSession()` statt `requireSession()` verwenden (kein HTML-Redirect)

# This is NOT the Next.js you know
This version (16) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.


## Datenbankzugriff (Prisma 7)

- Import immer: `import { prisma } from '@/lib/prisma'`
- **NIE** `new PrismaClient()` direkt aufrufen – immer den Singleton verwenden
- Prisma 7: PrismaClient benötigt Adapter (bereits in `lib/prisma.ts` konfiguriert)
- Nach Schema-Änderungen zuerst `npx prisma generate` ausführen, dann den Reset:
  ```
  npx prisma generate
  npm run db:reset
  ```
  Ohne `prisma generate` schlägt der Seed mit «Unknown argument» fehl, weil der Client die neuen Felder noch nicht kennt.
- Keine Prisma Migrations verwenden.

## Auth (Better Auth)

- Middleware schützt alle Routen ausser `/login` und `/api/...`
- Server-seitig (Server Components): `getSession()` aus `@/lib/auth-helpers`
- Client-seitig: `useSession()` aus `@/lib/auth-client`
- Rollenprüfung: `session.user.role === 'admin'` / `'user_applicant'` / `'user_reviewer'`
- `requireSession()` nur in Server Components/Actions (leitet HTML-seitig um)
- `getSession()` in Route Handlern (gibt JSON zurück)

## REST API (native Route Handlers)

- Route Handlers in `src/app/api/[ressource]/route.ts`
- Zod-Schema für Body: `const result = schema.safeParse(await req.json())`
- Antwort: `NextResponse.json(data)` oder `NextResponse.json({ error }, { status: 400 })`
- Next.js 16: `params` ist ein Promise → `const { id } = await params`
- Auth-Prüfung: `getSession()` nur wenn der Endpunkt private Daten zurückgibt oder schreibt. Öffentliche Proxy-Endpunkte (z.B. PLZ-Lookup, öffentliche Stammdaten) brauchen keine Session-Prüfung.
- Erklärung für Studierende: URL = Speisekarte, Handler = Kellner, Zod = Bestellprüfung, Prisma = Küche

## LLM Integration (OpenAI / OpenRouter / together.ai)

- Alle LLM-Calls über `src/lib/ai.ts` (nie direkt `new OpenAI()` in Komponenten)
- Provider via ENV: `LLM_PROVIDER=openai` oder `LLM_PROVIDER=together`
- Kein RAG (keine Embeddings, keine Vektordatenbank, kein LangChain)

## E-Mail (Resend)

- Alle E-Mails über `src/lib/services/emailService.ts`
- Templates als TypeScript-Funktionen die HTML-Strings zurückgeben (kein React Email)
- `EMAIL_DEBUG_MODE=true` → alle E-Mails an `EMAIL_TEST_ADDRESS`

## Testing (Vitest + Playwright)

**Pflicht:** Bei jedem neuen Feature automatisch den zugehörigen Unit-Test schreiben.

### Vitest (Unit Tests) – `__tests__/unit/`
- **Was:** Zod-Schemas, Status-Mappings, Utility-Funktionen
- **Befehl:** `npm run test`

### Playwright (E2E Tests) – `e2e/`
- **Was:** Login-Flow, CRUD-Flows, rollenbasierte Sichtbarkeit
- **Befehl:** `npm run test:e2e` / `npm run test:e2e:ui` (visuell)

### PIV-Loop (vollständig)
1. **Plan** – Feature mit `/plan-feature [Feature]` planen. Root-`TASKS.md` bleibt nur Feature-Index; Details, Tasks und Akzeptanzkriterien liegen in `docs/project/features/[feature-name]/plan.md`.
2. **Implement** – Mit `/execute docs/project/features/[feature-name]/plan.md` genau einen Task nach dem anderen umsetzen. Task-Status und Validierung werden in der Plan-Datei dokumentiert.
3. **Validate** – `npm run test` ausführen, Ergebnis auswerten und Fehler beheben. Bei grösseren Änderungen `npm run build`; E2E nur wenn relevant oder explizit angefragt. `npm run dev` wird vom Nutzer zur manuellen Prüfung gestartet.
4. **Document** – Nach vollständiger Umsetzung und Validierung mit `/document` Endanwender- und Entwicklerdokumentation erstellen.
5. **Reflect bei Verdacht** – Nach `/document` möglichst in derselben Session mit `/reflect-rules` prüfen, ob Agent-Fehler, Planlücken, Nacharbeiten oder wiederholte Nutzerkorrekturen dauerhafte Regel- oder Skill-Anpassungen erfordern. Dieser Schritt kann zusätzliche Input-Tokens brauchen und ist vor allem bei konkreten Verdachtsmomenten sinnvoll.
6. **Commit** – Nach validierten Tasks oder Phasen darf mit `/commit` ein fokussierter Zwischencommit erstellt werden. Der finale Feature-Commit folgt nach `/document` und, falls genutzt, nach `/reflect-rules`.

## Verfügbare PIV-Skills

Skills liegen in `.agents/skills/`. Aufruf per `/skill-name` im Chat, sofern das Tool diesen Pfad unterstützt. Nie automatisch aktivieren – immer nur auf expliziten Aufruf.

| Skill | Aufruf | PIV-Phase |
|---|---|---|
| prime | `/prime` | Session-Start: Projekt-Kontext laden |
| plan-feature | `/plan-feature [Feature]` | Plan: Granularen Feature-Plan erstellen |
| execute | `/execute [Pfad-zum-Plan]` | Implement: Task-by-Task umsetzen |
| document | `/document [Pfad-zum-Plan]` | Validate/Docs: Feature-Dokumentation erstellen |
| reflect-rules | `/reflect-rules [Pfad-zum-Plan]` | Validate/Retro: Agent-Regeln und Skills verbessern |
| commit | `/commit` | Commit: Konventionellen Commit erstellen |
| create-prd | `/create-prd [Dateiname]` | Setup/Plan: PRD generieren (Skeleton) |
| create-rules | `/create-rules` | Setup: Instructions-Dateien aktualisieren |
| init-project | `/init-project` | Setup: Projekt initialisieren |

## shadcn/ui

- Komponenten aus `@/components/ui/` importieren
- Neu installieren: `npx shadcn@latest add [komponente]`
- Formulare: Fehler direkt am Feld (nicht als globaler Alert)

## Wann stoppen und fragen?

Stoppe und frage **vor**:
- Prisma-Schema-Änderungen
- Installation neuer npm-Pakete (ausser shadcn-Komponenten)
- Löschen/Umbenennen bestehender Seiten
- Kritischen Architekturentscheidungen
- Unklarheiten über den zu digitalisierenden Prozess

## Commit-Konventionen

- Format: `feat:`, `fix:`, `docs:`, `test:`
- Kein Commit ohne erfolgreiche oder begründet dokumentierte Validierung
- Kleine, fokussierte Zwischencommits nach validierten Tasks oder Phasen sind erlaubt
- Finaler Feature-Commit erst nach `/document` und, falls Verdachtsmomente vorliegen, nach `/reflect-rules`
