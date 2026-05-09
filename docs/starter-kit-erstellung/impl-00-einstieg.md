# cas-prdig-starter-kit: Grüne Wiese vs. Starter-Repo + Umsetzungsplan

Strategische Analyse und vollständiger Erstellungsplan für das universelle Starter-Repo `cas-prdig-starter-kit` (CAS Prozessdigitalisierung, ZHAW), inkl. Kilo Code Startprompt.

> **Update v2:** ts-rest, OpenAI/together.ai, Resend bleiben; Testing mit Vitest + Playwright; Rollen: admin/user_applicant/user_reviewer; Spec Kit init als Variante A (vorbereitete AGENTS.md); AGENTS.md/KILO_INSTRUCTIONS.md Überlappung geklärt.

---

## TEIL A: Grüne Wiese vs. Starter-Repo

### A1: Recherche-Erkenntnisse (Stand Mai 2026)

**Bolt.new / Lovable / v0.dev – Grüne Wiese mit verstecktem Kontext**
Diese Tools arbeiten scheinbar auf der grünen Wiese, haben aber **versteckte System-Prompts** (teils tausende Tokens), die Stack, Konventionen und Best Practices definieren – faktisch ein «unsichtbares Starter-Repo». Das ist auf Kilo Code nicht direkt übertragbar, weil Studierende keinen Zugriff auf den OpenRouter-System-Prompt haben.

**Cline / Kilo Code Community Best Practice**
Die `.clinerules`-Datei (Kilo Code: `.kilo/rules.md` oder `KILO_INSTRUCTIONS.md`) wird konsistent als **#1 Produktivitätsmultiplikator** genannt. Ohne Rules-Datei «erfindet» das LLM eigene Konventionen – besonders gefährlich für Nicht-Entwickler, die Abweichungen nicht erkennen.

**Agentic Coding Kurse und Bootcamps (Allgemein)**
Praktisch alle strukturierten Kurse (z.B. Encode Club, AI Dev Accelerator) nutzen Starter-Repos mit vordefinierten Tech-Stacks. Grüne Wiese wird nur für erfahrene Entwickler empfohlen, die Setup-Fehler selbst debuggen können.

**GitHub Spec Kit**
Spec Kit (`AGENTS.md`, `SPEC.md`, `PLAN.md`, `TASKS.md`) setzt voraus, dass bereits ein Projektkontext existiert – die Constitution (`AGENTS.md`) beschreibt «wie wir arbeiten», nicht «was installiert ist». Ein Starter-Repo liefert genau diesen Kontext. Auf der grünen Wiese muss Spec Kit den Stack erst selbst definieren (duplizierende Arbeit).

**«Schmutziger» Kontext vs. «leerer» Kontext**
Forschung zeigt: Ein **sauber strukturiertes Repo mit klaren Konventionen** gibt dem LLM bessere Orientierung als ein leeres Projekt. «Schmutziger» Kontext entsteht nur, wenn der Kontext **widersprüchlich** ist (z.B. gemischte Coding-Styles, veraltete Dateien). Ein gutes Starter-Repo liefert konsistenten, nützlichen Kontext.

---

### A2: Bewertungstabelle

| Kriterium | Grüne Wiese + Prompts | Starter-Repo (Boilerplate) |
|---|---|---|
| **Onboarding-Geschwindigkeit** | Langsam – Setup-Fehler (Node-Versionen, Configs) kosten 1–2h | Schnell – Clone → install → `npm run dev` in 10 Min. |
| **Fehlerrate beim ersten Start** | Hoch – LLM wählt falsche Paketversionen, Config-Fehler sind häufig | Niedrig – Repo ist getestet und läuft |
| **LLM-Qualität (Kontext-Sauberkeit)** | Mittel – LLM hat keinen Präzedenzfall, erfindet eigene Patterns | Hoch – LLM sieht bestehende Konventionen und kann konsistent folgen |
| **Lerneffekt für Studierende** | Niedrig – Setup ist kein Lernziel des Kurses | Hoch – Fokus sofort auf Prozesslogik statt Infrastruktur |
| **Spec Kit Kompatibilität** | Schwächer – Constitution muss Stack komplett neu definieren | Stärker – Constitution referenziert bestehendes Repo; SPEC.md baut auf Struktur auf |
| **Wartungsaufwand Dozent** | Hoch – Prompt muss bei Stack-Updates aktualisiert und getestet werden | Mittel – Einmaliger Repo-Unterhalt; Starter-Repo wird selten geändert |
| **Flexibilität für verschiedene Prozesse** | Hoch – Kein vorgefertigter Inhalt | Mittel – Entitäten müssen angepasst werden (einfach via Kilo Code) |
| **Risiko: «LLM weicht vom Stack ab»** | Sehr hoch – Ohne Kontext greift LLM auf Trainingsdaten zurück (z.B. Supabase statt SQLite) | Niedrig – Rules-Datei + Code-Beispiele binden LLM effektiv |

---

### A3: Hybridansatz

**Empfohlener Hybrid (Best of Both):**

> **Starter-Repo (Stack-Setup + Auth + UI-Shell) OHNE domain-spezifische Logik + 2 generische Demo-Entitäten + Kilo Code Rules-Datei + leere Spec Kit Templates**

Konkret bedeutet das:
- Das Starter-Repo enthält **Auth, Layout, DB-Config, shadcn-Setup** – alles was immer gleich ist
- Die **2 Demo-Entitäten** (`Antrag`, `Person`) sind bewusst generisch und dienen als Musterbeispiele für CRUD-Patterns – Studierende ersetzen/ergänzen diese mit ihren Prozessentitäten
- Eine **`KILO_INSTRUCTIONS.md`** im Root (oder `.kilo/rules.md`) lädt bei jeder Kilo-Session automatisch und erzwingt Stack-Konformität
- **`AGENTS.md`** ist bereits als Spec Kit-kompatibles Template vorbereitet (→ Variante A, kein `specify init` nötig – Begründung siehe unten)

