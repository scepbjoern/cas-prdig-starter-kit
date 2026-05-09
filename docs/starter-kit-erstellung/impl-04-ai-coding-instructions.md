# Teil 4: AI Coding Instructions – KILO_INSTRUCTIONS.md, AGENTS.md + weitere Dateien

> **Hauptdokument:** `impl-00-einstieg.md` → Abschnitte B2 und B3  
> **Tech-Stack-Entscheidungen:** `impl-00-tech-stack-decisions.md` → alle Abschnitte relevant  
> **Voraussetzungen:** Teil 1 abgeschlossen (Projektstruktur muss existieren)

---

## Übersicht: Dateien für Kilo Code / Spec Kit

| Datei | Ort | Zweck |
|---|---|---|
| `KILO_INSTRUCTIONS.md` | Repository-Root | Coding-Guide – wie Kilo Code in diesem Projekt arbeitet |
| `AGENTS.md` | Repository-Root | Projekt-Constitution – Kontext, Rollen, Scope |
| `.kiloignore` | Repository-Root | Welche Dateien Kilo Code ignorieren soll |
| `docs/SPEC_KIT_INIT.md` | `docs/` | Anleitung für GitHub SpecKit init |
| `TASKS.md` | Repository-Root | Vorlage für neue Feature-Tasks |

---

## Schritt 6.1 – `KILO_INSTRUCTIONS.md` erstellen

**Dateiort:** `KILO_INSTRUCTIONS.md` im Repository-Root

