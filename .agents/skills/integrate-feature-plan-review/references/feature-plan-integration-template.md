# Feature-Plan-Review-Integration-Template für integrate-feature-plan-review

Dieses Template beschreibt die Struktur der verpflichtenden Integration-Datei. Es dokumentiert, wie Feature-Plan-Review-Punkte bewertet wurden und welche Änderungen in die neue Plan-Version eingeflossen sind.

# Feature Plan Review Integration: <Feature-Name> <Plan-Version> Runde <NN>

## Metadaten

| Feld | Wert |
|---|---|
| Ausgangsplan | `<Pfad>` |
| Neue Plan-Version | `<Pfad>` |
| Review | `<Pfad>` |
| Ausgangsversion | `<v001/v002/...>` |
| Zielversion | `<v002/v003/...>` |
| Review-Runde | `<r01/r02/...>` |
| Integrationskontext | Autor-Session bestätigt |
| Aktualisierter TASKS.md-Eintrag | ja / nein mit Begründung |

## Kurzfazit

<Was wurde insgesamt verbessert? Was bleibt offen?>

## Entscheidungen

| ID | Review-Punkt | Entscheidung | Begründung | Änderung in neuer Plan-Version |
|---|---|---|---|---|

## Übernommene Änderungen an der neuen Plan-Version

- <Konkrete Änderung>

## Teilweise übernommene Punkte

- <Punkt und Begründung>

## Abgelehnte Punkte

- <Punkt und Begründung>

## Offene Punkte

- <Punkt, Auswirkung, nächster Klärungsschritt>

## Empfehlung für den nächsten Schritt

<Entweder Review der neuen Plan-Version oder bereit für fachliche Bestätigung und danach /execute mit der neuen Plan-Version.>

## Qualitätscheck vor Abschluss

Prüfe vor dem Speichern:

- [ ] Ausgangsplan, Review-Datei, Ausgangsversion, Zielversion und Review-Runde sind korrekt dokumentiert.
- [ ] Jede relevante Review-Empfehlung ist als übernommen, teilweise übernommen, abgelehnt oder offen dokumentiert.
- [ ] Ablehnungen sind nachvollziehbar begründet, insbesondere wenn Autor-Session-Kontext eine Rolle spielt.
- [ ] Die neue Plan-Version ist genannt und bleibt von der Ausgangsversion unterscheidbar.
- [ ] `TASKS.md` zeigt auf die neue Plan-Version oder eine Abweichung ist begründet.
- [ ] Offene Punkte enthalten einen konkreten nächsten Klärungsschritt.
- [ ] Die Empfehlung für den nächsten Schritt nennt entweder eine weitere Review der neuen Plan-Version oder `/execute` mit dem neuen Plan-Pfad.
