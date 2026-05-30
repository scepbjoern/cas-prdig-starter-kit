# Plan: <Feature-Name>

## Status

**Feature-Status:** planned  
**Erstellt:** YYYY-MM-DD  
**Quelle:** <User Request, PRD oder Datei>  
**Confidence Score:** <#/10 mit kurzer Begründung>

## Feature Metadata

| Feld | Wert |
|---|---|
| Feature-Typ | New Capability / Enhancement / Refactor / Bug Fix |
| Komplexität | Low / Medium / High |
| Primär betroffene Systeme | UI / Server Actions / Route Handler / Prisma / Auth / E-Mail / LLM / Tests |
| Abhängigkeiten | <Libraries, ENV-Werte, Daten, Entscheidungen> |

## Feature Description

<Detaillierte Beschreibung des Features, Zweck und Nutzen für Nutzer.>

## User Story

```text
Als <Rolle>
möchte ich <Aktion/Ziel>,
damit <Nutzen/Wert>.
```

## Problem Statement

<Welches konkrete Problem oder welche Chance adressiert das Feature?>

## Solution Statement

<Wie löst der geplante Ansatz das Problem?>

## Scope

### Im Scope

- ...

### Nicht im Scope

- ...

## Rollen und Berechtigungen

<Betroffene Rollen, Sichtbarkeit, Aktionen und Schutzregeln. Standardrollen: `admin`, `user_applicant`, `user_reviewer`.>

## Context References

### Pflichtlektüre vor Umsetzung

- `pfad/zur/datei.ts` - Warum: <konkrete Relevanz, ggf. Zeilenbereich>
- `prisma/schema.prisma` - Warum: <falls Datenmodell betroffen>
- `__tests__/unit/...` - Warum: <ähnliches Testpattern>
- `e2e/...` - Warum: <ähnlicher E2E-Flow>

### Relevante Dokumentation

