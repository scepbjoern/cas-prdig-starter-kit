# PRD-Template für create-prd

Dieses Template beschreibt ein PRD für genau ein IT-System oder eine Komponente. Es soll als Grundlage für mehrere spätere Feature-Pläne dienen.

Passe die Tiefe der Abschnitte an den Informationsstand an. Markiere Annahmen und offene Fragen explizit.

## 1. Executive Summary

- Name des IT-Systems oder der Komponente
- Kurzbeschreibung in 2-3 Absätzen
- fachlicher Zweck und Nutzen
- MVP-Ziel in einem klaren Satz
- Kurzüberblick über mögliche spätere Ausbaustufen, falls bekannt

## 2. Kontext und Einordnung

Wenn eine Gesamtarchitektur vorhanden ist:

- Einordnung in den End-to-End-Prozess
- relevante Rollen, Umsysteme und Abhängigkeiten
- Bezug zu Soll-Konzept, Prototyp-Entscheiden und Abweichungen
- Hinweis auf verwendete Quellen, zum Beispiel Gesamtarchitektur-Markdown und `architecture.dsl`

Wenn keine Gesamtarchitektur vorhanden ist:

- kurzer Projektkontext
- erklärte Annahmen zum Prozessumfeld
- relevante bekannte Nachbarsysteme oder organisatorische Grenzen

## 3. Zielgruppen und Rollen

Beschreibe die Nutzergruppen und ihre Bedürfnisse.

Empfohlenes Format:

| Rolle | Beschreibung | Hauptbedürfnis | Berechtigungen im MVP |
|---|---|---|---|
| Beispielrolle | Was macht diese Rolle? | Warum nutzt sie das System? | Lesen, Erstellen, Prüfen, Freigeben usw. |

Wenn das System keine Benutzeroberfläche hat, beschreibe statt menschlicher Rollen die technischen Konsumenten oder Nachbarsysteme.

## 4. Problemstellung und Ziele

- Welches Problem wird gelöst?
- Warum braucht es dieses System oder diesen Mock?
- Welche Prozess- oder Demo-Fähigkeit muss dadurch ermöglicht werden?
- Welche 3-5 Produktprinzipien gelten für das MVP?

Beispiele für Produktprinzipien:

- demo-fähig vor vollständig produktionsreif
- klare Rollen- und Statussichtbarkeit
- nachvollziehbare Schnittstellen zu Mocks
- keine echten produktiven Daten
- MVP zuerst, Erweiterungen bewusst als Medium oder Extended dokumentieren

## 5. Scope und Ausbaustufen

Gliedere den Funktionsumfang explizit in Etappen. Das hilft, Unsicherheit über Projektumfang sichtbar zu machen, ohne dass der Agent eigenständig beurteilt, ob der Scope für ein Kursprojekt angemessen ist.

### MVP / Minimalversion

Funktionen, die zwingend funktionieren müssen, damit Kernnutzen, Demo oder Abnahme möglich sind:

- [ ] MVP-Funktion 1
- [ ] MVP-Funktion 2
- [ ] relevante Rollen- oder Berechtigungsfunktion
- [ ] relevante Schnittstelle oder Mock-Integration

### Medium-Version

Sinnvolle Erweiterungen, die nach dem MVP ergänzt werden können, falls genügend Zeit vorhanden ist:

- [ ] Medium-Funktion 1
- [ ] Medium-Funktion 2

### Extended-/Luxus-Version

Optionale Erweiterungen, Nice-to-have-Funktionen oder spätere Ausbaustufen:

- [ ] Extended-Funktion 1
- [ ] Extended-Funktion 2

### Out of Scope

Klare Nicht-Ziele:

- [ ] Nicht-Ziel 1
- [ ] produktive Integration X
- [ ] Mobile-Optimierung, falls nicht vorgesehen
- [ ] produktive Security, falls nur Demo-Scope

Gruppiere Scope bei Bedarf nach:

- Fachprozess
- UI / Nutzerinteraktion
- Backend / Daten
- Schnittstellen
- Betrieb / Deployment
- Security / Compliance

## 6. User Stories

Formuliere 5-8 zentrale User Stories. Jede zentrale User Story soll nach Möglichkeit auf ein Demo-Szenario oder Erfolgskriterium verweisen.

Format:

```text
Als [Rolle] möchte ich [Aktion], damit [Nutzen].
```

Empfohlenes Format:

| ID | User Story | Ausbaustufe | Demo-Bezug / Erfolgskriterium |
|---|---|---|---|
| US-1 | Als ... möchte ich ..., damit ... | MVP | Szenario 1 |

Pro User Story nach Möglichkeit ergänzen:

- Beispiel aus Demo-Szenario
- Akzeptanzhinweis auf PRD-Ebene
- relevante Rolle oder Berechtigung

## 7. Kernfunktionen

Beschreibe die wichtigsten Funktionsbereiche des Systems.

Empfohlenes Format:

