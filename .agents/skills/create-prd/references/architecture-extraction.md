# Architektur-Extraktion für create-prd

Diese Referenz beschreibt, wie Gesamtarchitektur-Kontext für ein Komponenten- oder System-PRD ausgewertet wird.

## Grundsatz

Die Gesamtarchitektur beschreibt meist den End-to-End-Prozess mit mehreren IT-Systemen. Das PRD beschreibt dagegen genau ein IT-System oder eine Komponente aus dieser Architektur.

Extrahiere daher zuerst den Gesamtzusammenhang und lasse danach bestätigen, welches einzelne System oder welche Komponente Gegenstand des PRD ist.

## Quellenpriorität

1. Gesamtarchitektur-Markdown für fachlichen Scope, Abweichungen, Demo-Szenarien, Komponentenliste und offene Fragen.
2. `architecture.dsl` für maschinenlesbare Architekturinformationen wie Personen, Software-Systeme, Container, Technologien und Beziehungen.
3. SVG-/PNG-/Bildexporte nur als visuelle Referenz. Keine inhaltliche Bildanalyse durchführen.

Wenn eine Gesamtarchitektur vorliegt und der Nutzer keine DSL-Datei mitliefert, frage:

```text
Gibt es zu dieser Gesamtarchitektur auch eine architecture.dsl-Datei? Falls ja, bitte ebenfalls als Kontext bereitstellen. Ich nutze die DSL als primäre Quelle für Architekturdiagramm-Informationen und analysiere keine SVG-/PNG-Diagramme inhaltlich.
```

## Datenschutz vor Analyse

Weise vor dem Einfügen oder Hochladen von Architekturunterlagen darauf hin, dass Gesamtarchitekturen sensible Informationen enthalten können. Der Nutzer soll Unternehmensnamen, reale Personen, interne Systemnamen oder vertrauliche Prozessdetails anonymisieren, wenn nötig.

## Extraktion aus Gesamtarchitektur-Markdown

### Kopfbereich

Extrahiere:

- Projekt- oder Gruppenkontext
- Version und Datum, falls relevant
- Zweck des Prototyps, falls angegeben

Nicht überbewerten:

- Kursinterne Metadaten, sofern sie für das PRD nicht relevant sind

### Teil A: Abweichungen zum Soll-Konzept

Extrahiere:

- Systeme oder Prozessschritte aus dem Soll-Konzept
- was im Prototyp stattdessen gebaut, gemockt oder weggelassen wird
- Begründungen für technologische Abweichungen
- bewusst vereinfachte Prozesspfade

Nutze diese Informationen für:

- Kontext und Einordnung
- Out of Scope
- Risiken und Annahmen
- technische Leitplanken
- Abgrenzung zwischen MVP, Medium-Version und Extended-/Luxus-Version

### Teil A: Demo-Szenarien

Extrahiere:

- beteiligte Rollen und Personas
- konkrete Demo-Daten oder Beispielobjekte
- Happy Path und Ausnahmefälle
- Statuswechsel und fachliche Entscheidungen
- erwartetes sichtbares Ergebnis

Nutze diese Informationen für:

- User Stories
- Erfolgskriterien
- Feature-Kandidaten
- MVP-Priorisierung innerhalb des vom Nutzer bestätigten Scopes

Beachte: Demo-Szenarien beschreiben oft den Gesamtprozess. Brich sie auf den Anteil des ausgewählten Systems herunter und verknüpfe sie später mit User Stories.

### Teil A: Scope-Abgrenzung

Extrahiere:

- technische Nicht-Ziele
- weggelassene Prozesspfade
- ausgeschlossene Rollen oder Szenarien
- Daten-, Compliance- und Security-Grenzen
- Betriebs- und Deployment-Grenzen

Nutze diese Informationen für:

- Out of Scope
- Security, Datenschutz und Compliance
- Risiken und offene Fragen
- klare Trennung von MVP, Medium und Extended

### Teil B: Architekturdiagramm und Komponentenliste

Extrahiere aus der Komponentenliste:

- Namen der Komponenten oder Systeme
- BPMN-Referenz oder Soll-System
- Entscheid: Neu, Gemockt, Weggelassen, Zusätzlich
- Mocking-Art
- Detaillierungsgrad
- Verantwortlichkeit
- Aufwand

Nutze diese Liste, um dem Nutzer Kandidaten für das PRD anzubieten.

Beispielformulierung:

```text
Ich sehe folgende mögliche PRD-Kandidaten: Prozessportal, Lieferanten-GUI, SAP ERP Mock. Für welches einzelne System soll dieses PRD erstellt werden?
```

Detaillierungsgrad und Aufwand dürfen als Hinweise für die spätere Etappierung verwendet werden. Sie ersetzen aber nicht die Entscheidung der Studierenden oder die Validierung mit dem Dozenten.

### Teil C: Interne Arbeitsfelder

Extrahiere:

- echte Abhängigkeiten zwischen Komponenten
- Schnittstellen, die vor Implementierung abgestimmt werden müssen
- offene technische oder fachliche Fragen
- Scope- und Realismusrisiken

