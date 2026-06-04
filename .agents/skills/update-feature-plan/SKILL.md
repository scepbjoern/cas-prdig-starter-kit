---
name: update-feature-plan
description: >
  Creates a new version of an existing feature plan after PRD changes, execution findings, architecture changes, or human-requested adjustments; updates TASKS.md; documents the update. Use when the user explicitly runs /update-feature-plan or directly requests a versioned feature-plan update. ONLY activate when explicitly requested.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  piv-phase: plan
  version: "1.0"
disable-model-invocation: true
argument-hint: "[path-to-plan] [optional-prd-update-or-context-file]"
---

> **KiloCode-Modus:** Dieser Skill muss im **Code-Modus** ausgeführt werden. Im Architect- oder Plan-Modus beschränkt KiloCode Schreibrechte auf `.kilo/`-Ordner – neue Plan-Versionen und TASKS.md-Updates würden dort abgelegt statt in den korrekten Projektverzeichnissen. Wechsle in KiloCode vor der Ausführung auf den **Code-Modus**.

# Update Feature Plan: Feature-Plan versioniert aktualisieren

## Input

Pfad zum bestehenden Feature-Plan: `$ARGUMENTS`

Beispiele:

```text
/update-feature-plan docs/project/features/antrag-formular/plan-v002.md
/update-feature-plan docs/project/features/antrag-formular/plan-v002.md docs/project/prd-updates/antragssystem-v002-to-v003-update.md
```

## Zweck

Aktualisiere einen bestehenden Feature-Plan aufgrund einer neuen PRD-Version, einer fachlichen Klärung, eines Dozentenfeedbacks, einer Architektur- oder Codebase-Änderung, eines Planfehlers oder einer während `/execute` erkannten Planlücke.

Dieser Skill ist kein Review-Ping-Pong. Er ist ein versionierter Änderungsworkflow: Die Ausgangsversion bleibt unverändert, und die bestätigte Änderung wird in eine neue Plan-Version geschrieben.

## Startregel

Frage zu Beginn aktiv:

```text
Ist /prime in dieser Session bereits gelaufen und soll ich diesen Feature-Plan jetzt versioniert aktualisieren?
```

Fahre erst fort, wenn der Nutzer bestätigt. Wenn `/prime` noch nicht gelaufen ist, fordere den Nutzer auf, zuerst `/prime` auszuführen und danach `/update-feature-plan [Plan-Pfad]` erneut zu starten.

## Grundregeln

- Erzeuge immer eine neue Plan-Version. Ändere die übergebene Ausgangsversion nicht.
- Schreibe Plan und Update-Datei auf Deutsch.
- Schreibe die neue Plan-Version erst nach menschlicher Bestätigung der Änderungsvorschau.
- Schreibe immer eine Update-Datei.
- Aktualisiere `TASKS.md`, damit der Feature-Eintrag auf die neue Plan-Version zeigt.
- Führe keine Produktivcode-Änderungen durch.
- Nutze den bestehenden Feature-Plan als technische und fachliche Basis. Ergänze oder korrigiere nur Inhalte, die durch den beschriebenen Änderungsbedarf gedeckt sind.
- Markiere Annahmen, offene Fragen, Scope-Verschiebungen und Plan-/PRD-Abweichungen ausdrücklich.
- Halte Tasks weiterhin atomar, top-to-bottom ausführbar und einzeln validierbar.
- Wenn ein älterer Plan noch `plan.md` heisst, behandle ihn logisch als `plan-v001.md`.
- Wenn die Ausgangsversion `plan-v001.md` ist, schreibe den aktualisierten Plan als `plan-v002.md`. Bei `plan-v002.md` schreibe `plan-v003.md` usw.

## Pflichtlektüre

Lies vollständig:

- Plan-Datei aus `$ARGUMENTS`
- `.agents/skills/update-feature-plan/references/feature-plan-update-template.md`
- `.agents/skills/plan-feature/references/plan-template.md`
- `.agents/skills/plan-feature/SKILL.md`
- `TASKS.md`
- `AGENTS.md`
- `KILO_INSTRUCTIONS.md` oder `CLAUDE.md`, falls vorhanden
- `docs/starter-kit-usage/PIV-WORKFLOW.md`

