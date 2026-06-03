---
name: init-project
description: >
  Guides a new team through initializing a project from cas-prdig-starter-kit, including skills setup, dependencies, environment variables, database reset, and first login checks. Use it when setting up a fresh project from this starter kit. ONLY activate when the user explicitly runs /init-project or directly requests this specific workflow by name. Do NOT activate during normal development, planning, or implementation conversations.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  version: "1.1"
disable-model-invocation: true
---

# Init Project: Starter-Kit Initialisieren

## Ziel

Richte ein neues Projekt auf Basis von `cas-prdig-starter-kit` ein. Dieser Workflow ist für lokale Entwicklung und Demo via VS Code Port Forwarding gedacht.

## Voraussetzungen Prüfen

Prüfe oder fordere den Nutzer auf zu prüfen:

- Node.js >= 20
- Git
- Zugriff auf das private GitHub-Repository

## Setup-Schritte

### 1. Repository Klonen und Umbenennen

```bash
git clone [url] [neuer-projektname]
```

### 2. Ins Projektverzeichnis Wechseln

```bash
cd [neuer-projektname]
```

### 3. Skills-Symlink Einrichten (sofern auch mit Claude Code entwickelt wird)

```bash
npm run setup:skills
```

Hintergrund: `.agents/skills/` ist die Master-Quelle. Claude Code nutzt zusätzlich `.claude/skills/` als Symlink.

### 4. Dependencies Installieren

```bash
npm install
npx playwright install chromium
```

### 5. Environment Einrichten

```bash
cp .env.example .env
```

Der Nutzer öffnet `.env` und trägt Werte ein, z.B. für:

- `BETTER_AUTH_SECRET`
- `RESEND_API_KEY`, falls E-Mail verwendet wird
- `OPENAI_API_KEY` oder `TOGETHERAI_API_KEY`, falls LLM-Funktionen verwendet werden

### 6. Datenbank Einrichten

Der Nutzer führt aus:

```bash
npm run db:reset
```

Dieser Befehl nutzt `prisma db push --force-reset` und Seed-Daten.

### 7. App Starten

```bash
npm run dev
```

### 8. Testlogins Prüfen

Prüfe im Browser:

- `admin@example.com` / `a`
- `applicant@example.com` / `a`
- `reviewer@example.com` / `a`

Erwartung:

- Login funktioniert für alle drei Rollen.
- Dashboard lädt ohne Fehler.
- Rollenbasierte Navigation und Sichtbarkeit passen.

### 9. Projektkontext Ausfüllen

Öffne `AGENTS.md` und fülle alle `[TODO]`-Felder aus:

- Projektbeschreibung
- Rollenbezeichnungen und Prozessrollen
- Scope
- Datenmodell
- Team

## Entwicklungsregeln nach Setup

- Bei Prisma-Schema-Änderungen immer `npm run db:reset` ausführen.
- Nie Prisma Migrations verwenden.
- PRD-Änderungen nach fachlicher Klärung oder Dozentenfeedback mit `/update-prd` als neue PRD-Version dokumentieren und committen.
- Neue Features mit `/plan-feature` planen, `plan-v001.md` committen, in frischer Session mit `/review-feature-plan` prüfen, in der Autor-Session mit `/integrate-feature-plan-review` in eine neue Plan-Version überführen, bei späterem Änderungsbedarf `/update-feature-plan` nutzen, dann mit `/execute` umsetzen.
- Root-`TASKS.md` bleibt Feature-Index; Detailtasks liegen in `docs/project/features/[feature-name]/plan-vNNN.md`.

## Output

Gib am Ende aus:

- Welche Setup-Schritte erledigt wurden
- Welche Schritte der Nutzer noch manuell ausführen muss
- Ob die Testlogins geprüft wurden
- Welche `[TODO]`-Felder in `AGENTS.md` noch offen sind
