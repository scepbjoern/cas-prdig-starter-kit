# Feature-Plan-Review-Template für review-feature-plan

Dieses Template beschreibt die Struktur einer kritischen Feature-Plan-Review-Datei. Es wird von `/review-feature-plan` verwendet und soll nicht direkt als Feature-Plan-Inhalt übernommen werden.

Passe die Tiefe der Abschnitte an Komplexität und Risiko des Features an. Markiere Annahmen, Review-Grenzen und offene Fragen explizit.

# Feature Plan Review: <Feature-Name> <Plan-Version> Runde <NN>

## Metadaten

| Feld | Wert |
|---|---|
| Feature-Plan | `<Pfad>` |
| Logische Plan-Version | `<v001/v002/...>` |
| Review-Runde | `<r01/r02/...>` |
| Reviewer-Kontext | Frische Session nach `/prime` bestätigt: ja |
| Vorherige Review-/Integration-Datei | `<Pfad oder Nicht relevant>` |
| Referenziertes PRD | `<Pfad oder Nicht relevant>` |

## Kurzfazit

<2-4 Absätze: Was ist schon umsetzungsreif? Was gefährdet `/execute` am stärksten?>

## Stärken

- <Konkrete Stärken des Feature-Plans>

## Kritische Findings

Findings, die vor `/execute` geklärt oder im Plan verbessert werden sollten.

| Bereich | Finding | Warum relevant | Konkreter Verbesserungsvorschlag |
|---|---|---|---|

## Architektur und Codebase-Fit

<Prüfung von Architekturentscheidungen, Starter-Kit-Konventionen, Server/Client-Grenzen, Route Handlern, Server Actions, Prisma, Auth, E-Mail, LLM, Upload und vorhandenen Patterns.>

## Scope und PRD-Abgleich

<Prüfung, ob der Plan zur referenzierten PRD-Version passt und keinen versteckten Zusatzscope plant.>

## Implementation Plan und Task-Qualität

<Prüfung von Phasen, Reihenfolge, Abhängigkeiten, Task-Atomarität, IMPLEMENT/PATTERN/GOTCHA/ACCEPTANCE CRITERIA/VALIDATE.>

## Betroffene Dateien und Pflichtlektüre

<Prüfung, ob die richtigen Dateien, Patterns, Tests und Dokumentationen konkret referenziert sind.>

## Datenmodell, Rollen und Berechtigungen

<Prüfung von Prisma, Statuswerten, Rollenregeln, Zugriffsschutz, Schema-Reset-Hinweisen und Mehrpersonen-Koordination.>

## Testing und Validierung

<Prüfung von Unit Tests, E2E Tests, Build, manueller Prüfung, Regressionen und nicht ausführbaren Checks.>

## Risiken, Gotchas und Edge Cases

<Prüfung, ob relevante Fehlerfälle, leere Zustände, Race Conditions, Security-, Performance- oder Maintainability-Risiken abgedeckt sind.>

## Übergabereife für Execute

<Prüfung, ob ein frischer `/execute`-Agent den Plan ohne neue Architekturentscheidungen umsetzen kann.>

## Verbesserungsvorschläge nach Priorität

### Muss vor `/execute` geklärt werden

- <Vorschlag>

### Sollte verbessert werden

- <Vorschlag>

### Optional

- <Vorschlag>

## Offene Fragen für die Integration

- <Frage, die der Autor-Agent oder Mensch bei `/integrate-feature-plan-review` entscheiden soll>

## Nächster Schritt

Gehe zurück in die Autor-Session, in der der Feature-Plan erstellt wurde. Führe dort aus:

```text
/integrate-feature-plan-review <Plan-Pfad> <Review-Datei>
```

## Qualitätscheck vor Abschluss

Prüfe vor dem Speichern:

- [ ] Das Review ändert den Feature-Plan nicht.
- [ ] Kritische Findings sind konkret und handlungsorientiert.
- [ ] Architektur, Task-Reihenfolge, betroffene Dateien, Tests und Validierung wurden geprüft.
- [ ] PRD-Abgleich und Scope-Grenzen wurden betrachtet.
- [ ] Verbesserungsvorschläge sind so formuliert, dass `/integrate-feature-plan-review` sie einzeln bewerten kann.
- [ ] Der nächste Schritt verweist zurück in die Autor-Session mit `/integrate-feature-plan-review`.