> **Lade-Verhalten:** Kilo Code lädt diese Datei automatisch als Kontext bei jeder neuen Session (analog zu Cursor's `.cursorrules`).

```markdown
# KILO_INSTRUCTIONS.md – Coding-Guide für cas-prdig-starter-kit

> Diese Datei steuert, wie Kilo Code in diesem Projekt arbeitet.
> Projektkontext (Was/Warum) → siehe AGENTS.md

## Tech-Stack (nicht verhandelbar)

| Bereich | Technologie |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS + shadcn/ui (Radix, Nova) |
| Icons | lucide-react |
| Formulare | React Hook Form + Zod (zodResolver) |
| ORM | Prisma 7 – SQLite lokal (Singleton: `src/lib/prisma.ts`) |
| Auth | Better Auth (Prisma-Adapter, 3 Rollen: `admin`/`user_applicant`/`user_reviewer`) |
| REST API | Native Next.js Route Handlers + Zod (Pizzeria-Analogie: URL = Speisekarte, Handler = Kellner, Zod = Bestellprüfung) |
| LLM | OpenAI SDK oder together.ai (`src/lib/ai.ts`, kein LangChain, kein RAG) |
| E-Mail | Resend + HTML-Template-Strings (`src/lib/services/emailService.ts`, kein React Email) |
| File Upload | `public/uploads/` + Node.js `fs` (lokal), optional UploadThing |
| Testing | Vitest (Unit) + Playwright (E2E) |
| Deployment | Lokal via VS Code Port Forwarding |

**Verboten:** Supabase, DaisyUI, Redux, Axios, LangChain, ts-rest, tRPC, Raw-SQL, `new PrismaClient()` ohne Adapter.

## Sprache und Stil

- UI-Texte: **Deutsch**
- Code: **TypeScript strict** (kein `any`, kein unbegründetes `as`)
- Kommentare: **Deutsch**, laienverständlich; jede neue Datei mit 1–2 Sätzen Kopf-Kommentar
- Namen: ausführlich und selbsterklärend (`createAntragAction`, `validateFormData`)
- Keine Emojis, ausser explizit gewünscht

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

## Datenbankzugriff (Prisma 7)

- Import immer: `import { prisma } from '@/lib/prisma'`
- **NIE** `new PrismaClient()` direkt aufrufen – immer den Singleton verwenden
- Prisma 7: PrismaClient benötigt Adapter (bereits in `lib/prisma.ts` konfiguriert)
- Nach Schema-Änderungen **Benutzer auffordern** (nicht selbst ausführen):
  ```
  npx prisma db push --force-reset
  npx prisma db seed
  ```

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
- Erklärung für Studierende: URL = Speisekarte, Handler = Kellner, Zod = Bestellprüfung, Prisma = Küche

## LLM Integration (OpenAI / together.ai)

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
1. **Plan** – Task in `TASKS.md` definieren + Akzeptanzkriterien
2. **Implement** – Code + Unit-Test schreiben
3. **Validate** – `npm run test` grün? → `npm run dev` fehlerfrei? → committen

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
- Kein Commit ohne grüne Tests und laufenden Dev-Server
- Kleine, fokussierte Commits pro Feature
```

---

## Schritt 6.2 – `AGENTS.md` erstellen

**Dateiort:** `AGENTS.md` im Repository-Root

> **Hinweis:** `AGENTS.md` enthält den *Projektkontext* (Was/Warum/Wer). Coding-Regeln → `KILO_INSTRUCTIONS.md`. Kein `specify init` nötig – diese Datei ist bereits im Spec Kit-Format.

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

Kerntechnologien: Next.js 16 · shadcn/ui · Prisma 7 + SQLite · Better Auth · OpenAI/together.ai · Resend

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
- Rollenbasierter Zugriff
- E-Mail-Benachrichtigungen bei Statuswechseln
- LLM-Unterstützung für [TODO: konkreter Use Case]
- Lokaler Betrieb via VS Code Port Forwarding

**Ausserhalb des Scope:**
- Mobile-Optimierung
- Produktions-Deployment mit echten Benutzerdaten
- Komplexe externe API-Integrationen

## Testing-Ansatz

- **Vitest** für Unit Tests (Zod-Schemas, Validierungslogik)
- **Playwright** für E2E Tests (Login, CRUD-Flows)
- PIV-Loop: Plan → Implement → `npm run test` → Commit

## Datenmodell

[TODO: Entitäten und Relationen des eigenen Prozesses hier eintragen]

Demo-Entitäten im Starter-Kit (als Muster, anpassen/ersetzen):
- `Antrag`: id, titel, beschreibung, status (ENTWURF/EINGEREICHT/GENEHMIGT/ABGELEHNT), ersteller
- `Person`: id, vorname, nachname, email, telefon, adresse

## Entwicklungsstand

[TODO: Wird via TASKS.md verwaltet]

## Team

[TODO: Gruppenname, Mitglieder, Kursjahrgang]
```

---

## Schritt 6.3 – `.kiloignore` erstellen

**Dateiort:** `.kiloignore` im Repository-Root

Dateien, die Kilo Code nicht in den Kontext laden soll (zu gross, auto-generiert oder irrelevant):

```
# Auto-generierte Dateien
src/generated/
.next/
node_modules/

# Hochgeladene Dateien (gross, nicht relevant für Code-Kontext)
public/uploads/

# Build-Artefakte
out/
dist/

# Datenbank-Dateien
prisma/dev.db
prisma/dev.db-journal

# Test-Reports
playwright-report/
test-results/
coverage/

# Lock-Dateien (gross, kein Mehrwert im Kontext)
package-lock.json
yarn.lock
pnpm-lock.yaml
```

---

## Schritt 6.4 – `docs/SPEC_KIT_INIT.md` erstellen

Anleitung für Studierende, die GitHub SpecKit nutzen möchten:

```markdown
# SpecKit Initialisierung

Das Starter-Kit enthält bereits eine vorbereitete `AGENTS.md` (Variante A).
SpecKit-Befehle können trotzdem genutzt werden, um den Kontext zu erweitern.

## Vorgefertigte AGENTS.md anpassen (empfohlen)

1. `AGENTS.md` öffnen
2. Alle `[TODO]`-Einträge mit eurem Projektinhalt ersetzen:
   - Projektbeschreibung (2–3 Sätze)
   - Rollen-Tabelle anpassen
   - Scope definieren
   - Team-Info ergänzen
3. Commit: `git commit -m "docs: AGENTS.md für [Projektname] angepasst"`

## Optional: SpecKit CLI nutzen

```bash
npx spec-kit init   # Erweitert AGENTS.md interaktiv
npx spec-kit plan   # Erstellt PLAN.md
npx spec-kit tasks  # Erstellt TASKS.md
```

## TASKS.md Vorlage

Neue Tasks im Format:
```markdown
## Task: [Feature-Name]

**Ziel:** [Was soll nach Abschluss funktionieren?]

**Akzeptanzkriterien:**
- [ ] Unit-Test in `__tests__/unit/` grün
- [ ] `npm run dev` fehlerfrei
- [ ] Manueller Test: [Schritt-für-Schritt Beschreibung]

**Betroffene Dateien:**
- `src/...`
```
```

---

## Schritt 6.5 – `TASKS.md` Vorlage erstellen

**Dateiort:** `TASKS.md` im Repository-Root

```markdown
# TASKS.md – Feature-Tasks

> Aktuelle und abgeschlossene Feature-Tasks für dieses Projekt.
> Format: Jede Task mit Ziel, Akzeptanzkriterien und Status.

---

## Vorlage für neue Tasks

Kopiere diesen Block und fülle ihn aus:

```
## Task: [Feature-Name]

**Status:** [ ] Offen / [x] Abgeschlossen
**Erstellt:** [Datum]

**Ziel:** [Was soll nach Abschluss funktionieren? 1–2 Sätze]

**Akzeptanzkriterien:**
- [ ] Unit-Test in `__tests__/unit/[datei].test.ts` grün
- [ ] `npm run dev` startet fehlerfrei
- [ ] Manueller Test: [Schritt-für-Schritt]
- [ ] `npm run build` fehlerfrei

**Betroffene Dateien:**
- `src/app/(app)/...`
- `src/lib/...`
```

---

## Task: Demo-Setup (Starter-Kit Grundgerüst)

**Status:** [x] Abgeschlossen

**Ziel:** Funktionierende Next.js-App mit Auth, Prisma, shadcn/ui und 3 Testnutzern.

**Akzeptanzkriterien:**
- [x] `npm run db:reset` läuft fehlerfrei
- [x] Login mit allen 3 Rollen funktioniert
- [x] Dashboard zeigt rollenspezifische KPIs
- [x] Antrag-Workflow (ENTWURF → EINGEREICHT → GENEHMIGT/ABGELEHNT) funktioniert
- [x] `npm run build` fehlerfrei
```

---

## Nächste Schritte

- **Teil 5** (Dateiupload): `docs/impl-05-file-upload.md`
- **Teil 8** (Dokumentation): `docs/impl-08-documentation.md` (enthält KILO_INSTRUCTIONS und AGENTS als echte Dateien im Projekt)