**Nicht empfohlen:**
- «One-Click-Setup-Script» (`setup.ps1`): Setzt PowerShell-Kenntnisse voraus, erzeugt Debugging-Aufwand auf Windows/macOS; schlechter als einfach ein funktionierendes Repo zu klonen
- Rein grüne Wiese: Zu riskant für Nicht-Entwickler ohne starke LLM-Begleitung beim Setup

---

### A4: Empfehlung

**→ Starter-Repo-Ansatz, mit hybridem Twist**

Begründung:
1. Nicht-Entwickler sollen **Prozesse digitalisieren**, nicht Boilerplate debuggen
2. Kilo Code funktioniert **deutlich besser** mit Kontext als ohne
3. Das Risiko, vom Stack abzuweichen, ist bei der Zielgruppe **real und teuer** (sie erkennen die Abweichung nicht)
4. GitHub Spec Kit ist mit einem Starter-Repo **nahtlos integrierbar**
5. Der Wartungsaufwand für den Dozenten ist überschaubar (1 Repo statt n Prompt-Varianten)

**Zwingend im Starter-Repo:**
- Vollständig konfigurierter Stack (Next.js 15, shadcn/ui, Prisma + SQLite, Better Auth)
- Grundlayout (Sidebar, Topbar, Auth-Flow)
- 3 Rollen: `admin`, `user_applicant`, `user_reviewer`
- 2 generische CRUD-Entitäten als Muster (`Antrag`, `Person`)
- **ts-rest + Zod** für typsichere REST API-Contracts (viele Gruppen brauchen externe Anbindungen)
- **OpenAI / together.ai** LLM-Wrapper (`lib/ai.ts`) ohne RAG-Teile
- **Resend** E-Mail-Service mit generischem Template
- **Vitest** (Unit Tests) + **Playwright** (E2E Tests), je 1–2 Beispiel-Tests
- `KILO_INSTRUCTIONS.md` (gut ausgefüllte Rules-Datei)
- `AGENTS.md` als vorbereitetes Spec Kit Template (komplementär zu KILO_INSTRUCTIONS.md)
- `README.md` mit maximal 5 Setup-Schritten
- `npm run db:push`, `db:seed`, `test`, `test:e2e` scripts

**Optional (Cloud-Variante, eingebaut aber dokumentiert/auskommentiert):**
- Neon PostgreSQL (auskommentierter datasource-Block in schema.prisma)
- UploadThing (anstelle von lokalem `public/uploads/`)
- Vercel Deployment (`VERCEL_DEPLOYMENT.md`)

---

## TEIL B: Umsetzungsplan

### B0: Repo-Analyse – cas-crm-mock

#### Behalten (1:1 übernehmen)
- `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore` (Basis)
- `app/globals.css` (Struktur, ohne DaisyUI-spezifisches)
- `app/layout.tsx` (Muster, Fonts bleiben)
- `app/components/AppLayout.tsx` – Konzept (Sidebar + Main)
- `app/components/Sidebar.tsx` – Struktur und Role-Filter-Logik (UI wird neu)
- `app/components/Topbar.tsx` – Konzept (User-Menü, Logout-Button)
- `middleware.ts` – Route-Protection-Muster (Auth-Library ändert sich)
- `prisma/seed.ts` – Struktur (Inhalt wird für neue Entitäten ersetzt)
- `` – Struktur: neue Docs ersetzen die alten
- `scripts/` – check on case-by-case basis

#### Anpassen
| Datei | Änderung |
|---|---|
| `package.json` | Supabase, DaisyUI, LangChain, pdfjs, ts-rest entfernen; Better Auth, shadcn-Tooling, Playwright hinzufügen; openai / together-ai / resend bleiben |
| `prisma/schema.prisma` | datasource auf SQLite, alle Models ersetzen (Better Auth-Schema + generische Entitäten `Antrag`/`Person`, Rollen: admin/user_applicant/user_reviewer) |
| `prisma.config.ts` | SQLite-Config (User darf nicht autonom ändern) |
| `app/layout.tsx` | `data-theme` entfernen; shadcn-Provider hinzufügen |
| `app/lib/auth/` | Komplett neu für Better Auth (Session, Middleware-Helper) |
| `app/lib/ai.ts` | Vereinfachen: nur LLM-Call-Wrapper (OpenAI/together.ai), kein RAG, kein LangChain |
| `app/lib/api/contract.ts` | **Entfällt** – ts-rest wird durch native Route Handlers + Zod ersetzt |
| `app/lib/services/emailService.ts` | Generisches E-Mail-Template via Resend (CRM-spezifische Teile entfernen) |
| `app/components/Sidebar.tsx` | shadcn/ui Komponenten statt DaisyUI `menu`; 3 Rollen berücksichtigen |
| `app/components/Topbar.tsx` | shadcn/ui Dropdown statt DaisyUI |
| `.env.example` | Supabase-Keys entfernen; Better Auth + SQLite + OpenAI + Resend Vars |
| `README.md` | Kurs-spezifisches Setup, 5-Schritte-Anleitung |
| `vitest.config.ts`, `vitest.setup.ts` | Aktualisieren für neuen Stack (kein Supabase-Mock) |

#### Entfernen
- `app/lib/supabase/`, `app/lib/supabase-client.ts` – Supabase komplett weg
- `app/lib/embeddings.ts`, `app/lib/vector-search.ts`, `app/lib/pdf-processor.ts`, `app/lib/crm-serializer.ts` – RAG/Vector-Features (ai.ts selbst bleibt, wird vereinfacht)
- `app/kunden/`, `app/kontakte/`, `app/veranstaltungen/`, `app/chatbot/`, `app/dataverse/` – CRM-spezifische Seiten
- `app/rest-api-test/` – CRM-spezifische OpenAPI Testseite (ts-rest selbst bleibt)
- `app/lib/services/contactEmailService.ts`, `app/lib/services/eventEmailService.ts` – CRM-spezifische E-Mail-Services
- `app/emails/` – CRM-spezifische React Email Templates (generisches Template wird neu erstellt)
- `SUPABASE_AUTH_SETUP.md`, `WORKING_DATABASE_CONFIGURATION.md`, `DATAVERSE_INTEGRATION.md`, `RAG_CHATBOT_IMPLEMENTATION_GUIDE.md`, `CONNECTION_MANAGEMENT.md` – nicht mehr relevante Docs
- `openapi.json` – CRM-spezifische OpenAPI-Spec (wird für neue Entities neu generiert)
- Prisma-Migrations-Verzeichnis falls vorhanden

