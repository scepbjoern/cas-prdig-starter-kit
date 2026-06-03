---
name: integrate-feature-plan-review
description: >
  Integrates a structured feature plan review back into the authored feature plan after human confirmation, writes a mandatory integration file, creates the next versioned plan file, and prepares that new plan version for another review round or for /execute. Use in the original author session after /review-feature-plan when the user explicitly runs /integrate-feature-plan-review or directly requests feature plan review integration. ONLY activate when explicitly requested.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  piv-phase: plan
  version: "1.0"
disable-model-invocation: true
argument-hint: "[path-to-plan] [path-to-review]"
---

# Integrate Feature Plan Review: Review in Feature-Plan einarbeiten

## Input

Pfad zum Feature-Plan und zur Review-Datei: `$ARGUMENTS`

Beispiel:

```text
/integrate-feature-plan-review docs/project/features/antrag-formular/plan-v001.md docs/project/features/antrag-formular/plan-reviews/plan-v001-r01-review.md
```

## Zweck

Bewerte die Review-Vorschläge kritisch, hole menschliche Entscheidungen ein, erstelle danach eine neue Feature-Plan-Version und schreibe eine verpflichtende Integration-Datei. Diese Datei dokumentiert, welche Review-Punkte übernommen, teilweise übernommen, abgelehnt oder offengelassen wurden.

## Session-Regel

Frage zu Beginn aktiv:

```text
Läuft diese Integration in der ursprünglichen Autor-Session, in der der Feature-Plan erstellt oder zuletzt überarbeitet wurde?
```

Die Integration soll in der ursprünglichen Autor-Session laufen. Fahre erst fort, wenn der Nutzer bestätigt, dass dies die Autor-Session ist.

## Grundregeln

- Erzeuge immer eine neue Plan-Version. Ändere die geprüfte Ausgangsversion nicht.
- Schreibe die neue Plan-Version erst nach menschlicher Bestätigung der Integrationsentscheidungen.
- Schreibe immer eine Integration-Datei.
- Schreibe Plan und Integration-Datei auf Deutsch.
- Übernimm Review-Vorschläge nicht blind. Bewerte jeden Vorschlag gegen PRD, Projektkontext, Plan-Template, Starter-Kit-Regeln, Codebase-Patterns und bekannte Autor-Entscheidungen.
- Markiere Entscheidungen klar als `übernehmen`, `teilweise übernehmen`, `ablehnen` oder `offen lassen`.
- Wenn ein Review-Punkt sachlich korrekt ist, aber auf eine bewusste Autor-Entscheidung trifft, mache diese Entscheidung in der neuen Plan-Version sichtbar, falls sie für `/execute` relevant ist.
- Führe keine Produktivcode-Änderungen durch.
- Wenn ein älterer Plan noch `plan.md` heisst, behandle ihn logisch als `plan-v001.md`.
- Wenn die Ausgangsversion `plan-v001.md` ist, schreibe den integrierten Plan als `plan-v002.md`. Bei `plan-v002.md` schreibe `plan-v003.md` usw.

## Pflichtlektüre

Lies vollständig:

- Plan-Datei aus `$ARGUMENTS`
- Review-Datei aus `$ARGUMENTS`
- `.agents/skills/integrate-feature-plan-review/references/feature-plan-integration-template.md`
- `.agents/skills/plan-feature/references/plan-template.md`
- `.agents/skills/plan-feature/SKILL.md`
- `AGENTS.md`
- `KILO_INSTRUCTIONS.md` oder `CLAUDE.md`, falls vorhanden
- `TASKS.md`
- `docs/starter-kit-usage/PIV-WORKFLOW.md`

Wenn der Plan ein PRD referenziert, lies die relevante PRD-Version. Wenn frühere Review- oder Integration-Dateien zur gleichen Plan-Version und Runde im Ordner `plan-reviews/` existieren, lies sie gezielt, soweit sie für die aktuelle Entscheidung relevant sind.

## Dateinamen und Versionierung

Schreibe die neue Plan-Version unter:

```text
docs/project/features/[feature-name]/plan-vNNN.md
```

Regeln:

