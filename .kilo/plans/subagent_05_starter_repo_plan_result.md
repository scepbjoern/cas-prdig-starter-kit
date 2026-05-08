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
- Vercel Deployment (`docs/VERCEL_DEPLOYMENT.md`)

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
- `docs/` – Struktur: neue Docs ersetzen die alten
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
- `docs/SUPABASE_AUTH_SETUP.md`, `docs/WORKING_DATABASE_CONFIGURATION.md`, `docs/DATAVERSE_INTEGRATION.md`, `docs/RAG_CHATBOT_IMPLEMENTATION_GUIDE.md`, `docs/CONNECTION_MANAGEMENT.md` – nicht mehr relevante Docs
- `openapi.json` – CRM-spezifische OpenAPI-Spec (wird für neue Entities neu generiert)
- Prisma-Migrations-Verzeichnis falls vorhanden

#### Fehlt noch (neu erstellen)
- Better Auth Setup (`lib/auth.ts`, `lib/auth-client.ts`, `app/api/auth/[...all]/route.ts`)
- Generischer LLM-Wrapper (`lib/ai.ts` – vereinfacht)
- E-Mail-Service (`lib/services/emailService.ts`) mit HTML-Template-Literal (kein React Email)
- Generische Route Handlers (`app/api/antraege/route.ts`, `app/api/personen/route.ts`) mit Zod-Validation
- `KILO_INSTRUCTIONS.md` im Root
- `AGENTS.md` (vorbereitetes Spec Kit Template)
- `docs/VSCODE_PORT_FORWARDING.md`
- `docs/SCHEMA_RESET_WORKFLOW.md` (SQLite-Version)
- `docs/LLM_INTEGRATION.md` (einfacher Guide für OpenAI/together.ai)
- `docs/EMAIL_INTEGRATION.md` (einfacher Guide für Resend)
- `docs/REST_API_GUIDE.md` (einfacher Guide für ts-rest)
- `docs/VERCEL_DEPLOYMENT.md` (Cloud-Variante)
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
- [x] `docs/VSCODE_PORT_FORWARDING.md`
- [x] `docs/SCHEMA_RESET_WORKFLOW.md` (SQLite-Version)
- [x] `docs/LLM_INTEGRATION.md`
- [x] `docs/EMAIL_INTEGRATION.md`
- [x] `docs/REST_API_GUIDE.md` (erklärt Pizzeria-Analogie + native Route Handler + Zod)

#### Optional (Cloud-Variante, im Repo vorbereitet/auskommentiert)
- [x] Neon PostgreSQL: auskommentierter `datasource`-Block in `prisma/schema.prisma` + Anleitung in `docs/NEON_SETUP.md`
- [x] UploadThing: Stub-File `lib/storage.ts` (auskommentiert) + `docs/UPLOADTHING_SETUP.md`
- [x] Vercel: `docs/VERCEL_DEPLOYMENT.md`

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

### B4: Migrations-Plan (cas-crm-mock → Starter-Repo)

> **Empfehlung:** Neues Repository erstellen (nicht Fork), da der neue Stack zu weit vom alten abweicht. Ein Fork würde viele gelöschte Dateien und eine verwirrende Git-History hinterlassen.

#### Phase 0: Neues Repository vorbereiten

**Schritt 0.1 – Neues GitHub-Repo anlegen**
- Neues GitHub-Repo: `cas-prdig-starter-kit` (leer, ohne README)
- Lokal klonen: `git clone https://github.com/[user]/cas-prdig-starter-kit.git`
- Erwartetes Resultat: Leerer Ordner auf lokalem Rechner

**Schritt 0.2 – Next.js 16 initialisieren**
```bash
npx create-next-app@16 . --typescript --tailwind --app --src-dir no --import-alias "@/*"
```
Optionen: TypeScript ✓, Tailwind ✓, App Router ✓, kein src-Verzeichnis, Import-Alias `@/*`
- Erwartetes Resultat: `npm run dev` startet ohne Fehler, Seite lädt auf `localhost:3000`