#### Fehlt noch (neu erstellen)
- Better Auth Setup (`lib/auth.ts`, `lib/auth-client.ts`, `app/api/auth/[...all]/route.ts`)
- Generischer LLM-Wrapper (`lib/ai.ts` – vereinfacht)
- E-Mail-Service (`lib/services/emailService.ts`) mit HTML-Template-Literal (kein React Email)
- Generische Route Handlers (`app/api/antraege/route.ts`, `app/api/personen/route.ts`) mit Zod-Validation
- `KILO_INSTRUCTIONS.md` im Root
- `AGENTS.md` (vorbereitetes Spec Kit Template)
- `VSCODE_PORT_FORWARDING.md`
- `SCHEMA_RESET_WORKFLOW.md` (SQLite-Version)
- `LLM_INTEGRATION.md` (einfacher Guide für OpenAI/together.ai)
- `EMAIL_INTEGRATION.md` (einfacher Guide für Resend)
- `REST_API_GUIDE.md` (einfacher Guide für ts-rest)
- `VERCEL_DEPLOYMENT.md` (Cloud-Variante)
- `app/antraege/` – CRUD-Demo-Seiten
- `app/personen/` – CRUD-Demo-Seiten
- `components/ui/` (shadcn-Komponenten)
- `__tests__/unit/validators.test.ts` – Vitest Beispiel-Test
- `e2e/login.spec.ts` – Playwright Beispiel-Test

---

### B1: Starter-Repo Inhalt – vollständige Checkliste

#### MVP (Muss enthalten sein)
- [x] Next.js 16 App Router mit TypeScript (strict)
- [x] Tailwind CSS v4 + shadcn/ui (vollständig konfiguriert, ~10 Basis-Komponenten)
- [x] React Hook Form + Zod (mit zodResolver)
- [x] Lucide Icons
- [x] Prisma 7 mit SQLite (`prisma/dev.db`, `db push`, kein Migrations-Verzeichnis)
- [x] Better Auth (lokal, Prisma-Adapter, E-Mail+Passwort, 3 Rollen: `admin`/`user_applicant`/`user_reviewer`)
- [x] 2 generische Demo-Entitäten: `Antrag` (Status-Enum + Ersteller-Relation) + `Person`
- [x] Seed-Datei: 3 Testnutzer + je 3 Demo-Datensätze
- [x] Grundlayout: Sidebar (Role-aware), Topbar (User-Menü + Logout), Dashboard
- [x] Protected Routes via Middleware
- [x] **Native Route Handlers** (`app/api/antraege/route.ts`) mit Zod-Request-Validation als Muster (Pizzeria-Analogie)
- [x] **OpenAI / together.ai** LLM-Wrapper (`lib/ai.ts`): einfacher Chat-Completion-Aufruf
- [x] **Resend** E-Mail-Service: `lib/services/emailService.ts` mit HTML-Template-Literal (kein React Email, keine deprecated Pakete)
- [x] **Vitest** Unit Tests (`__tests__/unit/`) + 1 Beispiel-Test für Zod-Schema
- [x] **Playwright** E2E Tests (`e2e/`) + 1 Beispiel-Test für Login-Flow
- [x] npm-Scripts: `db:push`, `db:seed`, `db:reset`, `db:studio`, `test`, `test:e2e`, `test:e2e:ui`
- [x] `.env.example` (DATABASE_URL, BETTER_AUTH_SECRET, OPENAI_API_KEY, RESEND_API_KEY)
- [x] `KILO_INSTRUCTIONS.md` (Rules-Datei für Kilo Code – fokussiert auf operationale Regeln)
- [x] `AGENTS.md` (Spec Kit Constitution – fokussiert auf strategischen Kontext/Scope)
- [x] `README.md` mit Setup in 5 Schritten
- [x] `VSCODE_PORT_FORWARDING.md`
- [x] `SCHEMA_RESET_WORKFLOW.md` (SQLite-Version)
- [x] `LLM_INTEGRATION.md`
- [x] `EMAIL_INTEGRATION.md`
- [x] `REST_API_GUIDE.md` (erklärt Pizzeria-Analogie + native Route Handler + Zod)

#### Optional (Cloud-Variante, im Repo vorbereitet/auskommentiert)
- [x] Neon PostgreSQL: auskommentierter `datasource`-Block in `prisma/schema.prisma` + Anleitung in `NEON_SETUP.md`
- [x] UploadThing: Stub-File `lib/storage.ts` (auskommentiert) + `UPLOADTHING_SETUP.md`
- [x] Vercel: `VERCEL_DEPLOYMENT.md`

#### Explizit NICHT im Starter-Repo
- Keine CRM-spezifischen Entitäten (Customer, Contact, Event, Registration)
- Keine Supabase-Abhängigkeiten
- Keine Prisma-Migrations
- Kein LangChain / RAG / Vector-Search / Embeddings
- Keine CRM-spezifischen E-Mail-Templates oder Services
- Keine komplexen AI-Features (Audio, PDF-Processing, CV-Analyse)

---

### B1.5: Klärungen zu offenen Fragen

#### AGENTS.md vs. KILO_INSTRUCTIONS.md – sinnvolle Überlappung?

**Kurze Antwort: Ja, beide Dateien werden geladen – aber sie sollen unterschiedliche Inhalte haben.**

Kilo Code lädt `KILO_INSTRUCTIONS.md` als «Wie arbeite ich in diesem Repo?»-Kontext.  
GitHub Spec Kit lädt `AGENTS.md` als «Was bauen wir und warum?»-Kontext.  
Wenn beide geladen werden, ist *kohärente Redundanz* kein Problem – ein widerspruchsfreies Bild ist sogar besser als ein lückenhaftes.

**Empfohlene Aufteilung (kein Duplikat-Inhalt):**

