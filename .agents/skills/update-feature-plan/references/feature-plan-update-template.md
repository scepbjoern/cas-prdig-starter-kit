# Feature-Plan-Update-Template für update-feature-plan

Dieses Template beschreibt die Struktur der verpflichtenden Update-Datei. Sie dokumentiert, warum eine neue Feature-Plan-Version entstanden ist, welche Änderungen bestätigt wurden und ob die neue Version erneut reviewed werden sollte.

Passe die Tiefe der Abschnitte an Umfang und Risiko der Plan-Änderung an. Markiere Annahmen, offene Fragen und Folgearbeiten explizit.

# Feature Plan Update: <Feature-Name> <Source-Version> -> <Target-Version>

## Metadaten

| Feld | Wert |
|---|---|
| Ausgangsplan | `<Pfad>` |
| Neue Plan-Version | `<Pfad>` |
| Ausgangsversion | `<v001/v002/...>` |
| Zielversion | `<v002/v003/...>` |
| Anlass | `<PRD-Update / Plan-Fehler / Architektur-Anpassung / Scope-Anpassung / Dozentenfeedback>` |
| Datum | `<YYYY-MM-DD>` |
| Auslöser | `<Menschlich angestossen / während execute erkannt / PRD-Update-Folge>` |
| Bisherige PRD-Referenz | `<Pfad oder Nicht relevant>` |
| Neue PRD-Referenz | `<Pfad oder unverändert>` |

## Kurzfazit

<Was wurde geändert und warum?>

## Bestätigte Änderungsvorschau

| Bereich | Änderung | Begründung | Auswirkung |
|---|---|---|---|

## Änderungen in der neuen Plan-Version

- <Konkrete Änderung>

## TASKS.md-Aktualisierung

<Welche Änderung wurde im Root-`TASKS.md` vorgenommen?>

## Nicht geänderte oder bewusst ausgesparte Punkte

- <Punkt und Begründung>

## Offene Fragen und Annahmen

- <Punkt, Auswirkung, nächster Klärungsschritt>

## Review-Empfehlung

<Soll die neue Plan-Version nochmals mit `/review-feature-plan` geprüft werden oder ist sie nach menschlicher Bestätigung bereit für `/execute`?>

## Empfehlung für den nächsten Schritt

<Neue Plan-Version fachlich und technisch bestätigen, committen und danach entweder `/review-feature-plan` oder `/execute` mit dem neuen Plan-Pfad ausführen.>

## Qualitätscheck vor Abschluss

Prüfe vor dem Speichern:

- [ ] Ausgangsplan, neue Plan-Version, Ausgangsversion und Zielversion sind korrekt dokumentiert.
- [ ] Der Änderungsanlass ist klar beschrieben.
- [ ] Die neue Plan-Version bleibt von der Ausgangsversion unterscheidbar.
- [ ] Die Plan-Änderungshistorie im neuen Plan enthält einen Eintrag für die neue Version.
- [ ] PRD-Referenzen sind korrekt aktualisiert oder bewusst unverändert dokumentiert.
- [ ] `TASKS.md` verweist auf die neue Plan-Version.
- [ ] Tasks bleiben atomar, ausführbar und einzeln validierbar.
- [ ] Offene Fragen enthalten einen konkreten nächsten Klärungsschritt.
- [ ] Die Empfehlung für den nächsten Schritt nennt Commit und entweder `/review-feature-plan` oder `/execute`.