---

#### Phase 1: Basis-Konfiguration

**Schritt 1.1 – Package.json bereinigen und erweitern**
- Entfernen (aus create-next-app Standard): nichts nötig, alles ist sauber
- Hinzufügen:
  ```bash
  npm install prisma @prisma/client better-auth react-hook-form @hookform/resolvers zod lucide-react date-fns openai together-ai resend @prisma/adapter-better-sqlite3 better-sqlite3
  npm install -D tsx dotenv @types/better-sqlite3 @playwright/test vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
  ```
- Scripts in `package.json` ergänzen:
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
- Prisma-Seed-Config:
  ```json
  "prisma": { "seed": "tsx prisma/seed.ts" }
  ```
- Playwright installieren (einmalig, Chromium): `npx playwright install chromium`
- Erwartetes Resultat: `npm install` läuft fehlerfrei

**Schritt 1.2 – `tsconfig.json` anpassen**
- `"exclude"` von `["node_modules"]` auf `["node_modules", "prisma"]` erweitern
- Grund: `prisma/seed.ts` ist ein Standalone-Skript, kein App-Code; Next.js würde es sonst beim Build kompilieren (Fehler)
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
- Betroffene Dateien: `components/ui/`, `components.json`, `app/globals.css`
- Erwartetes Resultat: `import { Button } from '@/components/ui/button'` funktioniert

---

#### Phase 2: Datenbank (Prisma + SQLite)

**Schritt 2.1 – Prisma initialisieren**
```bash
npx prisma init --datasource-provider sqlite
```
- Betroffene Dateien: `prisma/schema.prisma`, `.env`
- Erwartetes Resultat: `prisma/schema.prisma` mit `provider = "sqlite"`

**Schritt 2.2 – Schema definieren (Better Auth + generische Entitäten)**

Inhalt von `prisma/schema.prisma`:
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
  antraege Antrag[]  // Demo-Relation

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
  id          String       @id @default(cuid())
  titel       String
  beschreibung String?
  status      AntragStatus @default(ENTWURF)
  erstellerId String
  ersteller   User         @relation(fields: [erstellerId], references: [id], onDelete: Cascade)
  erstelltAm  DateTime     @default(now())
  aktualisiertAm DateTime  @updatedAt

  @@map("antraege")
}