| Inhalt | KILO_INSTRUCTIONS.md | AGENTS.md |
|---|---|---|
| Stack-Tabelle | ✓ vollständig | Nur Verweis: «Siehe KILO_INSTRUCTIONS.md» |
| Code-Konventionen (TypeScript, Kommentare) | ✓ | – |
| PIV-Loop-Regeln, wann stoppen | ✓ | – |
| Commit-Konventionen | ✓ | – |
| Testing-Regeln | ✓ | – |
| Projektbeschreibung (was wir bauen) | – | ✓ |
| Scope (im/ausserhalb Scope) | – | ✓ |
| Team-Info | – | ✓ |
| Rollenkonzept (fachlich) | – | ✓ |
| Architekturentscheidungen mit Begründung | – | ✓ |
| Datenmodell-Übersicht | – | ✓ (nach SPEC.md) |

**Fazit:** Beide Dateien laden ist gut und gewollt. Inhaltlich sollen sie sich ergänzen, nicht duplizieren. `KILO_INSTRUCTIONS.md` ist der «Coding-Guide», `AGENTS.md` ist der «Projekt-Kontext».

---

#### Testing-Strategie für Prototypen + GitHub Spec Kit Integration

**Warum Tests auch bei Prototypen?**

Auch wenn kein Produktionscode geschrieben wird: Tests sind im PIV-Loop die **formalisierte «Validate»-Phase**. Ohne Tests weiss Kilo Code nicht, ob seine Implementierung korrekt ist – es entsteht ein «es sieht gut aus»-Bias. Mit Tests wird jede Iteration messbar.

**Empfohlener Ansatz (zweistufig):**

| Test-Typ | Tool | Wann | Was wird getestet |
|---|---|---|---|
| Unit Tests | Vitest | Nach jeder Server Action / Utility | Zod-Schemas, Validierungslogik, reine Funktionen |
| E2E Tests | Playwright | Nach jedem Feature-Abschluss | Login-Flow, CRUD-Flow, Role-basiertes Routing |

**Playwright für Nicht-Entwickler:** `npm run test:e2e:ui` öffnet ein visuelles Browser-Interface – Studierende sehen Schritt für Schritt, was der Test tut. Das senkt die Hemmschwelle.

**Integration mit GitHub Spec Kit (TASKS.md):**

Jede Aufgabe in `TASKS.md` erhält Akzeptanzkriterien, die direkt mit Tests verknüpft sind:

```markdown
## Task: Antrag-Formular

### Akzeptanzkriterien
- [ ] Formular zeigt Fehlermeldungen wenn Pflichtfelder leer sind (Vitest: `validators.test.ts`)
- [ ] Gespeicherter Antrag erscheint in der Liste (Playwright: `antraege.spec.ts`)
- [ ] `npm run test` grün ✓
- [ ] `npm run test:e2e` grün ✓
```

**PIV-Loop mit Tests (ergänzte Version):**
1. **Plan** – Task in TASKS.md definieren, Akzeptanzkriterien festlegen
2. **Implement** – Code + Tests schreiben (Kilo Code macht beides)
3. **Validate** – `npm run test && npm run test:e2e` → nur bei Grün: committen

**KILO_INSTRUCTIONS.md-Regel:** Kilo Code schreibt bei jedem neuen Feature automatisch den zugehörigen Vitest-Unit-Test. Playwright-Tests werden nach Abschluss einer Feature-Gruppe ergänzt.

---

#### Spec Kit init – Variante A vs. B

| | Variante A: Vorbereitetes `AGENTS.md` (empfohlen) | Variante B: Studierende führen `specify init` aus |
|---|---|---|
| **Setup-Aufwand** | Keiner – `AGENTS.md` ist sofort nutzbar | Extra Schritt: `npm install -g @github/spec-kit`, `specify init` |
| **Lerneffekt** | Studieren lernen Spec Kit durch Ausfüllen des Templates | Studieren erleben den Init-Workflow |
| **Konflikte** | Keiner (kein CLI nötig) | `specify init` überschreibt ggf. bestehendes `AGENTS.md` |
| **`specify plan`/`specify tasks`** | Funktionieren auf bestehendem `AGENTS.md` | Funktionieren nach `specify init` |
| **Wartung** | Dozent pflegt Template im Starter-Repo | Jede Gruppe erzeugt eigenes Format |

**→ Empfehlung: Variante A.** Das `AGENTS.md` ist bereits im richtigen Spec Kit-Format. Studierende füllen einfach die `[TODO]`-Felder aus. `specify plan` und `specify tasks` können direkt darauf aufbauen. `specify init` ist nicht nötig und kann Konflikte erzeugen.

---

### B2: Kilo Code Instructions-Datei (`KILO_INSTRUCTIONS.md`)

> **Dateiort:** `KILO_INSTRUCTIONS.md` im Repository-Root  
> **Lade-Verhalten:** Kilo Code lädt diese Datei automatisch als Kontext bei jeder neuen Session (analog zu Cursors `.cursorrules`)

