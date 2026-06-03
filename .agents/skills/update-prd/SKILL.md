---
name: update-prd
description: >
  Creates a new version of an existing PRD after human-requested changes, documents the change reason, updates the PRD change history, and warns about affected feature plans. Use when the user explicitly runs /update-prd or directly requests a versioned PRD update. ONLY activate when explicitly requested.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  piv-phase: plan
  version: "1.0"
disable-model-invocation: true
argument-hint: "[path-to-prd]"
---

# Update PRD: PRD versioniert aktualisieren

## Input

Pfad zum bestehenden PRD: `$ARGUMENTS`

Beispiel:

```text
/update-prd docs/project/prds/antragssystem-v002.md
```

## Zweck

Aktualisiere ein bestehendes PRD aufgrund einer fachlichen Klärung, eines Dozentenfeedbacks, einer Scope-Anpassung, einer Fehlerkorrektur oder eines beim Planen erkannten Widerspruchs.

Dieser Skill ist kein Review-Ping-Pong. Er ist ein versionierter Änderungsworkflow: Die Ausgangsversion bleibt unverändert, und die bestätigte Änderung wird in eine neue PRD-Version geschrieben.

## Startregel

Frage zu Beginn aktiv:

```text
Ist /prime in dieser Session bereits gelaufen und soll ich dieses PRD jetzt versioniert aktualisieren?
```

Fahre erst fort, wenn der Nutzer bestätigt. Wenn `/prime` noch nicht gelaufen ist, fordere den Nutzer auf, zuerst `/prime` auszuführen und danach `/update-prd [PRD-Pfad]` erneut zu starten.

## Grundregeln

- Erzeuge immer eine neue PRD-Version. Ändere die übergebene Ausgangsversion nicht.
- Schreibe PRD und Update-Datei auf Deutsch.
- Schreibe die neue PRD-Version erst nach menschlicher Bestätigung der Änderungsvorschau.
- Schreibe immer eine Update-Datei.
- Führe keine Feature-Planung und keine Code-Änderungen durch.
- Nutze das bestehende PRD als fachliche Basis. Ergänze oder korrigiere nur Inhalte, die durch den beschriebenen Änderungsbedarf gedeckt sind.
- Markiere Annahmen, offene Fragen und Scope-Verschiebungen ausdrücklich.
- Halte MVP / Medium / Extended / Out of Scope klar getrennt.
- Wenn ein älteres PRD keinen Versionssuffix im Dateinamen hat, behandle es logisch als `v001`.
- Wenn die Ausgangsversion `v001` ist, schreibe das aktualisierte PRD als `v002`. Bei `v002` schreibe `v003` usw.

## Pflichtlektüre

Lies vollständig:

- PRD-Datei aus `$ARGUMENTS`
- `.agents/skills/update-prd/references/update-summary-template.md`
- `.agents/skills/create-prd/references/prd-template.md`
- `.agents/skills/create-prd/SKILL.md`
- `TASKS.md`
- `AGENTS.md`
- `KILO_INSTRUCTIONS.md` oder `CLAUDE.md`, falls vorhanden
- `docs/starter-kit-usage/PIV-WORKFLOW.md`

Lies zusätzlich gezielt vorhandene Feature-Pläne unter `docs/project/features/*/plan-v*.md`, wenn sie das betroffene PRD referenzieren oder wenn ihre Betroffenheit aus `TASKS.md` erkennbar ist.

Wenn das PRD auf eine Gesamtarchitektur-Markdown-Datei oder `architecture.dsl` verweist und diese im Repository verfügbar ist, darfst du sie gezielt lesen. Nutze SVG- oder PNG-Diagramme nicht als fachliche Quelle.

## Dateinamen und Versionierung

Schreibe die neue PRD-Version unter:

```text
docs/project/prds/[prd-name]-vNNN.md
```

Regeln:

- `[prd-name]`: PRD-Dateiname ohne `.md` und ohne Versionssuffix, z.B. `antragssystem`.
- Ausgangsversion aus dem PRD-Dateinamen ableiten, z.B. `v002`. Wenn kein Suffix vorhanden ist, behandle die Ausgangsversion logisch als `v001`.
- Zielversion ist immer die nächste Version: `v001 -> v002`, `v002 -> v003`, usw.
- Wenn die Zielversion bereits existiert, stoppe und frage, ob die bestehende Datei aktualisiert werden darf oder ob eine andere Zielversion verwendet werden soll.
- Die Ausgangsdatei bleibt unverändert, damit der Zustand vor der Änderung commitbar und nachvollziehbar bleibt.

Schreibe die Update-Datei unter:

```text
docs/project/prd-updates/[prd-name]-[source-version]-to-[target-version]-update.md
```

Regeln:

- Lege `docs/project/prd-updates/` an, falls der Ordner fehlt.
- Überschreibe keine bestehende Update-Datei. Wenn der erwartete Dateiname existiert, stoppe und frage, ob sie aktualisiert werden soll oder ob die PRD-Zielversion bereits existiert.

## Phase 1: Änderungstyp klären

Frage zuerst:

```text
Was soll geändert werden? Bitte wähle oder beschreibe den Anlass: Neues Feature, Scope-Anpassung, Fehlerkorrektur / Widerspruch, Dozentenfeedback / fachliche Klärung.
```