Nutze diese Informationen für:

- Risiken, Annahmen und offene Fragen
- Feature-Kandidaten
- Schnittstellenabschnitt
- Hinweise, welche Punkte vor `plan-feature` oder mit dem Dozenten geklärt werden sollten

Nicht alles aus Teil C gehört ins PRD. Teaminterne Verantwortlichkeitsdetails nur aufnehmen, wenn sie für Scope oder Abhängigkeiten wichtig sind.

## Extraktion aus architecture.dsl

Die DSL ist die primäre Quelle für Architekturdiagramm-Informationen.

Extrahiere:

- `person`: menschliche Nutzerrollen und Beschreibungen
- `softwareSystem`: Systeme, Mocks, externe Dienste und weggelassene Systeme
- `container`: Bestandteile des Prototyp-Systems
- Technologie-Labels der Container
- Beziehungen zwischen Rollen, Systemen und Containern
- Kommunikationsarten, zum Beispiel HTTPS, REST API, SQL, E-Mail
- Tags wie Mock, Extern, Weggelassen, NeuAusgereift, NeuBasic, Database

Nutze DSL-Informationen für:

- Zielgruppen und Rollen
- Schnittstellen und Umsysteme
- Architektur und technische Leitplanken
- MVP Scope und Out of Scope
- Abgrenzung zwischen neu gebaut, gemockt, extern und weggelassen
- Hinweise auf Systeme ohne Benutzeroberfläche oder ohne direkte menschliche Interaktion

## Brownfield-Hinweise aus Architektur ableiten

Im CAS-/Starter-Kit-Kontext ist Brownfield anzunehmen. Nutze Architekturinformationen daher nicht, um den gesamten technischen Stack neu zu definieren. Halte stattdessen fest:

- welches einzelne System oder welcher Container im bestehenden Starter Kit umgesetzt wird
- welche vorhandenen Starter-Kit-Komponenten dafür genutzt werden
- welche vorhandenen Komponenten voraussichtlich ungenutzt bleiben
- dass ungenutzte Komponenten im Prototyp nicht gelöscht werden müssen, solange sie nicht stören

Wenn die Architektur ein System ohne UI, ohne E-Mail oder ohne Auth-Nutzung beschreibt, ist das im Prototyp akzeptabel. Das PRD soll diese Nicht-Nutzung dokumentieren, aber keine Bereinigung des Starter Kits verlangen.

## Bestätigungs-Zusammenfassung

Nach der Extraktion fasse kompakt zusammen:

```text
Ich habe aus der Gesamtarchitektur folgende Informationen extrahiert:

- Rollen / technische Konsumenten: ...
- PRD-Kandidaten: ...
- relevante Umsysteme / Mocks: ...
- wichtige Schnittstellen: ...
- Demo-Szenarien: ...
- klare Out-of-Scope-Punkte: ...
- mögliche Hinweise für MVP / Medium / Extended: ...
- offene Fragen / Risiken: ...

Bitte bestätige oder korrigiere diese Zusammenfassung. Danach wählen wir das konkrete IT-System für das PRD aus.
```

Wenn der Nutzer bereits ein System genannt hat, trotzdem kurz bestätigen:

```text
Ich erstelle das PRD für [System]. Ist diese Abgrenzung korrekt, oder soll ein anderer Container / ein anderes System beschrieben werden?
```

## Typische Lücken nach Architektur-Extraktion

Auch mit guter Gesamtarchitektur fehlen oft Informationen für ein PRD. Kläre gezielt:

- konkrete MVP-Priorisierung innerhalb des ausgewählten Systems
- mögliche Medium- und Extended-Funktionen
- Berechtigungen pro Rolle oder technische Zugriffsrechte pro Konsument
- Datenobjekte und wichtigste Felder
- Statusmodell
- erwartetes Verhalten von Mocks
- Erfolgskriterien für Demo und Abnahme
- welche offenen Architekturfragen als Annahme ins PRD sollen
- ob der Umfang und die Etappierung im Kurskontext noch mit dem Dozenten validiert werden sollen

Stelle diese Fragen einzeln und nur soweit nötig.

## Anti-Patterns

Vermeide:

- ein PRD für den gesamten End-to-End-Prozess zu schreiben, wenn das Repo nur ein System umsetzt
- SVG- oder PNG-Diagramme inhaltlich zu interpretieren
- offene Fragen aus der Architektur stillschweigend zu entscheiden
- produktive Security, Compliance oder Deployment-Fähigkeiten anzunehmen, wenn der Prototyp diese ausdrücklich ausschließt
- alle Komponenten aus der Gesamtarchitektur in den MVP-Scope des ausgewählten Systems zu übernehmen
- selbst zu bewerten, ob der Kurs-Scope zu groß oder zu klein ist
- im Brownfield-/Starter-Kit-Kontext ungenutzte Komponenten als Löschaufgabe zu definieren, wenn sie nicht stören