```markdown
# KILO_INSTRUCTIONS.md – Coding-Guide für cas-prdig-starter-kit

> Diese Datei steuert, wie Kilo Code in diesem Projekt arbeitet.
> Projektkontext (Was/Warum) → siehe AGENTS.md

## Tech-Stack (nicht verhandelbar)

| Bereich | Technologie |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Icons | lucide-react |
| Formulare | React Hook Form + Zod (zodResolver) |
| ORM | Prisma 7 – SQLite lokal (Singleton: `lib/prisma.ts`) |
| Auth | Better Auth (Prisma-Adapter, 3 Rollen: `admin`/`user_applicant`/`user_reviewer`) |
| REST API | Native Next.js Route Handlers + Zod (Pizzeria-Analogie: URL = Speisekarte, Handler = Kellner, Zod = Bestellprüfung) |
| LLM | OpenAI SDK oder together.ai (`lib/ai.ts`, kein LangChain, kein RAG) |
| E-Mail | Resend + React Email (`lib/services/emailService.ts`) |
| File Upload | `public/uploads/` + Node.js `fs` (lokal), optional UploadThing |
| Testing | Vitest (Unit) + Playwright (E2E) |
| Deployment | Lokal via VS Code Port Forwarding |

**Verboten:** Supabase, DaisyUI, Redux, Axios, LangChain, ts-rest, tRPC, Raw-SQL, `new PrismaClient()`.

## Sprache und Stil

- UI-Texte: **Deutsch**
- Code: **TypeScript strict** (kein `any`, kein unbegründetes `as`)
- Kommentare: **Deutsch**, laienverständlich; jede neue Datei mit 1–2 Sätzen Kopf-Kommentar
- Namen: ausführlich und selbsterklärend (`createAntragAction`, `validateFormData`)
- Keine Emojis, ausser explizit gewünscht

## Next.js Konventionen

- **Server Components** als Standard; `'use client'` nur für Formulare, Browser-Hooks, shadcn-interaktive Komponenten
- **Server Actions** (`'use server'`) für alle DB-Operationen aus Formularen
- **Route Handlers** (`app/api/.../route.ts`) nur für externe Clients (Webhooks, ts-rest-Endpoints)
- Fehlerbehandlung: `try/catch` in Server Actions; Fehlermeldungen benutzerdefiniert auf Deutsch

## Datenbankzugriff (Prisma)

- Import immer via `import { prisma } from '@/lib/prisma'`
- **NIE** `new PrismaClient()` direkt aufrufen
- Nach Schema-Änderungen **Benutzer auffordern** (nicht selbst ausführen):
  ```
  npx prisma db push --force-reset
  npx prisma db seed
  ```

## Auth (Better Auth)

- Middleware schützt alle Routen ausser `/login`
- Server-seitig: `const session = await auth.api.getSession({ headers: await headers() })`
- Client-seitig: `useSession()` aus `@/lib/auth-client`
- Rollenprüfung: `session.user.role === 'admin'` / `'user_applicant'` / `'user_reviewer'`

## REST API (native Route Handlers)

- Route Handlers in `app/api/[ressource]/route.ts` – ein File pro Ressource
- Zod-Schema für Request-Body: `const schema = z.object({...}); const body = schema.parse(await req.json())`
- Antwort via `NextResponse.json(data)` oder `NextResponse.json({ error }, { status: 400 })`
- Erklärung für Studierende: URL = Speisekarte, Route Handler = Kellner, Zod = Bestellprüfung, Prisma = Küche

## LLM Integration (OpenAI / together.ai)

- Alle LLM-Calls über `lib/ai.ts` (nie direkt `new OpenAI()` in Komponenten)
- API-Key aus ENV: `process.env.OPENAI_API_KEY` oder `TOGETHER_AI_API_KEY`
- Modell und Provider in `lib/ai.ts` konfigurierbar; Code in Komponenten bleibt unverändert
- Keine RAG-Features (kein LangChain, keine Embeddings, keine Vektordatenbank)

## E-Mail (Resend)

- Alle E-Mails über `lib/services/emailService.ts` (kein React Email, kein zusätzliches Paket)
- Templates als TypeScript-Funktionen, die HTML-Strings zurückgeben
- API-Key aus ENV: `process.env.RESEND_API_KEY`; Absenderadresse: `RESEND_FROM_EMAIL`
- Beispiel: `sendEmail({ to, subject, html: emailHtmlTemplate(antragTitel) })`

## Testing (Vitest + Playwright)

**Pflicht:** Bei jedem neuen Feature schreibst du automatisch den zugehörigen Unit-Test.

### Vitest (Unit Tests) – `__tests__/unit/`
- **Was:** Zod-Schemas, Server Actions (business logic), reine Utility-Funktionen
- **Befehl:** `npm run test`
- Kein Mocking von Prisma nötig bei reinen Schema-Tests

### Playwright (E2E Tests) – `e2e/`
- **Was:** Login-Flow, CRUD-Flows, Role-based Routing nach Feature-Abschluss
- **Befehl:** `npm run test:e2e` (headless) / `npm run test:e2e:ui` (visuell)
- Neue E2E-Tests nach jedem abgeschlossenen Feature-Block ergänzen

### PIV-Loop (vollständig)
1. **Plan** – Task in `TASKS.md` definieren + Akzeptanzkriterien mit Test-Referenz
2. **Implement** – Code schreiben + Unit-Test schreiben
3. **Validate** – `npm run test` grün? → `npm run dev` fehlerfrei? → committen

Fehler in Tests: **sofort beheben**, nicht ignorieren.

## shadcn/ui

- Komponenten aus `@/components/ui/` importieren
- Neu installieren: `npx shadcn@latest add [komponente]`
- Formulare: Fehler direkt am Feld (nicht als globaler Alert)
- Lade-Zustände: `isPending` via `useTransition`

## Wann stoppen und fragen?

Stoppe und frage vor:
- Prisma-Schema-Änderungen
- Installation neuer npm-Pakete (ausser shadcn-Komponenten)
- Löschen/Umbauen bestehender Seiten
- Kritischen Architekturentscheidungen (neue Relationen, neues Rollenkonzept)
- Unklarheiten über den zu digitalisierenden Prozess

## Commit-Konventionen

- Kleiner, fokussierter Commit pro Feature; Format: `feat:`, `fix:`, `docs:`, `test:`
- Beispiele: `feat: Antrag-Formular mit Validierung`, `test: E2E-Test für Login-Flow`
- Kein Commit ohne grüne Tests und laufenden Dev-Server
```

---

### B3: Spec Kit Constitution (`AGENTS.md`)

> **Hinweis:** `AGENTS.md` enthält den *Projektkontext* (Was/Warum/Wer).  
> Coding-Regeln und Stack-Details → `KILO_INSTRUCTIONS.md` (wird separat geladen).  
> Kein `specify init` nötig – diese Datei ist bereits im Spec Kit-Format.