| Funktion | Beschreibung | Ausbaustufe | Priorität | Rollen / Konsumenten | Hinweise |
|---|---|---|---|---|---|
| Funktion 1 | Was passiert fachlich? | MVP / Medium / Extended | Must / Should / Could | Rolle A oder System B | Annahmen, Abhängigkeiten |

Keine Implementierungsdetails auf Dateiebene aufnehmen. Diese gehören in spätere Feature-Pläne.

## 8. Daten und Statusmodell

Beschreibe die fachlichen Datenobjekte, die für das MVP wichtig sind. Berücksichtige bekannte Medium- und Extended-Erweiterungen so weit, dass Datenmodell und Architektur nicht unnötig in technische Sackgassen laufen. Medium- und Extended-Funktionen bleiben trotzdem optionale spätere Ausbaustufen.

Mögliche Inhalte:

- zentrale Entitäten
- wichtigste Felder
- Statuswerte und Statuswechsel
- Beziehungen zwischen Entitäten
- Seed- oder Demo-Daten
- Daten, die bewusst nicht gespeichert werden
- erkennbare spätere Datenbedürfnisse aus Medium- oder Extended-Version

Empfohlenes Format:

| Objekt | Zweck | Wichtige Felder | Beziehungen / Status | Relevanz für Ausbaustufe |
|---|---|---|---|---|
| Objekt 1 | Warum existiert es? | Feld A, Feld B | gehört zu..., Status... | MVP / Medium / Extended |

## 9. Schnittstellen und Umsysteme

Liste alle relevanten Nachbarsysteme, Mocks und Integrationen.

Empfohlenes Format:

| System / Schnittstelle | Richtung | Art | Zweck | MVP-Verhalten | spätere Ausbaustufe |
|---|---|---|---|---|---|
| Externes System | ausgehend / eingehend | REST API / E-Mail / SQL / Datei | Warum wird es gebraucht? | echt, mock, statisch, weggelassen | Medium / Extended / n/a |

Wenn API-Endpunkte bereits klar sind, grob beschreiben. Vollständige Request-/Response-Schemas nur aufnehmen, wenn sie für das PRD bereits bekannt und stabil sind.

## 10. Architektur und technische Leitplanken

Unterscheide explizit zwischen Brownfield und Greenfield.

### Brownfield / Starter Kit / CAS-Kontext

Im CAS-Kontext ist standardmäßig Brownfield anzunehmen. Das Projekt befindet sich bereits im Starter Kit, und der technische Stack ist durch bestehende Projektdateien und Regeln vorgegeben. Das PRD soll den Stack nicht neu festlegen, sondern auf diese Vorgaben referenzieren.

Typische Referenzen:

- `AGENTS.md`
- `KILO_INSTRUCTIONS.md`, falls vorhanden
- `package.json`
- Prisma-Schema
- vorhandene Starter-Kit-Struktur
- bestehende Auth-, Datenbank-, Test- und UI-Konventionen

Beschreibe nur komponentenspezifische technische Leitplanken, zum Beispiel:

- welche vorhandenen Starter-Kit-Bausteine genutzt werden
- welche vorhandenen Bausteine nicht gebraucht werden
- welche Mocks oder Schnittstellen ergänzt werden
- welche bekannten späteren Ausbaustufen technisch nicht verbaut werden sollen

Wichtig für Prototypen: Wenn das gewählte System keine Benutzeroberfläche, keine E-Mail-Funktion oder andere im Starter Kit vorhandene Komponenten benötigt, ist das akzeptabel. Vorhandene Komponenten müssen nicht gelöscht werden, solange sie nicht stören oder falsches Verhalten erzeugen. Unnötiges Entfernen kann im Prototyp mehr Aufwand erzeugen als Nutzen bringen.

#### Starter Kit Nutzung

Erstelle eine strukturierte Inventarliste der vorhandenen Starter-Kit-Bausteine. Diese Liste dient als Eingabe für `/adapt-to-project`, das vor dem ersten `/plan-feature` den Workspace bereinigt.

**Genutzte Bausteine:**

| Baustein | Status | Bemerkung |
|---|---|---|
| Auth (Better Auth, Rollen) | genutzt / nicht genutzt / teilweise | z.B. welche Rollen werden verwendet |
| Prisma DB + SQLite | genutzt / nicht genutzt / teilweise | |
| UI (shadcn/ui, Tailwind) | genutzt / nicht genutzt / teilweise | |
| E-Mail (Resend) | genutzt / nicht genutzt / teilweise | |
| LLM-Integration | genutzt / nicht genutzt / teilweise | |
| REST API Route Handlers | genutzt / nicht genutzt / teilweise | |
| File Upload | genutzt / nicht genutzt / teilweise | |

**Demo-Inhalte, die für dieses Projekt nicht relevant sind:**

- [ ] Demo-Entitäten im Prisma-Schema (z.B. `Antrag`, `Person`)
- [ ] Demo-Seiten (z.B. `/antraege`, `/personen`)
- [ ] Demo-API-Endpunkte
- [ ] Demo-Seed-Daten
- [ ] Demo-Tests