- Ausgangsversion aus dem Plan-Dateinamen ableiten, z.B. `plan-v001.md`. Wenn die Datei `plan.md` heisst, behandle die Ausgangsversion logisch als `v001`.
- Zielversion ist immer die nächste Version: `v001 -> v002`, `v002 -> v003`, usw.
- Wenn die Zielversion bereits existiert, stoppe und frage, ob die bestehende Datei aktualisiert werden darf oder ob eine andere Zielversion verwendet werden soll.
- Die Ausgangsdatei bleibt unverändert, damit der Zustand vor dem Review commitbar und nachvollziehbar bleibt.

Schreibe die Integration unter:

```text
docs/project/features/[feature-name]/plan-reviews/plan-vNNN-rMM-integration.md
```

Regeln:

- `vNNN`: Ausgangsversion aus dem Plan-Dateinamen.
- `rMM`: dieselbe Runde wie in der Review-Datei. Wenn die Review-Datei keine Runde enthält, leite sie aus vorhandenen Dateien ab und dokumentiere die Annahme.
- Lege `plan-reviews/` im Feature-Ordner an, falls der Ordner fehlt.
- Überschreibe keine bestehende Integration-Datei.

## Phase 1: Review-Punkte extrahieren

Extrahiere aus der Review-Datei alle konkreten Punkte:

- kritische Findings
- Architektur- und Codebase-Fit-Probleme
- Scope- und PRD-Abgleich-Probleme
- Implementation-Plan- und Task-Qualitätsprobleme
- fehlende oder falsche Pflichtlektüre
- Datenmodell-, Rollen- und Berechtigungsprobleme
- Testing- und Validierungsprobleme
- Risiken, Gotchas und Edge Cases
- Übergabereife-Probleme für `/execute`
- offene Fragen

Fasse doppelte oder sehr ähnliche Punkte zusammen, ohne relevante Nuancen zu verlieren.

## Phase 2: Integrationsvorschlag erstellen

Erstelle vor dem Schreiben der neuen Plan-Version eine Entscheidungstabelle:

| ID | Review-Punkt | Entscheidungsvorschlag | Begründung | Geplante Änderung in neuer Plan-Version |
|---|---|---|---|---|
| R-01 | ... | übernehmen / teilweise übernehmen / ablehnen / offen lassen | ... | ... |

Zeige danach die Tabelle und frage den Nutzer explizit nach Bestätigung oder Korrektur. Schreibe die neue Plan-Version noch nicht.

## Phase 3: Neue Plan-Version erstellen

Nach Bestätigung:

1. Erstelle eine neue Plan-Datei mit der nächsten Versionsnummer.
2. Kopiere den bestätigten Inhalt der Ausgangsversion als Basis und arbeite die bestätigten Review-Entscheidungen dort ein.
3. Aktualisiere die Plan-Version im Plan selbst auf die neue Version, z.B. `v002`.
4. Ergänze oder präzisiere nur Inhalte, die durch Review und menschliche Entscheidung gedeckt sind.
5. Entferne keine fachlichen oder technischen Planinhalte, ausser die Entfernung wurde bestätigt oder ist eine direkte Korrektur eines Widerspruchs.
6. Halte Tasks weiterhin atomar, top-to-bottom ausführbar und einzeln validierbar.
7. Aktualisiere `TASKS.md`, damit der Feature-Eintrag auf die neue Plan-Version zeigt.

## Phase 4: Integration-Datei schreiben

Schreibe die Integration-Datei gemäss `references/feature-plan-integration-template.md`.

Fülle alle relevanten Abschnitte konkret aus. Entferne keine Qualitätsabschnitte nur deshalb, weil sie kurz ausfallen; schreibe stattdessen `Nicht relevant` mit kurzer Begründung.

## Abschluss

Nach neuer Plan-Version, `TASKS.md`-Aktualisierung und Integration-Datei:

1. Nenne den Ausgangsplan-Pfad.
2. Nenne den neuen Plan-Pfad.
3. Nenne den Integration-Dateipfad.
4. Fasse übernommene, teilweise übernommene, abgelehnte und offene Punkte kurz zusammen.
5. Empfiehl eine weitere Review-Runde nur, wenn kritische Punkte offen geblieben sind, grössere Plan-Abschnitte neu geschrieben wurden oder die Übergabereife für `/execute` weiterhin unsicher ist.
6. Wenn keine weitere Review-Runde nötig ist, weise darauf hin, dass die neue Plan-Version fachlich bestätigt werden soll und danach ein Commit folgen soll.
7. Weise darauf hin, dass nach Plan-Bestätigung `/execute [neuer Plan-Pfad]` der nächste Workflow ist.
