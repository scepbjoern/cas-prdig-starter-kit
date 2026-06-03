---
name: create-rules
description: >
  Creates or updates project instruction files by analyzing the stack, repository structure, conventions, and available PIV skills. Use it when the project rules need to be generated or refreshed. ONLY activate when the user explicitly runs /create-rules or directly requests this specific workflow by name. Do NOT activate during normal development, planning, or implementation conversations.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  version: "2.0"
disable-model-invocation: true
---

# Create Rules: Instructions Aktualisieren

## Ziel

Erstelle oder aktualisiere die projektspezifischen Instructions-Dateien für Agenten, ohne tool-spezifische Workflow-Duplikate zu erzeugen.

Zieldateien:

- `CLAUDE.md`
- `KILO_INSTRUCTIONS.md`
- `AGENTS.md`

## Analyse

Lies mindestens:

- `package.json`
- `prisma/schema.prisma`
- `KILO_INSTRUCTIONS.md`, falls vorhanden
- `CLAUDE.md`, falls vorhanden
- `AGENTS.md`, falls vorhanden
- `TASKS.md`
- zentrale Dateien unter `src/lib/`, `src/app/`, `src/components/`
- verfügbare Skills unter `.agents/skills/`

Ermittle:

- Framework und Runtime-Versionen
- Datenbank- und Prisma-Setup
- Better-Auth-Rollenmodell
- Testbefehle und vorhandene Teststruktur
- Styling- und UI-Konventionen
- verbotene Technologien und Anti-Patterns
- PIV-Workflow und Skill-Aufrufe

## Ausgabeprinzipien

### `KILO_INSTRUCTIONS.md`

Diese Datei ist der ausführliche Coding-Guide. Sie soll enthalten:

- Tech Stack und Verbote
- Sprache, Stil und TypeScript-Regeln
- Projektstruktur
- Next.js-Konventionen
- Prisma- und Better-Auth-Regeln
- REST API, LLM, E-Mail und Upload-Konventionen, falls im Projekt vorhanden
- Testing mit Vitest und Playwright
- PIV-Loop mit `TASKS.md` als Feature-Index, `docs/project/features/[feature-name]/plan-v001.md` als initialem Plan, Feature-Plan-Review, Review-Integration und `docs/project/features/[feature-name]/plan-vNNN.md` als versionierter Arbeitsgrundlage für `/execute`
- Versionierte PRD-Updates mit `/update-prd`, wenn fachliche Klärungen, Dozentenfeedback oder beim Planen erkannte PRD-Widersprüche eine neue PRD-Version erfordern
- Versionierte Feature-Plan-Updates mit `/update-feature-plan`, wenn PRD-Updates, Planfehler, Ausführungsbefunde oder technische Klärungen eine neue Plan-Version erfordern
- Verfügbare PIV-Skills aus `.agents/skills/`
- Verdachtsbasierte Abschluss-Reflexion mit `/reflect-rules`, damit wiederholbare Agent-Fehler, Planlücken und wiederholte Nutzerkorrekturen in derselben Session in Regelvorschläge überführt werden können
- Stop-and-ask-Regeln
- Commit-Konventionen

### `CLAUDE.md`

Diese Datei ist kompakt. Sie soll:

- auf `KILO_INSTRUCTIONS.md` als primäre Quelle verweisen
- den Stack kurz nennen
- auf `.agents/skills/` und die Claude-Code-Bridge `.claude/skills/` hinweisen
- klarstellen, dass PIV-Skills nur auf expliziten Aufruf aktiviert werden

### `AGENTS.md`

Diese Datei beschreibt den allgemeinen Projektkontext. Sie soll:

- keine Spec-Kit-Sprache enthalten
- Projektbeschreibung, Rollen, Scope, Datenmodell und Team-TODOs enthalten
- auf `KILO_INSTRUCTIONS.md` für Coding-Regeln verweisen
- keine detaillierten Workflow-Regeln duplizieren

## Skill-Referenzblock

Nutze diesen Block, wenn eine Instructions-Datei Skill-Referenzen braucht:

```markdown
## Verfügbare PIV-Skills

Skills liegen in `.agents/skills/`. Aufruf per `/skill-name` im Chat.
Nie automatisch aktivieren – immer nur auf expliziten Aufruf.

| Skill | Aufruf | PIV-Phase |
|---|---|---|
| prime | `/prime` | Session-Start: Projekt-Kontext laden |
| create-prd | `/create-prd [Dateiname]` | Setup/Plan: PRD-Entwurf als `v001` generieren |
| review-prd | `/review-prd [Pfad-zum-PRD]` | Setup/Plan: PRD in frischer Reviewer-Session kritisch prüfen |
| integrate-prd-review | `/integrate-prd-review [Pfad-zum-PRD] [Pfad-zum-Review]` | Setup/Plan: Review bewerten, PRD überarbeiten und Integration dokumentieren |
| update-prd | `/update-prd [Pfad-zum-PRD]` | Setup/Plan: PRD aufgrund fachlicher Klärung versioniert aktualisieren |
| adapt-to-project | `/adapt-to-project [Pfad-zum-PRD]` | Setup: Demo-Code nach bestätigtem PRD bereinigen, Build validieren |
| plan-feature | `/plan-feature [Feature]` | Plan: initialen Feature-Plan `plan-v001.md` erstellen |
| review-feature-plan | `/review-feature-plan [Pfad-zum-Plan]` | Plan: Feature-Plan in frischer Reviewer-Session kritisch prüfen |
| integrate-feature-plan-review | `/integrate-feature-plan-review [Pfad-zum-Plan] [Pfad-zum-Review]` | Plan: Review bewerten und neue Plan-Version erstellen |
| update-feature-plan | `/update-feature-plan [Pfad-zum-Plan]` | Plan: Feature-Plan aufgrund PRD-Update, Planfehler oder technischer Klärung versioniert aktualisieren |
| execute | `/execute [Pfad-zum-Plan]` | Implement: Task-by-Task umsetzen |
| document | `/document [Pfad-zum-Plan]` | Validate/Docs: Feature-Dokumentation erstellen |
| reflect-rules | `/reflect-rules [Pfad-zum-Plan]` | Validate/Retro: Agent-Regeln und Skills verbessern |
| commit | `/commit` | Commit: Konventionellen Commit erstellen |
| create-rules | `/create-rules` | Setup: Instructions-Dateien aktualisieren |
| init-project | `/init-project` | Setup: Projekt initialisieren |
```

## Regeln

- Keine tool-spezifischen Commands neu erzeugen.
- `.agents/skills/` ist die kanonische Skill-Quelle.
- Bestehende projektspezifische Inhalte erhalten, wenn sie nicht veraltet oder widersprüchlich sind.
- Bei Unsicherheit über Projektinhalt kurz fragen statt raten.

## Output

Nach Aktualisierung:

- Geänderte Dateien auflisten
- Wichtigste inhaltliche Änderungen zusammenfassen
- Offene TODOs oder Annahmen nennen
