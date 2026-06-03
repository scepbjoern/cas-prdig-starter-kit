---
name: review-feature-plan
description: >
  Reviews an existing versioned feature plan critically in a fresh reviewer session and writes a structured, qualitative Markdown review file without changing the plan. Use after /plan-feature and before /execute when the user explicitly runs /review-feature-plan or directly requests a feature plan review workflow. The reviewer should ideally run in a new agent session and, if possible, with a different model. ONLY activate when explicitly requested.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  piv-phase: plan
  version: "1.0"
disable-model-invocation: true
argument-hint: "[path-to-plan] [optional-previous-review-or-integration]"
---

# Review Feature Plan: Feature-Plan kritisch prüfen

## Input

Pfad zum Feature-Plan: `$ARGUMENTS`

Beispiele:

```text
/review-feature-plan docs/project/features/antrag-formular/plan-v001.md
/review-feature-plan docs/project/features/antrag-formular/plan-v002.md docs/project/features/antrag-formular/plan-reviews/plan-v001-r01-integration.md
```

## Zweck

Erstelle einen professionellen, kritischen Review eines bestehenden Feature-Plans. Der Review verbessert Architekturentscheidungen, Task-Reihenfolge, Umsetzungsdetails und Validierbarkeit, bevor `/execute` produktiven Code schreibt.

Dieser Skill ist die Reviewer-Seite eines mehrstufigen Feature-Plan-Ping-Pongs:

1. Autor-Session erstellt oder überarbeitet einen Feature-Plan.
2. Neue Reviewer-Session führt `/review-feature-plan` aus und schreibt eine Review-Datei.
3. Autor-Session führt `/integrate-feature-plan-review` aus und erstellt nach menschlicher Bestätigung die nächste Plan-Version.
4. Optional folgt eine weitere Review-Runde auf der neu entstandenen Plan-Version.

## Session-Regel

Stoppe zu Beginn und frage aktiv:

```text
Läuft diese Review-Session frisch nach /prime und ohne den langen Chatverlauf der Feature-Planung?
```

Fahre erst fort, wenn der Nutzer bestätigt. Wenn `/prime` noch nicht gelaufen ist, fordere den Nutzer auf, zuerst `/prime` auszuführen und danach `/review-feature-plan` erneut zu starten.

## Grundregeln

- Ändere den Feature-Plan nicht.
- Schreibe ausschliesslich eine Review-Datei.
- Schreibe den Review auf Deutsch.
- Vergib keinen numerischen Score.
- Prüfe streng, aber konstruktiv.
- Fokussiere auf Umsetzbarkeit, Architektur, Reihenfolge, Task-Qualität, Tests, Risiken und Übergabereife für `/execute`.
- Bewerte nicht nur, ob der Plan plausibel klingt, sondern ob ein frischer Umsetzungsagent ihn taskweise ohne neue Architekturentscheidungen ausführen kann.
- Wenn ein älterer Plan noch `plan.md` heisst, behandle ihn logisch als `plan-v001.md`. Neue Review-/Integrationsläufe sollen versionierte Plan-Dateien verwenden.

## Pflichtlektüre

Lies vollständig:

- Plan-Datei aus `$ARGUMENTS`
- `.agents/skills/review-feature-plan/references/feature-plan-review-template.md`
- `.agents/skills/plan-feature/references/plan-template.md`
- `.agents/skills/plan-feature/SKILL.md`
- `AGENTS.md`
- `KILO_INSTRUCTIONS.md` oder `CLAUDE.md`, falls vorhanden
- `TASKS.md`
- `docs/starter-kit-usage/PIV-WORKFLOW.md`

Wenn der Plan ein PRD referenziert, lies die relevante PRD-Version. Wenn `$ARGUMENTS` zusätzlich eine frühere Review- oder Integration-Datei enthält, lies sie ebenfalls.

## Dateiname und Runde

Schreibe den Review unter:

```text
docs/project/features/[feature-name]/plan-reviews/plan-vNNN-rMM-review.md
```

Regeln:

- `[feature-name]`: Feature-Ordnername.
- `vNNN`: Plan-Version aus dem Dateinamen, z.B. `plan-v001.md`. Wenn die Datei `plan.md` heisst, verwende logisch `v001`.
- `rMM`: Review-Runde innerhalb derselben Plan-Version, z.B. `r01`, `r02`.
- Im normalen Ping-Pong entsteht nach der Integration eine neue Plan-Version. Deshalb ist pro Plan-Version meistens nur `r01` nötig, z.B. `plan-v001-r01-review.md`, danach `plan-v002-r01-review.md`.
- Verwende `r02` nur, wenn dieselbe Plan-Version erneut reviewed wird, ohne dass vorher eine neue Plan-Version erzeugt wurde.
- Lege `plan-reviews/` im Feature-Ordner an, falls der Ordner fehlt.
- Überschreibe keine bestehende Review-Datei.

## Review-Struktur

Erstelle die Review-Datei gemäss `references/feature-plan-review-template.md`.

Fülle alle relevanten Abschnitte konkret aus. Entferne keine Qualitätsabschnitte nur deshalb, weil sie kurz ausfallen; schreibe stattdessen `Nicht relevant` mit kurzer Begründung.

## Review-Leitfragen

Prüfe insbesondere:

- Passt der Feature-Plan zur referenzierten PRD-Version und plant er keinen versteckten Zusatzscope?
- Ist die Plan-Version klar und gibt es eine nachvollziehbare Plan-Änderungshistorie?
- Sind Architekturentscheidungen plausibel und passend zum Starter-Kit?
- Sind Server Components, Client Components, Server Actions, Route Handler, Prisma, Auth, E-Mail, LLM oder Upload sinnvoll abgegrenzt?
- Sind bestehende Patterns und Pflichtlektüre konkret genug referenziert?
- Sind Tasks atomar, top-to-bottom ausführbar und einzeln validierbar?
- Sind Abhängigkeiten, Reihenfolge, Gotchas und Edge Cases klar?
- Sind Validierungsschritte pro Task und für den Gesamtplan ausreichend?
- Sind Rollen, Berechtigungen, Datenmodell-Änderungen und Prisma-Reset-Hinweise korrekt?
- Kann `/execute` den Plan ohne neue Recherche oder Architekturentscheidungen starten?

## Abschluss

Nach dem Schreiben:

1. Nenne den Review-Dateipfad.
2. Fasse die wichtigsten Findings kurz zusammen.
3. Weise darauf hin, dass der Feature-Plan nicht geändert wurde.
4. Weise darauf hin, dass der Nutzer jetzt zurück in die Autor-Session gehen und `/integrate-feature-plan-review [Plan-Pfad] [Review-Datei]` ausführen soll.
