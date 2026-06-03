# PRD-Update-Template für update-prd

Dieses Template beschreibt die Struktur der verpflichtenden Update-Datei. Sie dokumentiert, warum eine neue PRD-Version entstanden ist, welche Änderungen bestätigt wurden und welche Feature-Pläne dadurch möglicherweise betroffen sind.

Passe die Tiefe der Abschnitte an Umfang und Risiko der PRD-Änderung an. Markiere Annahmen, offene Fragen und Folgearbeiten explizit.

# PRD Update: <PRD-Name> <Source-Version> -> <Target-Version>

## Metadaten

| Feld | Wert |
|---|---|
| Ausgangs-PRD | `<Pfad>` |
| Neue PRD-Version | `<Pfad>` |
| Ausgangsversion | `<v001/v002/...>` |
| Zielversion | `<v002/v003/...>` |
| Anlass | `<Neues Feature / Scope-Anpassung / Fehlerkorrektur / Dozentenfeedback / fachliche Klärung>` |
| Datum | `<YYYY-MM-DD>` |
| Auslöser | `<Menschlich angestossen / beim Planen erkannter PRD-Widerspruch>` |

## Kurzfazit

<Was wurde geändert und warum?>

## Bestätigte Änderungsvorschau

| Bereich | Änderung | Begründung | Auswirkung |
|---|---|---|---|

## Änderungen in der neuen PRD-Version

- <Konkrete Änderung>

## Nicht geänderte oder bewusst ausgesparte Punkte

- <Punkt und Begründung>

## Offene Fragen und Annahmen

- <Punkt, Auswirkung, nächster Klärungsschritt>

## Auswirkungen auf Feature-Pläne

| Feature-Plan | Betroffenheit | Begründung | Empfohlener nächster Schritt |
|---|---|---|---|
| `<Pfad oder Nicht relevant>` | `<ja / möglich / nein>` | `<Begründung>` | `<z.B. /update-feature-plan ausführen>` |

## Empfehlung für den nächsten Schritt

<Neue PRD-Version fachlich bestätigen, committen und danach entweder mit dem nächsten Feature fortfahren oder betroffene Feature-Pläne mit `/update-feature-plan` nachziehen.>

## Qualitätscheck vor Abschluss

Prüfe vor dem Speichern:

- [ ] Ausgangs-PRD, neue PRD-Version, Ausgangsversion und Zielversion sind korrekt dokumentiert.
- [ ] Der Änderungsanlass ist klar beschrieben.
- [ ] Die neue PRD-Version bleibt von der Ausgangsversion unterscheidbar.
- [ ] Die Änderungshistorie im neuen PRD enthält einen Eintrag für die neue Version.
- [ ] Auswirkungen auf vorhandene Feature-Pläne wurden geprüft.
- [ ] Betroffene Feature-Pläne wurden nicht automatisch geändert.
- [ ] Offene Fragen enthalten einen konkreten nächsten Klärungsschritt.
- [ ] Die Empfehlung für den nächsten Schritt nennt Commit und, falls nötig, `/update-feature-plan`.
