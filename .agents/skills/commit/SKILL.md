---
name: commit
description: >
  Creates clean, atomic Git commits using Conventional Commits 1.0.0 after inspecting the working tree and grouping changes into logical units. Use it when the user wants the current approved changes committed. ONLY activate when the user explicitly runs /commit or directly requests this specific workflow by name. Do NOT activate during normal development, planning, or implementation conversations.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  piv-phase: validate
  version: "1.0"
disable-model-invocation: true
---

# Commit: Sauberen Commit Erstellen

## Ziel

Erstelle einen oder mehrere kleine, nachvollziehbare Git-Commits nach Conventional Commits 1.0.0.

Referenz: https://www.conventionalcommits.org/en/v1.0.0/

## Schritt 1: Änderungen Prüfen

Führe aus:

```bash
git status
git diff HEAD
git status --porcelain
```

Bewerte:

- Welche Dateien geändert wurden
- Ob Änderungen zu einer einzigen logischen Einheit gehören
- Ob mehrere Atomic Commits nötig sind
- Ob sensible Dateien wie `.env` oder Credentials betroffen sind
- Im Mehrpersonen-Fall: ob die Änderungen zum eigenen Feature, zur eigenen Plan-Datei und zum vorgesehenen Branch laut `TASKS.md` gehören

Committe keine Secrets.
Commite keine unabhängigen Änderungen in einem gemeinsamen Commit.
Commite im Mehrpersonen-Fall keine fremden parallelen Änderungen, auch wenn sie im Arbeitsbaum liegen.

## Schritt 2: Logical Units Bilden

Wenn mehrere unabhängige Concerns vorhanden sind, teile sie in mehrere Commits auf.

Beispiele:

- `feat(auth): add reviewer approval flow`
- `test(antrag): cover status transitions`
- `docs: describe PIV workflow`

Mische nicht Refactoring, Feature-Implementation und Dokumentation, wenn sie unabhängig sind.

## Schritt 3: Commit-Message Vorschlagen

Format:

```text
<type>(optional-scope): <short description>

[optional body]

[optional footer]
```

Erlaubte Typen:

- `feat`
- `fix`
- `docs`
- `style`
- `refactor`
- `test`
- `chore`
- `build`
- `ci`
- `perf`

Regeln:

- Imperativ verwenden: `add`, nicht `added`
- Subject ohne Punkt am Ende
- Subject maximal 72 Zeichen
- Scope verwenden, wenn sinnvoll
- Body erklärt das Warum, nicht nur das Was
- Breaking Changes mit `!` und `BREAKING CHANGE:` markieren

## Schritt 4: Bestätigung Einholen

Zeige vor dem Commit:

- Vorgeschlagene Commit-Aufteilung
- Dateien pro Commit
- Commit-Message(s)
- Kurzbegründung

Warte auf menschliche Bestätigung, bevor du commitest.

## Schritt 5: Committen

Stage nur die Dateien der bestätigten logischen Einheit und erstelle den Commit.
Im Mehrpersonen-Fall stage nur Dateien, die zum eigenen Feature gehören; lasse fremde uncommitted Änderungen unangetastet.

Nach jedem Commit:

```bash
git status
```

## Schritt 6: Push Nur Anbieten

Nach erfolgreichem Commit darfst du anbieten:

```bash
git push origin <current-branch>
```

Führe den Push nur nach expliziter Bestätigung aus.

## Qualitätsregeln

- Kein Commit ohne bewusstes Staging.
- Keine interaktiven Git-Kommandos verwenden.
- Keine destruktiven Git-Kommandos verwenden.
- Nicht amendieren, ausser der Nutzer fordert es ausdrücklich.
- Repository soll nach jedem Commit funktionsfähig bleiben.
