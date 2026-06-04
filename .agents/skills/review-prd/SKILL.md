---
name: review-prd
description: >
  Reviews an existing PRD critically in a fresh reviewer session and writes a structured, qualitative Markdown review file without changing the PRD. Use after /create-prd and before /adapt-to-project when the user explicitly runs /review-prd or directly requests a PRD review workflow. The reviewer should ideally run in a new agent session and, if possible, with a different model. ONLY activate when explicitly requested.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  piv-phase: plan
  version: "1.2"
disable-model-invocation: true
argument-hint: "[path-to-prd] [optional-previous-review-or-integration]"
---

> **KiloCode-Modus:** Dieser Skill muss im **Code-Modus** ausgeführt werden. Im Architect- oder Plan-Modus beschränkt KiloCode Schreibrechte auf `.kilo/`-Ordner – die Review-Datei würde dort abgelegt statt neben dem PRD in `docs/`. Wechsle in KiloCode vor der Ausführung auf den **Code-Modus**.

# Review PRD: PRD kritisch prüfen

## Input

Pfad zum PRD: `$ARGUMENTS`

Beispiele:

```text
/review-prd docs/project/prds/antragssystem-v001.md
/review-prd docs/project/prds/antragssystem-v002.md docs/project/prd-reviews/antragssystem-v001-r01-integration.md
```

## Zweck

Erstelle einen professionellen, kritischen Review eines bestehenden PRDs. Der Review verbessert die fachliche Qualität des PRDs, bevor `/adapt-to-project` und spätere `/plan-feature`-Schritte starten.

Dieser Skill ist die Reviewer-Seite eines mehrstufigen Ping-Pong-Prozesses:

1. Autor-Session erstellt oder überarbeitet das PRD.
2. Neue Reviewer-Session führt `/review-prd` aus und schreibt eine Review-Datei.
3. Autor-Session führt `/integrate-prd-review` aus und erstellt nach menschlicher Bestätigung die nächste PRD-Version.
4. Optional folgt eine weitere Review-Runde auf der neu entstandenen PRD-Version.

## Session-Regel

Stoppe zu Beginn und frage aktiv:

```text
Läuft diese Review-Session frisch nach /prime und ohne den langen Chatverlauf der PRD-Erstellung?
```

Fahre erst fort, wenn der Nutzer bestätigt. Wenn `/prime` noch nicht gelaufen ist, fordere den Nutzer auf, zuerst `/prime` auszuführen und danach `/review-prd` erneut zu starten.

Begründung: Der Reviewer soll das PRD so prüfen, wie ein unabhängiger fachlicher Reviewer es lesen würde. Er soll nicht vom Entstehungskontext der Autor-Session beeinflusst sein.

## Grundregeln

- Ändere das PRD nicht.
- Schreibe ausschliesslich eine Review-Datei.
- Schreibe den Review auf Deutsch.
- Vergib keinen numerischen Score.
- Prüfe streng, aber konstruktiv.
- Formuliere konkrete Verbesserungsvorschläge, die ein Autor-Agent später übernehmen oder bewusst ablehnen kann.
- Unterscheide klar zwischen echten Lücken, möglichen Widersprüchen, sinnvollen Präzisierungen und optionalen Verbesserungen.
- Bewerte nicht eigenständig, ob der Scope für ein Kursprojekt angemessen ist. Markiere Scope-Risiken und empfehle bei Bedarf Abklärung mit dem Dozenten.
- Behandle Security, Datenschutz und Compliance nur prototypengerecht. Prüfe vor allem, ob keine echten produktiven Daten, vertraulichen Unternehmensdetails oder unklaren Rollen-/Berechtigungsannahmen im PRD stehen.
- Wenn ein älteres PRD keinen Versionssuffix im Dateinamen hat, behandle es logisch als `v001`.

## Pflichtlektüre

Lies vollständig:

- PRD-Datei aus `$ARGUMENTS`
- `.agents/skills/review-prd/references/review-template.md`
- `.agents/skills/create-prd/references/prd-template.md`
- `.agents/skills/create-prd/SKILL.md`
- `AGENTS.md`
- `KILO_INSTRUCTIONS.md` oder `CLAUDE.md`, falls vorhanden
- `docs/starter-kit-usage/PIV-WORKFLOW.md`