- [Dokumentationstitel](https://example.com/docs#section) - Warum: <konkrete Relevanz>

## Codebase Intelligence

### Projektstruktur und Architektur

<Relevante Verzeichnisse, Komponenten-/Service-Grenzen und bestehende Patterns.>

### Patterns to Follow

- Naming: <konkrete Regel oder Beispiel>
- Datei-Organisation: <konkrete Regel oder Beispiel>
- Fehlerbehandlung: <konkrete Regel oder Beispiel>
- UI/shadcn: <konkrete Regel oder Beispiel>
- Auth/Rollen: <konkrete Regel oder Beispiel>
- Prisma: <konkrete Regel oder Beispiel>

### Anti-Patterns to Avoid

- Kein Supabase, DaisyUI, LangChain, Prisma Migrations, Raw SQL oder `new PrismaClient()` ausserhalb Singleton.
- Keine parallele Architektur neben bestehenden `src/app/`, `src/lib/`, `src/components/` Patterns.
- Keine Python-/pytest-/ruff-Regeln.

### Dependency Analysis

<Relevante Dependencies aus `package.json`, Integrationsweise und Versionen. Keine neuen Packages ohne Begründung und Bestätigung.>

### Testing Patterns

<Bestehende Vitest- und Playwright-Patterns, die gespiegelt werden sollen.>

## Architekturentscheidungen

### Gewählter Ansatz

<Beschreibung und Begründung.>

### Erwogene Alternativen

- Alternative: <Beschreibung> - Entscheidung: <warum nicht gewählt>

### Security, Performance, Maintainability

- Security: <Rollen, Inputvalidierung, Datenzugriff>
- Performance: <Rendering, DB-Zugriffe, unnötige Client Components vermeiden>
- Maintainability: <kleine Module, klare Namen, Tests>

## Datenmodell und Prisma

<Keine Änderung oder genaue geplante Änderung. Bei Schema-Änderung: Nutzer muss nach Umsetzung `npm run db:reset` ausführen. Keine Prisma Migrations.>

## Betroffene Dateien

### Bestehende Dateien

- `pfad` - Aktion und Grund

### Neue Dateien

- `pfad` - Zweck und Grund

## Implementation Plan

### Phase 1: Foundation

<Foundational work, z.B. Schema, Typen, Utilities.>

### Phase 2: Core Implementation

<Hauptlogik, UI, Server Actions, API oder Datenzugriff.>

### Phase 3: Integration

<Navigation, Rollen, bestehende Workflows, E-Mail, LLM, Statuswechsel.>

### Phase 4: Testing and Validation

<Unit, E2E, Build, manuelle Prüfung, Regressionen.>

## Step-by-Step Tasks

Wichtig: Tasks top-to-bottom ausführen. Jeder Task ist atomic und einzeln validierbar.

Aktionskeywords:

- `CREATE`: neue Datei oder Komponente
- `UPDATE`: bestehende Datei ändern
- `ADD`: Funktionalität in bestehender Datei ergänzen
- `REMOVE`: veralteten Code entfernen, nur mit expliziter Bestätigung
- `REFACTOR`: Struktur ändern ohne Verhalten zu ändern
- `MIRROR`: bestehendes Pattern bewusst spiegeln

### Task 1: <ACTION> <target_file_or_area>

**Status:** planned  
**Ziel:** <konkretes Ergebnis>  
**IMPLEMENT:** <präzise Umsetzung>  
**PATTERN:** <Datei/Zeilen/Pattern, das gespiegelt wird>  
**IMPORTS:** <notwendige Imports oder Dependencies>  
**GOTCHA:** <Fallstrick, Constraint oder Edge Case>  
**ACCEPTANCE CRITERIA:**

- [ ] <messbares Kriterium>
- [ ] <messbares Kriterium>

**VALIDATE:**

- `npm run test`
- Manuelle Prüfung: <konkrete Schritte>

## Testing Strategy

### Unit Tests

<Vitest-Tests für Zod-Schemas, Status-Mappings, Utilities oder Serverlogik.>

### E2E Tests

<Playwright-Tests für Login, CRUD, Rollen, Navigation oder Statusworkflow, falls betroffen.>

### Regression Tests

<Bestehende Vitest- oder Playwright-Tests erweitern, wenn Kernverhalten stabil bleiben muss. Keine Python-/pytest-Regressionssuite verwenden.>

### Edge Cases

- <Fehlerfall, Berechtigung, leerer Zustand, ungültige Eingabe, Statuskonflikt>

## Validation Commands

Führe diese Befehle nur aus, wenn sie für das Feature relevant sind. Dokumentiere nicht ausführbare Schritte mit Begründung.

### Level 1: Syntax, Types and Unit Tests

```bash
npm run test
```

### Level 2: End-to-End Tests

```bash
npm run test:e2e
```

### Level 3: Build

```bash
npm run build
```

### Level 4: Manual Validation

<Konkrete Browser-Schritte, Rollen-Logins und erwartete Ergebnisse. Nutzer prüft `npm run dev`.>

## Acceptance Criteria

- [ ] Feature implementiert alle Scope-Anforderungen
- [ ] Rollen und Berechtigungen sind korrekt
- [ ] Validierung mit Zod/React Hook Form ist korrekt, falls Formular betroffen
- [ ] Prisma-Änderungen sind dokumentiert, falls vorhanden
- [ ] Relevante Unit-Tests sind ergänzt und grün
- [ ] Relevante E2E- oder manuelle Flows sind validiert
- [ ] Keine bekannten Regressionen in bestehenden Kernworkflows
- [ ] Dokumentationsbedarf ist notiert

## Completion Checklist

- [ ] Alle Tasks sind umgesetzt
- [ ] Jeder Task wurde validiert
- [ ] Alle relevanten Tests laufen erfolgreich oder Ausnahmen sind begründet
- [ ] `npm run build` wurde bei grösseren Änderungen ausgeführt oder begründet ausgelassen
- [ ] Manuelle Prüfung ist dokumentiert
- [ ] Plan-/PRD-Abweichungen sind dokumentiert und genehmigt
- [ ] Feature ist bereit für `/document` und `/commit`

## Documentation Notes

<Welche Endanwender- und Entwicklerdokumentation soll der spätere `/document`-Skill erstellen?>

## Notes and Trade-offs

<Designentscheidungen, Trade-offs, offene Risiken, spätere Erweiterungen.>

## Offene Fragen

- Keine oder konkrete Fragen