Bitte danach um eine konkrete Beschreibung der gewünschten Änderung. Stelle gezielte Rückfragen, wenn ohne Antwort nicht klar ist:

- welche PRD-Abschnitte betroffen sind
- ob MVP, Medium-Version, Extended-/Luxus-Version oder Out of Scope betroffen ist
- welche Rollen, Datenobjekte, Statuswerte, Schnittstellen oder Demo-Szenarien sich ändern
- ob die Änderung bereits fachlich entschieden ist oder noch als offene Frage dokumentiert werden soll

## Phase 2: Änderungsvorschau erstellen

Erstelle vor jeder Dateiänderung eine strukturierte Änderungsvorschau:

| Bereich | Geplante Änderung | Begründung | Auswirkung |
|---|---|---|---|
| Abschnitt / Thema | ... | ... | ... |

Die Vorschau muss enthalten:

- Ausgangs-PRD und Ausgangsversion
- geplante neue PRD-Version
- Anlass der Änderung
- betroffene PRD-Abschnitte
- konkrete inhaltliche Änderungen
- mögliche Auswirkungen auf Feature-Kandidaten, Scope, Rollen, Datenmodell, Statuslogik, Schnittstellen, Demo-Szenarien und Starter-Kit-Nutzung
- erkannte betroffene Feature-Pläne
- offene Fragen oder Annahmen

Zeige danach die Vorschau und frage den Nutzer explizit nach Bestätigung oder Korrektur. Schreibe noch keine Dateien.

## Phase 3: Menschliche Bestätigung einholen

Warte auf menschliches Feedback.

Wenn der Nutzer die Vorschau korrigiert:

- Passe die geplanten Änderungen entsprechend an.
- Frage nur nach, wenn die Korrektur widersprüchlich oder nicht ausführbar ist.

Wenn weiterhin offene Punkte bestehen, darfst du die neue PRD-Version schreiben, sofern der Nutzer das bestätigt. Dokumentiere die offenen Punkte dann klar im PRD und in der Update-Datei.

## Phase 4: Neue PRD-Version schreiben

Nach Bestätigung:

1. Erstelle eine neue PRD-Datei mit der nächsten Versionsnummer.
2. Kopiere den bestätigten Inhalt der Ausgangsversion als Basis und arbeite die bestätigten Änderungen dort ein.
3. Aktualisiere die Dokumentversion im PRD selbst auf die neue Version.
4. Ergänze oder aktualisiere den Abschnitt `## Änderungshistorie`.
5. Füge für die neue Version eine Zeile mit Version, Datum, Anlass und Kurzbeschreibung ein.
6. Entferne keine fachlichen Inhalte, ausser die Entfernung wurde bestätigt oder ist eine direkte Korrektur eines Widerspruchs.
7. Halte "Starter Kit Nutzung" bereit für `/adapt-to-project`, falls der Abschnitt im Projekt relevant ist.

Wenn die Ausgangsversion noch keine `## Änderungshistorie` enthält, lege den Abschnitt an. Dokumentiere darin mindestens:

- `v001` als initiale Erstellung, wenn diese Version aus dem Dokument ableitbar ist
- die neue Zielversion mit dem aktuellen Änderungsanlass

## Phase 5: Update-Datei schreiben

Schreibe die Update-Datei gemäss `references/update-summary-template.md`.

Fülle alle relevanten Abschnitte konkret aus. Entferne keine Qualitätsabschnitte nur deshalb, weil sie kurz ausfallen; schreibe stattdessen `Nicht relevant` mit kurzer Begründung.

## Phase 6: Auswirkungen auf Feature-Pläne prüfen

Prüfe nach dem Schreiben gezielt, ob vorhandene Feature-Pläne betroffen sein könnten.

Eine Warnung ist nötig, wenn:

- ein Feature-Plan die alte PRD-Version referenziert
- die PRD-Änderung Scope, Rollen, Datenmodell, Statuswerte, Schnittstellen, Demo-Szenarien oder Feature-Kandidaten betrifft
- ein aktiver oder geplanter Feature-Plan laut `TASKS.md` fachlich auf dem geänderten Bereich aufbaut

Ändere keine Feature-Pläne automatisch. Weise stattdessen darauf hin, dass als nächster Schritt `/update-feature-plan [Plan-Pfad]` genutzt werden soll. Bis dahin soll der betroffene Plan nicht als autoritative Grundlage für `/execute` verwendet werden.

## Phase 7: Abschluss

Nach neuer PRD-Version und Update-Datei:

1. Nenne den Ausgangs-PRD-Pfad.
2. Nenne den neuen PRD-Pfad.
3. Nenne den Update-Dateipfad.
4. Fasse die wichtigsten Änderungen kurz zusammen.
5. Liste betroffene oder möglicherweise betroffene Feature-Pläne auf.
6. Weise darauf hin, dass die neue PRD-Version fachlich bestätigt werden soll.
7. Weise darauf hin, dass die neue PRD-Version und die Update-Datei committed werden sollen, bevor die nächste Feature-Session startet. Dafür kann der Nutzer `/commit` verwenden oder in VS Code Source Control die Änderungen committen und sich dort eine Commit Message vorschlagen lassen.
8. Wenn Feature-Pläne betroffen sind, weise auf den anschliessenden `/update-feature-plan`-Workflow hin.