### Greenfield

Bei Greenfield-Projekten muss das PRD den technischen Stack und die zentralen Architekturentscheidungen explizit beschreiben:

- Frontend- und Backend-Technologien
- Datenbank und Persistenz
- Authentifizierung und Autorisierung
- Schnittstellenstrategie
- Deployment- und Betriebsannahmen
- Teststrategie
- relevante Libraries oder externe Dienste

## 11. Security, Datenschutz und Compliance

Beschreibe den MVP-Umgang mit:

- Authentifizierung
- Autorisierung und Rollen
- Testdaten vs. echte Daten
- personenbezogenen oder vertraulichen Informationen
- Logging und Audit Trail
- produktiven Security-Anforderungen, die nicht im Scope sind

Wenn das PRD auf anonymisierter Gesamtarchitektur basiert, halte dies fest.

## 12. Demo-Szenarien und Erfolgskriterien

Beschreibe die wichtigsten Szenarien, die in Demo oder Abnahme funktionieren müssen. Verweise dabei auf die relevanten User Stories, damit die Beziehung `User Story -> Demo-Szenario -> Erfolgskriterium` nachvollziehbar bleibt.

Empfohlenes Format:

| Szenario | Ablauf kurz | Abgedeckte User Stories | Ausbaustufe | Erfolgskriterium |
|---|---|---|---|---|
| Szenario 1 | Wer macht was? | US-1, US-2 | MVP | Woran sieht man, dass es funktioniert? |

Ergänze messbare oder beobachtbare Erfolgskriterien:

- [ ] Rolle A kann Vorgang X erfassen
- [ ] Rolle B sieht Status Y
- [ ] System sendet oder simuliert Benachrichtigung Z
- [ ] Mock-System antwortet nachvollziehbar

## 13. Risiken, Annahmen und offene Fragen

Trenne klar zwischen bestätigten Risiken, Annahmen und offenen Fragen.

Empfohlenes Format:

| Typ | Beschreibung | Auswirkung | Umgang |
|---|---|---|---|
| Risiko | Was könnte schiefgehen? | Hoch / Mittel / Niedrig | Mitigation |
| Annahme | Was wurde angenommen? | Was hängt daran? | Muss bestätigt werden durch... |
| Offene Frage | Was ist ungeklärt? | Warum relevant? | Klärung mit... |

Nimm im Kurskontext eine offene Frage auf, wenn die Angemessenheit des Umfangs noch mit dem Dozenten validiert werden soll.

## 14. Feature-Kandidaten für plan-feature

Liste die groben Features, die später einzeln geplant werden sollen. Die Reihenfolge soll sichtbar machen, welche Funktionen zuerst umgesetzt werden müssen und welche schrittweise ergänzt werden können.

Empfohlenes Format:

| Feature-Kandidat | Kurzbeschreibung | Etappe | Abhängigkeiten | Priorität |
|---|---|---|---|---|
| Feature 1 | Was soll später geplant werden? | MVP / Medium / Extended | Datenmodell, API, Rolle usw. | 1 |

Diese Liste hilft, den nächsten PIV-Schritt vorzubereiten. Sie ist noch kein detaillierter Implementierungsplan.

## 15. Appendix

Optional:

- verwendete Quellen
- relevante Auszüge aus Gesamtarchitektur oder DSL
- Glossar
- Links oder Dateipfade
- bewusst ausgeschlossene Dokumente, zum Beispiel SVG-Export nicht analysiert

## Qualitätscheck vor Abschluss

Prüfe vor dem Speichern:

- [ ] Das PRD beschreibt genau ein IT-System oder eine Komponente, nicht den gesamten End-to-End-Prozess.
- [ ] Rollen und Berechtigungen oder technische Konsumenten sind verständlich beschrieben.
- [ ] MVP, Medium-Version, Extended-/Luxus-Version und Out of Scope sind klar getrennt.
- [ ] Schnittstellen und Mocks sind nachvollziehbar.
- [ ] User Stories und Demo-Szenarien verweisen nachvollziehbar aufeinander.
- [ ] Offene Fragen und Annahmen sind markiert.
- [ ] Das PRD enthält genug Substanz, um danach einzelne Features mit `plan-feature` zu planen.
- [ ] Falls Gesamtarchitektur genutzt wurde: Markdown und, falls vorhanden, `architecture.dsl` wurden berücksichtigt.
- [ ] SVG-/PNG-Diagramme wurden nicht als fachliche Quelle analysiert.
- [ ] Bei Brownfield-/Starter-Kit-Projekten wurden bestehende technische Vorgaben referenziert statt neu entschieden.
- [ ] Bei Brownfield: Abschnitt "Starter Kit Nutzung" ist ausgefüllt (Bausteine-Tabelle + Liste irrelevanter Demo-Inhalte) und bereit als Eingabe für `/adapt-to-project`.