// Demo-Entität 2: Person (generisches Stammdaten-Objekt)
model Person {
  id        String   @id @default(cuid())
  vorname   String
  nachname  String
  email     String   @unique
  telefon   String?
  adresse   String?
  erstelltAm DateTime @default(now())
  aktualisiertAm DateTime @updatedAt

  @@map("personen")
}
```

**Schritt 2.3 – `.env` und `.env.example`**
```env
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="[zufälliger-32-zeichen-string]"
BETTER_AUTH_URL="http://localhost:3000"
```
- `src/generated/` in `.gitignore` einfügen (wird nach `db:push` neu generiert, nicht committen)
- Hinweis: `prisma.config.ts` wird von `npx prisma init` automatisch erstellt mit `datasource: { url: process.env['DATABASE_URL'] }` – diese Datei **nicht manuell ändern**
- Hinweis: `prisma.config.ts` importiert `dotenv/config` – deshalb `dotenv` als devDependency nötig
- Hinweis: Das Projekt hat ein `src/`-Verzeichnis (durch shadcn-Preset). Der `@/`-Alias zeigt auf `src/`. Deshalb liegt der generierte Client in `src/generated/prisma/` (nicht im Root)
- Erwartetes Resultat: `npm run db:push` erstellt `prisma/dev.db` und `src/generated/prisma/` fehlerfrei
- **Wichtig:** `npm run db:seed` erst nach Phase 3 ausführen (Seed-Datei importiert `lib/auth.ts`)

**Schritt 2.4 – Seed-Datei**

`prisma/seed.ts`:
```typescript
// Seed-Datei: Erstellt Demo-Nutzer und Testdaten
// Pfade relativ zu prisma/ => src/ liegt eine Ebene höher
// Hinweis: seed.ts kann erst nach Phase 3 (lib/auth.ts) ausgeführt werden!
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
  // Admin-Benutzer
  await auth.api.signUpEmail({
    body: { email: 'admin@example.com', password: 'admin123', name: 'Admin Benutzer' }
  })
  await prisma.user.update({
    where: { email: 'admin@example.com' },
    data: { role: 'admin' }
  })

  // Antragsteller
  await auth.api.signUpEmail({
    body: { email: 'applicant@example.com', password: 'applicant123', name: 'Test Antragsteller' }
  })
  // role bleibt 'user_applicant' (Default)

  // Prüfer
  await auth.api.signUpEmail({
    body: { email: 'reviewer@example.com', password: 'reviewer123', name: 'Test Prüfer' }
  })
  await prisma.user.update({
    where: { email: 'reviewer@example.com' },
    data: { role: 'user_reviewer' }
  })

  const applicant = await prisma.user.findUniqueOrThrow({ where: { email: 'applicant@example.com' } })
  const admin = await prisma.user.findUniqueOrThrow({ where: { email: 'admin@example.com' } })

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
  console.log('  Admin:      admin@example.com / admin123')
  console.log('  Applicant:  applicant@example.com / applicant123')
  console.log('  Reviewer:   reviewer@example.com / reviewer123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```
- Erwartetes Resultat: `npm run db:seed` läuft fehlerfrei, 3 Nutzer und 6 Datensätze in DB

---

#### Phase 3: Better Auth Setup

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

`src/middleware.ts` (Next.js erkennt middleware.ts auch in src/):
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

- Erwartetes Resultat: `npm run dev` → Login-Seite erscheint, nach Login Dashboard sichtbar

---

#### Phase 4: UI-Aufbau (Layout + shadcn/ui + CRUD)

Geschützte Seiten unter Route Group `src/app/(app)/...`; `/login` bleibt ausserhalb. Forms via RHF + Zod + shadcn `<Form>`; Submit via Server Action mit identischem Zod-Schema serverseitig. Toast-Feedback via `sonner`.

**Schritt 4.0 – Fundament**
- Zusätzliche shadcn-Komponenten: `npx shadcn@latest add form textarea dialog sonner skeleton`
- `src/lib/auth-helpers.ts` – `getSession()` (wraps `auth.api.getSession({ headers: await headers() })`), `requireSession()` (redirect → `/login`), `requireRole(roles[])` (forbidden/redirect), Type `Role`
- `src/lib/antrag-status.ts` – Label-, Variant- und Transitions-Mapping pro Status
- `src/lib/navigation.ts` – zentrale Nav-Liste `{ href, label, icon, roles[] }` (von Sidebar konsumiert)
- `src/app/layout.tsx` – `<Toaster />` ergänzen

**Schritt 4.1 – Login-Seite refactorn**
- `src/lib/schemas/auth.ts` – `loginSchema = z.object({ email, password })`
- `src/app/login/page.tsx` – shadcn Card + RHF Form; `signIn.email(...)` aus `@/lib/auth-client`; Fehler → Toast + Inline; Erfolg → `router.replace('/')`

**Schritt 4.2 – App-Shell**
- `src/app/(app)/layout.tsx` – Server Component: `requireSession()` → `<AppShell session={...}>`
- `src/components/app-shell.tsx` – Two-Column-Layout (Sidebar Desktop + Sheet Mobile)
- `src/components/sidebar.tsx` – filtert NAV_ITEMS nach Rolle, hebt aktive Route hervor
- `src/components/topbar.tsx` – Rollen-Badge, Avatar, DropdownMenu (Logout via Server Action)
- `src/app/(app)/actions.ts` – `logoutAction()` → `auth.api.signOut(...)` + `redirect('/login')`
- `src/app/page.tsx` → verschieben nach `src/app/(app)/page.tsx`

**Schritt 4.3 – Dashboard**
- `src/app/(app)/page.tsx` – Server Component; rollenabhängige KPI-Cards via `Promise.all` (Antrag-Counts, Personen-Count, User-Count); `loading.tsx` mit Skeleton

**Schritt 4.4 – Demo-Entität: Anträge**
- `src/lib/schemas/antrag.ts` – `antragCreateSchema`, `antragUpdateSchema`, `antragStatusSchema`
- `src/app/(app)/antraege/actions.ts` – `createAntrag`, `updateAntrag`, `submitAntrag`, `decideAntrag`, `deleteAntrag`; alle mit `requireSession()` + Zod-Parse + Authz + `revalidatePath`
- `src/app/(app)/antraege/page.tsx` – rollenbasierte Query; Table + Status-Badge + Aktionen
- `src/components/antraege/antrag-form.tsx` – RHF + Zod, mode="create"|"edit"
- `src/app/(app)/antraege/neu/page.tsx` – `requireRole(['user_applicant', 'admin'])`
- `src/app/(app)/antraege/[id]/page.tsx` – Stammdaten + Status-Block (Buttons je Rolle + Confirm-Dialog) + Edit-Modus
- `loading.tsx` + `error.tsx` für `/antraege` und `/antraege/[id]`

**Schritt 4.5 – Demo-Entität: Personen** (kein Status-Workflow)
- `src/lib/schemas/person.ts`, `src/app/(app)/personen/actions.ts` – CRUD; Schreiben nur admin/reviewer
- Liste, Neu, Detail analog zu Anträgen; `<PersonForm />` wiederverwendbar

**Schritt 4.6 – Aufräumen**
- `npm run lint` → 0 Fehler; `npm run build` → alle Routen kompilieren

- Erwartetes Resultat: 3 Rollen melden sich an, sehen Rolle-spezifische Nav + KPIs; Antrag-Workflow (ENTWURF→EINGEREICHT→GENEHMIGT/ABGELEHNT) funktioniert; Personen-CRUD funktioniert

---

#### Phase 5: Route Handlers / LLM / E-Mail Infrastruktur

**Schritt 5.1 – Native Route Handlers**
- `lib/schemas/antrag.ts` – Zod-Schemas für AntragCreateInput, AntragUpdateInput (server- und clientseitig wiederverwendet)
- `app/api/antraege/route.ts` – GET (Liste) + POST (erstellen) mit Zod-Validation
- `app/api/antraege/[id]/route.ts` – GET (Detail) + PUT (aktualisieren) + DELETE
- Erwartetes Resultat: `GET /api/antraege` liefert JSON-Liste, POST mit ungültigem Body gibt 400 zurück

**Schritt 5.2 – LLM-Wrapper**
- `lib/ai.ts` – einfacher Chat-Completion-Wrapper; konfigurierbar für OpenAI oder together.ai
- Demo: eine Seite mit Textarea + «Zusammenfassen»-Button, der LLM aufruft
- Erwartetes Resultat: LLM-Response erscheint auf der Demo-Seite

**Schritt 5.3 – E-Mail-Service**
- `lib/services/emailService.ts` – `sendEmail({ to, subject, html })` Funktion via Resend
- `lib/emails/templates.ts` – einfache TypeScript-Funktionen, die HTML-Strings zurückgeben (kein React, kein JSX)
- Demo: Server Action sendet nach Antrag-Erstellen eine Bestätigungsmail
- Erwartetes Resultat: E-Mail erscheint im Resend Dashboard

---

#### Phase 6: Dokumentation und Instructions

**Schritt 6.1 – `KILO_INSTRUCTIONS.md`** (Inhalt aus B2, ins Root-Verzeichnis)

**Schritt 6.2 – `AGENTS.md`** (Inhalt aus B3, teilweise ausgefüllt)

**Schritt 6.3 – `README.md`**
```markdown
# cas-prdig-starter-kit

Starter-Repo für den CAS Prozessdigitalisierung, ZHAW.
Enthält: Next.js 15 · shadcn/ui · Better Auth · Prisma + SQLite · ts-rest · OpenAI · Resend

## Setup (5 Schritte)

1. Repository klonen: `git clone https://github.com/[user]/cas-prdig-starter-kit.git`
2. Dependencies installieren: `npm install`
3. Playwright installieren: `npx playwright install chromium`
4. `.env.local` erstellen (Vorlage: `.env.example`) und API-Keys einfügen
5. Datenbank einrichten: `npm run db:reset` → dann `npm run dev` → http://localhost:3000

**Testlogins:** admin@example.com / admin123 | applicant@example.com / applicant123 | reviewer@example.com / reviewer123

## Hilfreiche Befehle

| Befehl | Zweck |
|---|---|
| `npm run db:push` | Schema in DB übernehmen |
| `npm run db:seed` | Testdaten laden |
| `npm run db:reset` | DB zurücksetzen + Testdaten |
| `npm run db:studio` | Prisma Studio (DB-Browser) |
| `npm run test` | Unit Tests (Vitest) |
| `npm run test:e2e:ui` | E2E Tests visuell (Playwright) |

## Docs

- `docs/SCHEMA_RESET_WORKFLOW.md` – Schema ändern
- `docs/VSCODE_PORT_FORWARDING.md` – Demo teilen
- `docs/LLM_INTEGRATION.md` – OpenAI/together.ai nutzen
- `docs/EMAIL_INTEGRATION.md` – Resend nutzen
- `docs/REST_API_GUIDE.md` – REST API mit nativen Route Handlers + Zod (inkl. Pizzeria-Analogie)
```

**Schritt 6.4 –** `docs/SCHEMA_RESET_WORKFLOW.md`, `docs/VSCODE_PORT_FORWARDING.md`, `docs/LLM_INTEGRATION.md`, `docs/EMAIL_INTEGRATION.md`, `docs/REST_API_GUIDE.md`, `docs/NEON_SETUP.md`, `docs/UPLOADTHING_SETUP.md`, `docs/VERCEL_DEPLOYMENT.md`

---

#### Phase 7: Testing-Setup + Beispiel-Tests

**Schritt 7.1 – Vitest konfigurieren**
- `vitest.config.ts` – jsdom environment, `@/` import alias
- `vitest.setup.ts` – `@testing-library/jest-dom` importieren
- `__tests__/unit/validators.test.ts` – Beispiel: Zod-Schema für `AntragCreateInput` testen
- Erwartetes Resultat: `npm run test` – 1 Test grün

**Schritt 7.2 – Playwright konfigurieren**
- `playwright.config.ts` – baseURL localhost:3000, Chromium
- `e2e/login.spec.ts` – Beispiel: Login-Flow (E-Mail eingeben, Passwort, Submit, Dashboard sichtbar)
- Erwartetes Resultat: `npm run test:e2e` – 1 Test grün (Dev-Server muss laufen)

---

#### Phase 8: Finale Validierung

**Checkliste vor erstem Commit:**
- [ ] `npm install` – fehlerfrei
- [ ] `npm run db:reset` – fehlerfrei, 3 Nutzer + 6 Datensätze
- [ ] `npm run dev` – startet ohne Fehler
- [ ] Login mit admin@example.com – alle Menüpunkte sichtbar
- [ ] Login mit applicant@example.com – nur Antragsteller-Menü sichtbar
- [ ] Login mit reviewer@example.com – nur Prüfer-Menü sichtbar
- [ ] Antrag erstellen (als applicant) – funktioniert
- [ ] Antrag-Status ändern (als reviewer) – funktioniert
- [ ] Person erstellen – funktioniert
- [ ] E-Mail wird nach Antrag-Erstellen gesendet (Resend Dashboard)
- [ ] LLM-Demo-Seite gibt Antwort zurück
- [ ] `GET /api/antraege` liefert JSON
- [ ] `npm run test` – alle Unit Tests grün
- [ ] `npm run test:e2e` – Login-E2E-Test grün
- [ ] `npm run build` – fehlerfrei

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
└── docs/
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
