---
name: prime
description: >
  Loads the project context at the beginning of a session and summarizes the current architecture, stack, rules, tasks, and recent changes. Use this workflow before planning or implementation work when the agent needs a compact project briefing. ONLY activate when the user explicitly runs /prime or directly requests this specific workflow by name. Do NOT activate during normal development, planning, or implementation conversations.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  piv-phase: plan
  version: "1.0"
disable-model-invocation: true
---

# Prime: Projektkontext Laden

## Ziel

Baue zu Beginn einer Arbeitssession ein kompaktes, belastbares Bild des Repos auf. Schreibe keinen Code und ändere keine Dateien.

## Pflichtlektüre

Lies, falls vorhanden, diese Dateien in sinnvoller Reihenfolge:

- `CLAUDE.md` oder `KILO_INSTRUCTIONS.md`
- `AGENTS.md`
- `README.md` und weitere relevante README-Dateien in wichtigen Unterordnern
- `docs/project/architecture/Gesamtarchitektur.md`
- PRDs und Konzeptdateien unter `docs/`
- `TASKS.md`
- `package.json`
- `prisma/schema.prisma`
- zentrale Schlüsseldateien unter `src/lib/`, `src/app/`, `src/components/`

## Git-Kontext

Ermittle zusätzlich:

- Letzte Änderungen mit `git log --oneline -10`
- Aktuellen Branch, Arbeitsbaumstatus und uncommitted changes mit `git status`

## Analysefokus

Ermittle:

- Zweck des Projekts und digitalisierter Prozess
- Tech Stack und nicht verhandelbare Konventionen
- Package Manager, relevante npm-Scripts, Build- und Testbefehle aus `package.json`
- App-Struktur, Route Groups, API-Routen, Server Actions und UI-Patterns
- Next.js Entry Points wie `src/app/layout.tsx`, `src/app/page.tsx`, `src/middleware.ts`, Route Groups und `src/app/api/**/route.ts`
- Prisma-Modelle, Rollenmodell und Statusworkflows
- Teststrategie mit Vitest und Playwright
- Aktive und abgeschlossene Features laut `TASKS.md`
- Relevante TODOs, Risiken und offene Entscheidungen
- Sofortige Auffälligkeiten, Inkonsistenzen oder Risiken, die vor Planung oder Umsetzung bekannt sein sollten

## Output

Gib eine kompakte, gut scannbare Zusammenfassung mit diesen Abschnitten aus:

1. Projektübersicht
2. Architektur und wichtige Verzeichnisse
3. Tech Stack und Kernregeln
4. Aktueller Stand laut `TASKS.md`
5. Package Manager, npm-Scripts und Validierungsbefehle
6. Aktueller Branch, Arbeitsbaumstatus und letzte Änderungen aus Git
7. Auffälligkeiten, Risiken oder offene Entscheidungen
8. Mögliche nächste Planning- oder Implementation-Tasks

Halte die Zusammenfassung kurz. Keine Dateien schreiben, keine Verzeichnisse erstellen, keine Commits ausführen.