```markdown
# AGENTS.md – Projekt-Constitution

> Spec Kit Constitution für dieses Projekt.
> Angepasst von: [Gruppenname], [Datum]
> Coding-Regeln und Stack-Details: siehe KILO_INSTRUCTIONS.md

## Projektbeschreibung

[TODO: 2–3 Sätze – was digitalisiert dieser Prototyp, welcher Prozess wird abgebildet?]

Beispiel: «Dieses System digitalisiert den Antrags- und Genehmigungsprozess der Abteilung X.
Mitarbeitende (user_applicant) können Anträge erfassen; Vorgesetzte (user_reviewer) können
genehmigen oder ablehnen; Admins verwalten Benutzer und Einstellungen.»

## Stack-Entscheidungen

> Vollständige Stack-Tabelle und Coding-Konventionen: `KILO_INSTRUCTIONS.md`

Kerntechnologien: Next.js 15 · shadcn/ui · Prisma 7 + SQLite · Better Auth · ts-rest · OpenAI/together.ai · Resend

**Verboten:** Supabase, DaisyUI, LangChain, Prisma Migrations.

## Rollenkonzept

| Rolle | Bezeichnung | Beschreibung |
|---|---|---|
| `admin` | Administrator | Benutzerverwaltung, Systemkonfiguration, volle Rechte |
| `user_applicant` | Antragsteller | Kann Prozessobjekte erstellen und bearbeiten (eigene) |
| `user_reviewer` | Prüfer/Genehmiger | Kann Prozessobjekte prüfen und Status ändern |

[TODO: Rollen an den eigenen Prozess anpassen]

## Scope des Prototypen

**Im Scope:**
- [TODO: Prozessschritte und Entitäten des digitalisierten Prozesses]
- CRUD für Prozessobjekte mit Statusworkflow
- Rollenbasierter Zugriff (admin / user_applicant / user_reviewer)
- E-Mail-Benachrichtigungen bei Statuswechseln
- LLM-Unterstützung für [TODO: konkreter Use Case, z.B. Textzusammenfassung]
- Lokaler Betrieb und Demo via VS Code Port Forwarding

**Ausserhalb des Scope:**
- Mobile-Optimierung
- Produktions-Deployment mit echten Benutzerdaten
- RAG / Vektordatenbank / Dokumentenanalyse
- Komplexe externe API-Integrationen

## Testing-Ansatz

- **Vitest** für Unit Tests (Zod-Schemas, Validierungslogik) – läuft nach jedem Feature
- **Playwright** für E2E Tests (Login, CRUD-Flows) – läuft nach Feature-Abschluss
- Akzeptanzkriterien in TASKS.md referenzieren direkt die Test-Dateien
- PIV-Loop: Plan → Implement → `npm run test && npm run test:e2e` → Commit

## Datenmodell

[TODO: Nach `/speckit.spec` wird SPEC.md mit dem vollständigen Datenmodell erstellt]

Demo-Entitäten im Starter-Kit (als Muster, anpassen/ersetzen):
- `Antrag`: id, titel, beschreibung, status (ENTWURF/EINGEREICHT/GENEHMIGT/ABGELEHNT), ersteller
- `Person`: id, vorname, nachname, email, telefon, adresse

## Entwicklungsstand

[TODO: Wird via PLAN.md und TASKS.md verwaltet – `specify plan` / `specify tasks`]

## Team

[TODO: Gruppenname, Mitglieder, Kursjahrgang]
```

---

### B4: Implementierungsanleitungen

> **Aufbau:** Der Implementierungsplan ist in 8 separate Dokumente aufgeteilt, die jeweils in `cas-prdig-starter-kit/` liegen.  
> Jedes Dokument verweist zurück auf dieses Hauptdokument und auf relevante Abschnitte des Tech-Stack-Reviews (`cas-crm-mock/subagent_04_tech_stack_review_result1_v2.md`).

#### Tech-Stack-Review – Referenz-Abschnitte

| Abschnitt | Inhalt | Relevant für |
|---|---|---|
| Abschnitt 1 | Datenbankstrategie (SQLite / Neon) | Teil 1, Teil 5 |
| Abschnitt 2 | ORM (Prisma 7, `db push`) | Teil 1 |
| Abschnitt 3 | Deployment (lokal + Port Forwarding) | Teil 8 |
| Abschnitt 4 | Auth (Better Auth vs. Auth.js) | Teil 1 |
| Abschnitt 5 | File Storage (lokal / UploadThing) | Teil 5 |
| Abschnitt 6 | Stack-Komponenten (Next.js, shadcn/ui, RHF+Zod) | Teil 1, Teil 2 |
| Abschnitt 7 | Stack-Varianten (Lokal / Cloud) | Teil 6, Teil 8 |
| Abschnitt 8 | Migrations-Hinweise (cas-crm-mock) | alle |

#### Teildokumente

| # | Datei | Inhalt | Status |
|---|---|---|---|
| 1 | [`impl-01-basics.md`](../Documents/repos/cas-prdig-starter-kit/impl-01-basics.md) | Phase 0–4: Repo, Setup, Datenbank, Auth, UI | ✅ Umgesetzt |
| 2 | [`impl-02-rest-api.md`](../Documents/repos/cas-prdig-starter-kit/impl-02-rest-api.md) | Route Handlers + Zod (Phase 5.1) | ✅ Umgesetzt |
| 3 | [`impl-03-testing.md`](../Documents/repos/cas-prdig-starter-kit/impl-03-testing.md) | Vitest + Playwright, ausführlich (Phase 7) | ✅ Umgesetzt |
| 4 | [`impl-04-ai-coding-instructions.md`](../Documents/repos/cas-prdig-starter-kit/impl-04-ai-coding-instructions.md) | KILO_INSTRUCTIONS, AGENTS, .kiloignore (Phase 6.1–6.2) | ✅ Umgesetzt |
| 5 | [`impl-05-file-upload.md`](../Documents/repos/cas-prdig-starter-kit/impl-05-file-upload.md) | PDF-Upload + react-pdf Viewer | ⬜ Ausstehend |
| 6 | [`impl-06-email.md`](../Documents/repos/cas-prdig-starter-kit/impl-06-email.md) | Resend Outbound + Inbound-Webhooks (Phase 5.3) | ⬜ Ausstehend |
| 7 | [`impl-07-ai.md`](../Documents/repos/cas-prdig-starter-kit/impl-07-ai.md) | LLM-Chat + Dokumentenanalyse (Phase 5.2) | ⬜ Ausstehend |
| 8 | [`impl-08-documentation.md`](../Documents/repos/cas-prdig-starter-kit/impl-08-documentation.md) | README, INDEX.md, GETTING_STARTED (Phase 6.3–6.4) | ⬜ Ausstehend |

