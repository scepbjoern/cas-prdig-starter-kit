# PRD-Review-Integration-Template für integrate-prd-review

Dieses Template beschreibt die Struktur der verpflichtenden Integration-Datei. Es dokumentiert, wie Review-Punkte bewertet wurden und welche Änderungen in die neue PRD-Version eingeflossen sind.

Passe die Tiefe der Abschnitte an Review-Umfang und PRD-Änderungen an. Markiere Annahmen, abgelehnte Punkte und offene Fragen explizit.

# PRD Review Integration: <PRD-Name> <Version> Runde <NN>

## Metadaten

| Feld | Wert |
|---|---|
| Ausgangs-PRD | `<Pfad>` |
| Neue PRD-Version | `<Pfad>` |
| Review | `<Pfad>` |
| Ausgangsversion | `<v001/v002/...>` |
| Zielversion | `<v002/v003/...>` |
| Review-Runde | `<r01/r02/...>` |
| Integrationskontext | Autor-Session bestätigt |

## Kurzfazit

<Was wurde insgesamt verbessert? Was bleibt offen?>

## Entscheidungen

| ID | Review-Punkt | Entscheidung | Begründung | Änderung in neuer PRD-Version |
|---|---|---|---|---|

## Übernommene Änderungen an der neuen PRD-Version

- <Konkrete Änderung>

## Änderungshistorie im PRD

<Welche Zeile wurde in der Änderungshistorie der neuen PRD-Version ergänzt oder aktualisiert?>

## Teilweise übernommene Punkte

- <Punkt und Begründung>

## Abgelehnte Punkte

- <Punkt und Begründung>

## Offene Punkte

- <Punkt, Auswirkung, nächster Klärungsschritt>

## Empfehlung für den nächsten Schritt

<Entweder Review der neuen PRD-Version oder bereit für fachliche Bestätigung und danach /adapt-to-project mit der neuen PRD-Version.>

## Qualitätscheck vor Abschluss

Prüfe vor dem Speichern:

- [ ] Ausgangs-PRD, Review-Datei, Ausgangsversion, Zielversion und Review-Runde sind korrekt dokumentiert.
- [ ] Jede relevante Review-Empfehlung ist als übernommen, teilweise übernommen, abgelehnt oder offen dokumentiert.
- [ ] Ablehnungen sind nachvollziehbar begründet, insbesondere wenn Autor-Session-Kontext eine Rolle spielt.
- [ ] Die neue PRD-Version ist genannt und bleibt von der Ausgangsversion unterscheidbar.
- [ ] Die Änderungshistorie der neuen PRD-Version enthält einen Eintrag für die Review-Integration.
- [ ] Offene Punkte enthalten einen konkreten nächsten Klärungsschritt.
- [ ] Die Empfehlung für den nächsten Schritt nennt entweder eine weitere Review der neuen PRD-Version oder `/adapt-to-project` mit dem neuen PRD-Pfad.