Lies zusätzlich:

- die im Plan referenzierte PRD-Version, falls vorhanden
- die neueste PRD-Version zum selben PRD, falls der Änderungsanlass ein PRD-Update ist
- optionale Zusatzdateien aus `$ARGUMENTS`, z.B. PRD-Update-Datei oder Plan-/Review-/Integration-Datei
- relevante Codebase-Dateien, wenn der Änderungsanlass Architektur, betroffene Dateien, Tests oder Implementierungsreihenfolge betrifft

Nutze externe Recherche nur, wenn sie für korrekte Planung nötig ist, z.B. bei aktuellen Next.js-, Prisma-, Better-Auth-, shadcn- oder Playwright-Regeln. Nutze dann offizielle Dokumentation.

## Dateinamen und Versionierung

Schreibe die neue Plan-Version unter:

```text
docs/project/features/[feature-name]/plan-vNNN.md
```

Regeln:

- Feature-Ordner aus dem Pfad der Ausgangsdatei ableiten.
- Ausgangsversion aus dem Plan-Dateinamen ableiten, z.B. `plan-v002.md`. Wenn die Datei `plan.md` heisst, behandle die Ausgangsversion logisch als `v001`.
- Zielversion ist immer die nächste Version: `v001 -> v002`, `v002 -> v003`, usw.
- Wenn die Zielversion bereits existiert, stoppe und frage, ob die bestehende Datei aktualisiert werden darf oder ob eine andere Zielversion verwendet werden soll.
- Die Ausgangsdatei bleibt unverändert, damit der Zustand vor der Änderung commitbar und nachvollziehbar bleibt.

Schreibe die Update-Datei unter:

```text
docs/project/features/[feature-name]/plan-updates/plan-[source-version]-to-[target-version]-update.md
```

Beispiel:

```text
docs/project/features/antrag-formular/plan-updates/plan-v002-to-v003-update.md
```

Regeln:

- Lege `plan-updates/` im Feature-Ordner an, falls der Ordner fehlt.
- Überschreibe keine bestehende Update-Datei. Wenn der erwartete Dateiname existiert, stoppe und frage, ob sie aktualisiert werden soll oder ob die Plan-Zielversion bereits existiert.

## Phase 1: Änderungstyp klären

Frage zuerst:

```text
Was soll geändert werden? Bitte wähle oder beschreibe den Anlass: PRD-Update nachziehen, Plan-Fehler / Widerspruch, Architektur- oder Codebase-Anpassung, Scope-/Task-Anpassung, Dozentenfeedback / fachliche Klärung.
```

Bitte danach um eine konkrete Beschreibung der gewünschten Änderung. Stelle gezielte Rückfragen, wenn ohne Antwort nicht klar ist:

- welche Plan-Abschnitte betroffen sind
- ob Scope, Nicht-Scope oder Akzeptanzkriterien betroffen sind
- ob Architekturentscheidungen, betroffene Dateien, Datenmodell, Rollen, Tests oder Validierung betroffen sind
- ob Task-Reihenfolge, Task-Atomarität oder Übergabereife für `/execute` betroffen ist
- welche PRD-Version künftig die fachliche Grundlage sein soll
- ob die Änderung bereits fachlich entschieden ist oder noch als offene Frage dokumentiert werden soll

## Phase 2: Änderungsvorschau erstellen

Erstelle vor jeder Dateiänderung eine strukturierte Änderungsvorschau:

| Bereich | Geplante Änderung | Begründung | Auswirkung |
|---|---|---|---|
| Abschnitt / Thema | ... | ... | ... |

Die Vorschau muss enthalten:

- Ausgangsplan und Ausgangsversion
- geplante neue Plan-Version
- Anlass der Änderung
- bisherige und künftige PRD-Referenz, falls betroffen
- betroffene Plan-Abschnitte
- konkrete Änderungen an Scope, Architektur, betroffenen Dateien, Tasks, Tests, Validierung und Akzeptanzkriterien
- Auswirkungen auf `TASKS.md`
- offene Fragen oder Annahmen
- Empfehlung, ob die neue Plan-Version danach erneut mit `/review-feature-plan` geprüft werden sollte oder direkt für `/execute` taugt

Zeige danach die Vorschau und frage den Nutzer explizit nach Bestätigung oder Korrektur. Schreibe noch keine Dateien.

## Phase 3: Menschliche Bestätigung einholen

Warte auf menschliches Feedback.

Wenn der Nutzer die Vorschau korrigiert:

- Passe die geplanten Änderungen entsprechend an.
- Frage nur nach, wenn die Korrektur widersprüchlich oder nicht ausführbar ist.

Wenn weiterhin offene Punkte bestehen, darfst du die neue Plan-Version schreiben, sofern der Nutzer das bestätigt. Dokumentiere die offenen Punkte dann klar im Plan und in der Update-Datei.

## Phase 4: Neue Plan-Version schreiben

Nach Bestätigung:

1. Erstelle eine neue Plan-Datei mit der nächsten Versionsnummer.
2. Kopiere den bestätigten Inhalt der Ausgangsversion als Basis und arbeite die bestätigten Änderungen dort ein.
3. Aktualisiere die Plan-Version im Plan selbst auf die neue Version.
4. Aktualisiere PRD-Referenzen im Plan, wenn die Änderung auf einer neuen PRD-Version basiert.
5. Ergänze oder aktualisiere den Abschnitt `## Plan-Änderungshistorie`.
6. Füge für die neue Version eine Zeile mit Version, Datum, Anlass und Kurzbeschreibung ein.
7. Entferne keine fachlichen oder technischen Planinhalte, ausser die Entfernung wurde bestätigt oder ist eine direkte Korrektur eines Widerspruchs.
8. Halte Tasks weiterhin atomar, top-to-bottom ausführbar und einzeln validierbar.
9. Aktualisiere `TASKS.md`, damit der Feature-Eintrag auf die neue Plan-Version zeigt.

Wenn die Ausgangsversion noch keine `## Plan-Änderungshistorie` enthält, lege den Abschnitt an. Dokumentiere darin mindestens:

- `v001` als initiale Planung, wenn diese Version aus dem Dokument ableitbar ist
- die neue Zielversion mit dem aktuellen Änderungsanlass

## Phase 5: Update-Datei schreiben

Schreibe die Update-Datei gemäss `references/feature-plan-update-template.md`.

Fülle alle relevanten Abschnitte konkret aus. Entferne keine Qualitätsabschnitte nur deshalb, weil sie kurz ausfallen; schreibe stattdessen `Nicht relevant` mit kurzer Begründung.

## Phase 6: Abschluss

Nach neuer Plan-Version, `TASKS.md`-Aktualisierung und Update-Datei:

1. Nenne den Ausgangsplan-Pfad.
2. Nenne den neuen Plan-Pfad.
3. Nenne den Update-Dateipfad.
4. Fasse die wichtigsten Änderungen kurz zusammen.
5. Nenne, welche PRD-Version der neue Plan referenziert.
6. Weise darauf hin, dass die neue Plan-Version fachlich und technisch bestätigt werden soll.
7. Empfiehl eine erneute `/review-feature-plan`-Runde, wenn Scope, Architektur, Datenmodell, Task-Struktur oder Validierungsstrategie wesentlich geändert wurden.
8. Wenn keine weitere Review-Runde nötig ist, weise darauf hin, dass nach Plan-Bestätigung `/execute [neuer Plan-Pfad]` der nächste Workflow ist.
9. Weise darauf hin, dass die neue Plan-Version, `TASKS.md` und die Update-Datei committed werden sollen. Dafür kann der Nutzer `/commit` verwenden oder in VS Code Source Control die Änderungen committen und sich dort eine Commit Message vorschlagen lassen.