#### Abhängigkeiten

```
Teil 1 (Basics) ──→ Teil 2 (REST) ──→ Teil 3 (Testing)
Teil 1 ──→ Teil 5 (Dateiupload) ──→ Teil 7 (AI, Use Case 2)
Teil 1 ──→ Teil 6 (E-Mail)
Teil 4 (Instructions) – unabhängig, früh anlegen
Teil 8 (Doku) – zuletzt (referenziert alle anderen)
```

#### Stack-Erweiterungen durch Teile 5–7

> Diese Teile erweitern das Prisma-Schema. Jedes Mal ist `npm run db:reset` nötig.  
> Reihenfolge: Teil 5 → Teil 6 → Teil 7 (additive Schema-Änderungen).

| Teil | Schema-Erweiterung | Neue Dependencies |
|---|---|---|
| Teil 5 | `Antrag.dateiPfad`, `Antrag.dateiName` | `react-pdf`, `pdfjs-dist` |
| Teil 6 | `Antrag.notizen` | – |
| Teil 7 | `Antrag.kiAnalyse` | `openai`, `together-ai` |

---

### B5: Kilo Code Startprompt (copy-paste-fertig)

> **Verwendung:** Öffne Kilo Code in VS Code, wähle den **Architect-Modus**, füge den folgenden Prompt ein und sende ihn ab.

```
Du bist ein Senior Full-Stack-Entwickler und baust für mich ein universelles Starter-Repo
namens `cas-prdig-starter-kit` für einen Hochschulkurs (CAS Prozessdigitalisierung, ZHAW).
Zielgruppe: Nicht-Softwareingenieure (BWL, Prozessmanagement), die mit Kilo Code arbeiten.

## Dein Auftrag

Baue ein neues, sauberes Repo mit folgendem Stack:
- Next.js 15 (App Router, TypeScript strict)
- Tailwind CSS v4 + shadcn/ui (New York style, Zinc)
- React Hook Form + Zod (zodResolver)
- Lucide Icons
- Prisma 7 mit SQLite (lokal, kein Cloud-Account)
- Better Auth (E-Mail/Passwort, Prisma-Adapter)
- 3 Rollen: admin / user_applicant / user_reviewer
- Native Next.js Route Handlers + Zod (REST API ohne Extra-Library; Pizzeria-Analogie)
- OpenAI SDK (einfacher LLM-Chat-Wrapper, kein LangChain, kein RAG)
- Resend + HTML-Template-Literals (kein `@react-email/components`, kein deprecated Paket)
- Vitest (Unit Tests) + Playwright (E2E Tests)
- 2 generische Demo-Entitäten: Antrag (Status-Workflow) + Person (Stammdaten)
- Vollständiges CRUD für beide Entitäten

## WICHTIG: Arbeitsweise

1. **Erstelle zuerst einen detaillierten Schritt-für-Schritt-Plan** und lege ihn mir zur
   Bestätigung vor. Schreibe KEINEN Code, bevor ich den Plan bestätigt habe.

2. **Schrittweise vorgehen:** Ein Schritt = ein Turn, dann stoppen und auf meine
   Bestätigung warten.

3. **PIV-Loop nach jedem Feature:**
   - Code schreiben + zugehörigen Unit-Test schreiben
   - `npm run test` starten – muss grün sein
   - `npm run dev` starten – muss fehlerfrei starten
   - Erst dann nächster Schritt

4. **Nie autonom ausführen:** `prisma db push`, `prisma db seed`, `prisma migrate`.
   Stattdessen Befehl anzeigen und mich ausführen lassen.

5. **Fragen statt raten:** Bei Unklarheiten kurz nachfragen.

## Technische Anforderungen

### Verzeichnisstruktur
```
cas-prdig-starter-kit/
├── src/                          # src/-Layout (durch shadcn-Preset)
│   ├── app/
│   │   ├── login/page.tsx            # öffentlich
│   │   ├── dashboard/page.tsx
│   │   ├── antraege/                 # CRUD Antrag
│   │   ├── personen/                 # CRUD Person
│   │   ├── ai-demo/page.tsx          # LLM-Demo-Seite
│   │   ├── api/
│   │   │   ├── auth/[...all]/route.ts
│   │   │   ├── antraege/route.ts         # GET + POST
│   │   │   └── antraege/[id]/route.ts    # GET + PUT + DELETE
│   │   ├── components/               # AppLayout, Sidebar, Topbar
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/ui/                # shadcn-Komponenten
│   ├── generated/prisma/             # auto-generiert nach db:push (in .gitignore)
│   └── lib/
│       ├── auth.ts                   # Better Auth (3 Rollen)
│       ├── auth-client.ts
│       ├── prisma.ts                 # Singleton
│       ├── ai.ts                     # OpenAI/together.ai Wrapper
│       ├── schemas/
│       │   ├── antrag.ts             # Zod-Schemas (Create/Update)
│       │   └── person.ts             # Zod-Schemas (Create/Update)
│       ├── emails/
│       │   └── templates.ts          # HTML-String-Funktionen (kein React Email)
│       └── services/
│           └── emailService.ts       # sendEmail({ to, subject, html })
├── prisma/
│   ├── schema.prisma             # SQLite + Better Auth + Entitäten
│   └── seed.ts                   # 3 Testnutzer + Demo-Daten
├── __tests__/unit/
│   └── validators.test.ts        # Vitest Beispiel
├── e2e/
│   └── login.spec.ts             # Playwright Beispiel
├── KILO_INSTRUCTIONS.md          # Kilo Code Rules (Coding-Guide)
├── AGENTS.md                     # Spec Kit Constitution (Projektkontext)
├── README.md
├── .env.example
├── vitest.config.ts
├── playwright.config.ts
└── 
    ├── SCHEMA_RESET_WORKFLOW.md
    ├── VSCODE_PORT_FORWARDING.md
    ├── LLM_INTEGRATION.md
    ├── EMAIL_INTEGRATION.md
    ├── REST_API_GUIDE.md
    ├── NEON_SETUP.md
    ├── UPLOADTHING_SETUP.md
    └── VERCEL_DEPLOYMENT.md