Wenn `$ARGUMENTS` zusätzlich eine frühere Review- oder Integration-Datei enthält, lies sie ebenfalls. Nutze sie, um eine Folgerunde gezielt auf offene oder strittige Punkte zu prüfen.

Wenn das PRD auf eine Gesamtarchitektur-Markdown-Datei oder `architecture.dsl` verweist und diese im Repository verfügbar ist, darfst du sie lesen. Nutze SVG- oder PNG-Diagramme nicht als fachliche Quelle.

## Dateiname und Runde

Schreibe den Review unter:

```text
docs/project/prd-reviews/[prd-name]-[version]-rNN-review.md
```

Regeln:

- `[prd-name]`: PRD-Dateiname ohne `.md` und ohne Versionssuffix, z.B. `antragssystem`.
- `[version]`: Versionssuffix aus dem PRD-Dateinamen, z.B. `v001`. Wenn kein Suffix vorhanden ist, verwende `v001`.
- `rNN`: Review-Runde innerhalb derselben PRD-Version mit zwei Stellen, z.B. `r01`, `r02`.
- Im normalen Ping-Pong entsteht nach der Integration eine neue PRD-Version. Deshalb ist pro PRD-Version meistens nur `r01` nötig, z.B. `v001-r01-review.md`, danach `v002-r01-review.md`.
- Verwende `r02` nur, wenn dieselbe PRD-Version erneut reviewed wird, ohne dass vorher eine neue PRD-Version erzeugt wurde.
- Bestimme die Runde anhand vorhandener Dateien in `docs/project/prd-reviews/`. Wenn für diese PRD-Version keine passende Datei existiert, verwende `r01`.
- Lege `docs/project/prd-reviews/` an, falls der Ordner fehlt.
- Überschreibe keine bestehende Review-Datei. Wenn der erwartete Dateiname existiert, verwende die nächste freie Runde.

Beispiele:

```text
docs/project/prds/antragssystem-v001.md
-> docs/project/prd-reviews/antragssystem-v001-r01-review.md

docs/project/prds/antragssystem.md
-> docs/project/prd-reviews/antragssystem-v001-r01-review.md
```

## Review-Struktur

Erstelle die Review-Datei gemäss `references/review-template.md`.

Fülle alle relevanten Abschnitte konkret aus. Entferne keine Qualitätsabschnitte nur deshalb, weil sie kurz ausfallen; schreibe stattdessen `Nicht relevant` mit kurzer Begründung.

## Review-Leitfragen

Prüfe insbesondere:

- Beschreibt das PRD genau ein IT-System oder eine Komponente?
- Sind Zielgruppen, Rollen und Berechtigungen verständlich und konsistent?
- Ist die Dokumentversion klar und gibt es eine nachvollziehbare Änderungshistorie?
- Sind MVP / Minimalversion, Medium-Version, Extended-/Luxus-Version und Out of Scope klar getrennt?
- Sind User Stories, Kernfunktionen, Demo-Szenarien und Erfolgskriterien nachvollziehbar verbunden?
- Sind Datenobjekte, Statuswerte, Beziehungen und spätere Datenbedürfnisse ausreichend beschrieben?
- Sind Schnittstellen, Mocks, weggelassene Integrationen und MVP-Verhalten klar?
- Referenziert das PRD im Brownfield-/Starter-Kit-Kontext bestehende Vorgaben statt neue Stack-Entscheide zu erfinden?
- Ist "Starter Kit Nutzung" vollständig genug für `/adapt-to-project`?
- Sind Risiken, Annahmen und offene Fragen klar getrennt?
- Gibt es implizite Entscheidungen, die im PRD sichtbar gemacht werden sollten?

## Abschluss

Nach dem Schreiben:

1. Nenne den Review-Dateipfad.
2. Fasse die wichtigsten Findings kurz zusammen.
3. Weise darauf hin, dass das PRD nicht geändert wurde.
4. Weise darauf hin, dass der Nutzer jetzt zurück in die Autor-Session gehen und `/integrate-prd-review [PRD-Pfad] [Review-Datei]` ausführen soll.
