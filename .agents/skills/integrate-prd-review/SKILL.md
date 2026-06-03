---
name: integrate-prd-review
description: >
  Integrates a structured PRD review back into the authored PRD after human confirmation, writes a mandatory integration file, creates the next PRD version, and prepares that new version for another review round or for /adapt-to-project. Use in the original author session after /review-prd when the user explicitly runs /integrate-prd-review or directly requests PRD review integration. ONLY activate when explicitly requested.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  piv-phase: plan
  version: "1.2"
disable-model-invocation: true
argument-hint: "[path-to-prd] [path-to-review]"
---

# Integrate PRD Review: Review ins PRD einarbeiten

## Input

Pfad zum PRD und zur Review-Datei: `$ARGUMENTS`

Beispiel:

```text
/integrate-prd-review docs/project/prds/antragssystem-v001.md docs/project/prd-reviews/antragssystem-v001-r01-review.md
```

## Zweck

Bewerte die Review-Vorschläge kritisch, hole menschliche Entscheidungen ein, erstelle danach eine neue PRD-Version und schreibe eine verpflichtende Integration-Datei. Diese Datei dokumentiert sessionübergreifend, welche Review-Punkte übernommen, teilweise übernommen, abgelehnt oder offengelassen wurden.

Dieser Skill ist die Autor-/Integrationsseite des PRD-Review-Ping-Pongs.

## Session-Regel

Frage zu Beginn aktiv:

```text
Läuft diese Integration in der ursprünglichen Autor-Session, in der das PRD erstellt oder zuletzt überarbeitet wurde?
```

Die Integration soll in der ursprünglichen Autor-Session laufen. Fahre erst fort, wenn der Nutzer bestätigt, dass dies die Autor-Session ist.

Wichtig: Wenn du einen Review-Punkt wegen Kontext aus der Autor-Session ablehnst, dokumentiere die Begründung in der Integration-Datei. Wenn diese Begründung für spätere Planung relevant ist, ergänze sie auch in der neuen PRD-Version.

## Grundregeln

- Erzeuge immer eine neue PRD-Version. Ändere die geprüfte Ausgangsversion nicht.
- Ändere bzw. schreibe die neue PRD-Version erst nach menschlicher Bestätigung der Integrationsentscheidungen.
- Schreibe immer eine Integration-Datei.
- Schreibe PRD und Integration-Datei auf Deutsch.
- Übernimm Review-Vorschläge nicht blind. Bewerte jeden Vorschlag gegen PRD, Projektkontext, Template, Starter-Kit-Regeln und bekannte Autor-Entscheidungen.
- Markiere Entscheidungen klar als `übernehmen`, `teilweise übernehmen`, `ablehnen` oder `offen lassen`.
- Wenn ein Review-Punkt sachlich korrekt ist, aber auf eine implizite Autor-Entscheidung trifft, mache diese Entscheidung im PRD sichtbar statt sie nur im Chat zu behalten.
- Führe keine Feature-Planung und keine Code-Änderungen durch.
- Wenn ein älteres PRD keinen Versionssuffix im Dateinamen hat, behandle es logisch als `v001`.
- Wenn die Ausgangsversion `v001` ist, schreibe das integrierte PRD als `v002`. Bei `v002` schreibe `v003` usw.

## Pflichtlektüre

Lies vollständig:

- PRD-Datei aus `$ARGUMENTS`
- Review-Datei aus `$ARGUMENTS`
- `.agents/skills/integrate-prd-review/references/integration-template.md`
- `.agents/skills/create-prd/references/prd-template.md`
- `.agents/skills/create-prd/SKILL.md`
- `AGENTS.md`
- `KILO_INSTRUCTIONS.md` oder `CLAUDE.md`, falls vorhanden
- `docs/starter-kit-usage/PIV-WORKFLOW.md`

Wenn frühere Review- oder Integration-Dateien zur gleichen PRD-Version und Runde im Ordner `docs/project/prd-reviews/` existieren, lies sie gezielt, soweit sie für die aktuelle Entscheidung relevant sind.

## Dateinamen und Versionierung

Schreibe die neue PRD-Version unter:

```text
docs/project/prds/[prd-name]-vNNN.md
```

Regeln:

- `[prd-name]`: PRD-Dateiname ohne `.md` und ohne Versionssuffix, z.B. `antragssystem`.
- Ausgangsversion aus dem PRD-Dateinamen ableiten, z.B. `v001`. Wenn kein Suffix vorhanden ist, behandle die Ausgangsversion logisch als `v001`.
- Zielversion ist immer die nächste Version: `v001 -> v002`, `v002 -> v003`, usw.
- Wenn die Zielversion bereits existiert, stoppe und frage, ob die bestehende Datei aktualisiert werden darf oder ob eine andere Zielversion verwendet werden soll.
- Die Ausgangsdatei bleibt unverändert, damit der Zustand vor dem Review commitbar und nachvollziehbar bleibt.

Schreibe die Integration unter:

```text
docs/project/prd-reviews/[prd-name]-[version]-rNN-integration.md
```

Regeln:

- `[prd-name]`: PRD-Dateiname ohne `.md` und ohne Versionssuffix, z.B. `antragssystem`.
- `[version]`: Ausgangsversion aus dem PRD-Dateinamen, z.B. `v001`. Wenn kein Suffix vorhanden ist, verwende `v001`.
- `rNN`: dieselbe Runde wie in der Review-Datei. Wenn die Review-Datei keine Runde enthält, leite sie aus vorhandenen Dateien ab und dokumentiere die Annahme.
- Lege `docs/project/prd-reviews/` an, falls der Ordner fehlt.
- Überschreibe keine bestehende Integration-Datei. Wenn der erwartete Dateiname existiert, stoppe und frage, ob sie aktualisiert werden soll oder ob eine neue Review-Runde gemeint ist.

## Phase 1: Review-Punkte extrahieren

Extrahiere aus der Review-Datei alle konkreten Punkte:

- kritische Findings
- unklare Anforderungen
- fehlende Template-Elemente
- Scope- oder Ausbaustufen-Probleme
- Rollen-, Berechtigungs- und Statuslogik-Probleme
- Datenmodell-, Schnittstellen- oder Mock-Probleme
- Demo-Szenario- und Erfolgskriterien-Probleme
- Starter-Kit-Nutzung-Probleme
- Prototypen-Grenzen und sensible Daten
- offene Fragen

Fasse doppelte oder sehr ähnliche Punkte zusammen, ohne relevante Nuancen zu verlieren.

## Phase 2: Integrationsvorschlag erstellen

Erstelle vor dem Schreiben der neuen PRD-Version eine Entscheidungstabelle:

| ID | Review-Punkt | Entscheidungsvorschlag | Begründung | Geplante Änderung in neuer PRD-Version |
|---|---|---|---|---|
| R-01 | ... | übernehmen / teilweise übernehmen / ablehnen / offen lassen | ... | ... |

Regeln:

- `übernehmen`: Review-Punkt ist sinnvoll und soll im PRD umgesetzt werden.
- `teilweise übernehmen`: Grundidee ist sinnvoll, aber anders oder kleiner umsetzen.
- `ablehnen`: Review-Punkt passt nicht, ist durch Kontext begründet oder würde das PRD verschlechtern.
- `offen lassen`: Menschliche oder fachliche Entscheidung fehlt.

Zeige danach die Tabelle und frage den Nutzer explizit nach Bestätigung oder Korrektur. Schreibe die neue PRD-Version noch nicht.

## Phase 3: Menschliche Entscheidung einholen

Warte auf menschliches Feedback.

Wenn der Nutzer Entscheidungen ändert:

- Aktualisiere die Entscheidungstabelle gedanklich.
- Frage nur nach, wenn eine Entscheidung nicht ausführbar oder widersprüchlich ist.

Wenn offene Punkte verbleiben, darfst du das PRD trotzdem überarbeiten, aber dokumentiere offene Punkte klar im PRD und in der Integration-Datei.

## Phase 4: Neue PRD-Version erstellen

Nach Bestätigung:

1. Erstelle eine neue PRD-Datei mit der nächsten Versionsnummer.
2. Kopiere den bestätigten Inhalt der Ausgangsversion als Basis und arbeite die bestätigten Review-Entscheidungen dort ein.
3. Aktualisiere die Dokumentversion im PRD selbst auf die neue Version, z.B. `v002`.
4. Ergänze oder präzisiere nur Inhalte, die durch Review und menschliche Entscheidung gedeckt sind.
5. Entferne keine fachlichen Inhalte, ausser die Entfernung wurde bestätigt oder ist eine direkte Korrektur eines Widerspruchs.
6. Halte MVP / Medium / Extended / Out of Scope klar getrennt.
7. Halte "Starter Kit Nutzung" bereit für `/adapt-to-project`.
8. Wenn ein Review-Punkt wegen Autor-Kontext abgelehnt wurde, dokumentiere die Begründung im neuen PRD, falls sie für spätere Agenten relevant ist.

## Phase 5: Integration-Datei schreiben

Schreibe die Integration-Datei gemäss `references/integration-template.md`.

Fülle alle relevanten Abschnitte konkret aus. Entferne keine Qualitätsabschnitte nur deshalb, weil sie kurz ausfallen; schreibe stattdessen `Nicht relevant` mit kurzer Begründung.

## Phase 6: Abschluss

Nach neuer PRD-Version und Integration-Datei:

1. Nenne den Ausgangs-PRD-Pfad.
2. Nenne den neuen PRD-Pfad.
3. Nenne den Integration-Dateipfad.
4. Fasse übernommene, teilweise übernommene, abgelehnte und offene Punkte kurz zusammen.
5. Empfiehl eine weitere Review-Runde nur, wenn kritische Punkte offen geblieben sind, grössere PRD-Abschnitte neu geschrieben wurden oder der Scope weiterhin unscharf ist. Diese weitere Review-Runde soll die neue PRD-Version prüfen, z.B. `v002-r01-review.md`.
6. Wenn keine weitere Review-Runde nötig ist, weise darauf hin, dass die neue PRD-Version fachlich bestätigt werden soll und danach ein Commit folgen soll.
7. Weise darauf hin, dass nach PRD-Bestätigung `/adapt-to-project [neuer PRD-Pfad]` der nächste Workflow ist.