```

### Prisma Schema
- Better Auth: User (mit role-Feld: default `user_applicant`), Session, Account, Verification
- Rollen-String-Werte: `"admin"` | `"user_applicant"` | `"user_reviewer"`
- Antrag: id (cuid), titel, beschreibung?, status (Enum: ENTWURF/EINGEREICHT/GENEHMIGT/ABGELEHNT), erstellerId (FK User), timestamps
- Person: id (cuid), vorname, nachname, email (unique), telefon?, adresse?, timestamps
- Optional (auskommentiert): Neon PostgreSQL datasource als Kommentar-Block

### Auth & Rollen
- Login: /login (öffentlich); alle anderen Routen geschützt via Middleware
- admin: alle Seiten inkl. Benutzerverwaltung
- user_reviewer: Antrag-Liste (lesen + Status ändern), Personen-Liste
- user_applicant: eigene Anträge erstellen/lesen, Personen-Liste

### Seed-Daten (3 Nutzer)
- admin@example.com / admin123 (role: admin)
- applicant@example.com / applicant123 (role: user_applicant, Default)
- reviewer@example.com / reviewer123 (role: user_reviewer)
- Je 3 Demo-Datensätze für Antrag und Person

### npm Scripts
```json
"db:push": "prisma db push",
"db:seed": "tsx prisma/seed.ts",
"db:reset": "prisma db push --force-reset && tsx prisma/seed.ts",
"db:studio": "prisma studio",
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

### REST API (native Route Handlers)
- `lib/schemas/antrag.ts`: Zod-Schemas für Create/Update Input (wiederverwendet in Formular + Route Handler)
- `app/api/antraege/route.ts`: GET + POST; `app/api/antraege/[id]/route.ts`: GET + PUT + DELETE
- Fehlerbehandlung: ungültiger Body → `NextResponse.json({ error: '...' }, { status: 400 })`
- Konzept für Studierende (Pizzeria-Analogie): URL = Speisekarte, Handler = Kellner, Zod = Bestellprüfung, Prisma = Küche

### LLM (OpenAI/together.ai)
- `lib/ai.ts`: einfacher Wrapper `askLLM(prompt: string): Promise<string>`
- Konfigurierbar per ENV: `OPENAI_API_KEY` oder `TOGETHER_AI_API_KEY`
- Demo-Seite `/ai-demo`: Textarea + Button + Response-Anzeige

### E-Mail (Resend)
- `lib/emails/templates.ts`: reine TypeScript-Funktionen, die HTML-Strings zurückgeben (z.B. `antragEingereichtHtml(titel: string): string`)
- `lib/services/emailService.ts`: `sendEmail({ to, subject, html })` via Resend SDK
- Demo: Server Action sendet Bestätigungsmail nach Antrag-Erstellen
- **Kein** `@react-email/components` oder `@react-email/render` (deprecated)

### Testing
- `vitest.config.ts`: jsdom, `@/` alias
- `__tests__/unit/validators.test.ts`: Testet Zod-Schema für `AntragCreateInput` (min. 2 Tests)
- `playwright.config.ts`: baseURL localhost:3000, Chromium
- `e2e/login.spec.ts`: Login-Flow (E-Mail + Passwort + Submit + Dashboard-Check)

### KILO_INSTRUCTIONS.md und AGENTS.md
Beide Dateien müssen vorhanden sein. Sie sind komplementär (kein duplizierter Inhalt):
- KILO_INSTRUCTIONS.md: Coding-Guide (Stack-Tabelle, Konventionen, Testing-Regeln, PIV-Loop, wann stoppen)
- AGENTS.md: Projekt-Constitution (Projektbeschreibung mit [TODO], Rollenkonzept-Tabelle,
  Scope, Stack-Verweis auf KILO_INSTRUCTIONS.md, Testing-Ansatz)

### .env.example
```env
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="generiere-32-zeichen-zufallsstring"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."
# TOGETHER_AI_API_KEY="..."
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@example.com"
```

## Abschluss-Validierung

Bevor du mir sagst «fertig», stelle sicher:
1. `npm install` – fehlerfrei
2. `npm run db:reset` (ich führe aus) – fehlerfrei, 3 Nutzer
3. `npm run test` – alle Unit Tests grün
4. `npm run dev` – fehlerfrei
5. Login mit allen 3 Rollen – korrekte Sichtbarkeit
6. Antrag-CRUD + E-Mail-Versand – funktioniert
7. LLM-Demo-Seite – gibt Antwort zurück
8. `GET /api/antraege` – liefert JSON
9. `npm run test:e2e` (ich führe aus) – Login-Test grün
10. `npm run build` – fehlerfrei

## Los geht's

Erstelle jetzt den detaillierten Schritt-für-Schritt-Plan und warte auf meine Bestätigung.
```

---

## Entschiedene Konfiguration (Zusammenfassung)

| Parameter | Entscheidung |
|---|---|
| Repo-Name | `cas-prdig-starter-kit` |
| Demo-Entitäten | `Antrag` (Status-Workflow) + `Person` (Stammdaten) |
| Rollen | `admin` / `user_applicant` / `user_reviewer` |
| Kilo Code Instructions | `KILO_INSTRUCTIONS.md` im Root (robusteste Variante) |
| Spec Kit init | Variante A: vorbereitetes `AGENTS.md`, kein `specify init` nötig |
| Testing | Vitest (Unit) + Playwright (E2E), je 1–2 Beispiel-Tests |
| Cloud-Optionen | Neon/UploadThing/Vercel: vorbereitet/auskommentiert, nicht Standard |
| LLM | OpenAI SDK / together.ai Wrapper (kein LangChain) |
| E-Mail | Resend + HTML-Template-Literals (kein React Email, keine deprecated Pakete) |
| REST API | Native Route Handlers + Zod (keine Extra-Library; Pizzeria-Analogie) |
