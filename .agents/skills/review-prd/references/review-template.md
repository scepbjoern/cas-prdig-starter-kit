# PRD-Review-Template für review-prd

Dieses Template beschreibt die Struktur einer kritischen PRD-Review-Datei. Es wird von `/review-prd` verwendet und soll nicht direkt als PRD-Inhalt übernommen werden.

Passe die Tiefe der Abschnitte an den Zustand des PRDs an. Markiere Annahmen, Review-Grenzen und offene Fragen explizit.

# PRD Review: <PRD-Name> <Version> Runde <NN>

## Metadaten

| Feld | Wert |
|---|---|
| PRD | `<Pfad>` |
| Logische PRD-Version | `<v001/v002/...>` |
| Review-Runde | `<r01/r02/...>` |
| Reviewer-Kontext | Frische Session nach `/prime` bestätigt: ja |
| Vorherige Review-/Integration-Datei | `<Pfad oder Nicht relevant>` |

## Kurzfazit

<2-4 Absätze: Was ist schon stark? Was gefährdet die spätere Feature-Planung am meisten?>

## Stärken

- <Konkrete Stärken des PRDs>

## Kritische Findings

Findings, die vor `/adapt-to-project` oder `/plan-feature` geklärt werden sollten.

| Bereich | Finding | Warum relevant | Konkreter Verbesserungsvorschlag |
|---|---|---|---|

## Unklare Anforderungen

| Abschnitt | Unklarheit | Rückfrage an den Menschen oder Autor-Agenten |
|---|---|---|

## Fehlende Elemente gemäss PRD-Template

| Template-Bereich | Befund | Vorschlag |
|---|---|---|

## Scope und Ausbaustufen

<Prüfung von MVP / Medium / Extended / Out of Scope, ohne selbst über Kursangemessenheit zu entscheiden.>

## Rollen, Berechtigungen und Statuslogik

<Prüfung von Rollen, Berechtigungen, Statuswechseln und fachlicher Nachvollziehbarkeit.>

## Datenmodell, Schnittstellen und Mocks

<Prüfung von Entitäten, Beziehungen, Statuswerten, Umsystemen, Mocks und weggelassenen Integrationen.>

## Demo-Szenarien und Erfolgskriterien

<Prüfung, ob User Stories, Demo-Szenarien und Erfolgskriterien aufeinander verweisen und später planbar sind.>

## Starter-Kit-Nutzung und Adapt-to-Project

<Prüfung, ob der Abschnitt "Starter Kit Nutzung" vollständig genug für `/adapt-to-project` ist.>

## Prototypen-Grenzen und sensible Daten

<Kurze Prüfung von Testdaten, Rollen, produktiver Security als Out of Scope und Anonymisierung. Wenn nicht relevant: bewusst so festhalten.>

## Verbesserungsvorschläge nach Priorität

### Muss vor dem nächsten Schritt geklärt werden

- <Vorschlag>

### Sollte verbessert werden

- <Vorschlag>

### Optional

- <Vorschlag>

## Offene Fragen für die Integration

- <Frage, die der Autor-Agent oder Mensch bei `/integrate-prd-review` entscheiden soll>

## Nächster Schritt

Gehe zurück in die Autor-Session, in der das PRD erstellt wurde. Führe dort aus:

```text
/integrate-prd-review <PRD-Pfad> <Review-Datei>
```

## Qualitätscheck vor Abschluss

Prüfe vor dem Speichern:

- [ ] Das Review ändert das PRD nicht.
- [ ] Kritische Findings sind konkret und handlungsorientiert.
- [ ] Verbesserungsvorschläge sind so formuliert, dass `/integrate-prd-review` sie einzeln bewerten kann.
- [ ] MVP / Medium / Extended / Out of Scope wurden geprüft.
- [ ] Rollen, Berechtigungen, Datenmodell, Schnittstellen, Demo-Szenarien und Starter-Kit-Nutzung wurden betrachtet.
- [ ] Prototypen-Grenzen und sensible Daten wurden bewusst kurz geprüft oder als nicht relevant markiert.
- [ ] Der nächste Schritt verweist zurück in die Autor-Session mit `/integrate-prd-review`.
