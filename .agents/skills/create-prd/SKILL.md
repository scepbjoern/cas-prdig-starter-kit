---
name: create-prd
description: >
  Creates a Product Requirements Document for one IT system or component, optionally using a Gesamtarchitektur document and architecture DSL as context. ONLY activate when the user explicitly runs /create-prd or directly requests this specific workflow by name. Do NOT activate during normal development, planning, or implementation conversations.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  piv-phase: plan
  version: "2.0"
disable-model-invocation: true
argument-hint: "[output-filename]"
---

# Create PRD

Erstelle ein Product Requirements Document (PRD) für genau ein IT-System oder eine Komponente. Das PRD ist die fachliche Grundlage für spätere `plan-feature`-Schritte und ist noch kein Implementierungsplan auf Dateiebene.

## Grundregeln

- Führe den Nutzer schrittweise durch den PRD-Dialog.
- Stelle immer nur eine inhaltliche Frage auf einmal.
- Nutze eine vorhandene Gesamtarchitektur als Kontext, setze sie aber nie voraus.
- Wenn eine Gesamtarchitektur vorhanden ist und es dazu eine `architecture.dsl` gibt, fordere die DSL-Datei immer ebenfalls als Kontext an.
- Analysiere keine SVG-, PNG- oder Bildexporte inhaltlich. Verwende für Architekturdiagramm-Informationen die Markdown-Gesamtarchitektur und, falls vorhanden, die `architecture.dsl`.
- Markiere Annahmen klar, statt sie als bestätigte Fakten auszugeben.
- Schreibe das PRD auf Deutsch. Technische Begriffe wie API, Mock, Backend, Frontend, Authentication oder User Story dürfen Englisch bleiben.
- Unterscheide im PRD explizit zwischen MVP / Minimalversion, Medium-Version und Extended-/Luxus-Version.
- Beurteile nicht eigenständig, ob der Scope für ein Kursprojekt zu groß oder zu klein ist. Dokumentiere die Ausbaustufen sauber und verweise im Kurskontext darauf, dass Studierende den Umfang mit dem Dozenten validieren sollen.

## Datenschutz-Hinweis

Bevor Nutzer eine Gesamtarchitektur oder DSL-Datei als Kontext bereitstellen, weise kurz darauf hin:

> Gesamtarchitekturen können Unternehmensnamen, interne Systeme, Personenrollen oder vertrauliche Prozessdetails enthalten. Bitte anonymisiere die Unterlagen vor dem Einfügen oder Hochladen, wenn daraus ein reales Unternehmen, reale Personen oder sensible Informationen erkennbar sind.

Dieser Hinweis ist besonders wichtig im Kurskontext, gilt aber auch für andere Projekte.

## Brownfield und Greenfield

Kläre oder leite aus dem Kontext ab, ob das PRD für Brownfield- oder Greenfield-Entwicklung geschrieben wird.

- Im CAS-/Starter-Kit-Kontext ist standardmäßig Brownfield anzunehmen: Das Projekt existiert bereits, der technische Stack ist durch Starter-Kit-Dateien und Projektregeln vorgegeben. Das PRD soll dann nicht den Stack neu entscheiden, sondern auf die bestehenden Vorgaben referenzieren.
- Bei Greenfield-Projekten muss das PRD den technischen Stack und die zentralen technischen Leitplanken selbst definieren.
- Im Brownfield-/Starter-Kit-Kontext können vorhandene Komponenten wie UI, Auth, E-Mail, Datenbank oder Demo-Strukturen ungenutzt bleiben, wenn sie für das konkrete System nicht gebraucht werden. Sie sollen nicht nur deshalb gelöscht werden, weil das gewählte System sie nicht verwendet. Entfernen lohnt sich im Prototyp nur, wenn sie stören oder zu falschem Verhalten führen.

## Mehrpersonen-Fall

Wenn mehrere Personen im selben Repository am gleichen IT-System arbeiten, gilt:

- Erstelle weiterhin genau ein gemeinsames PRD für dieses IT-System oder diese Komponente.
- Weise darauf hin, dass alle beteiligten Personen das PRD fachlich bestätigen müssen, bevor Features aufgeteilt werden.
- Die Aufteilung erfolgt erst nach PRD-Bestätigung auf Feature-Ebene über `TASKS.md`, nicht über konkurrierende Sub-PRDs.

## Referenzen

- Verwende `references/prd-template.md` für Aufbau und Qualitätskriterien des PRD.
- Verwende `references/architecture-extraction.md`, wenn eine Gesamtarchitektur oder `architecture.dsl` vorliegt.

## Dialogablauf

### 1. Einstieg

Erkläre in 1-2 Sätzen, dass ein PRD für ein einzelnes IT-System oder eine einzelne Komponente erstellt wird. Frage danach zuerst, ob eine Gesamtarchitektur vorhanden ist.

Beispielfrage:

```text
Liegt eine Gesamtarchitektur-Dokumentation vor, die wir als Kontext für dieses PRD nutzen sollen?
```

### 2. Szenario A: Mit Gesamtarchitektur

Wenn der Nutzer eine Gesamtarchitektur nutzen will:

1. Gib den Datenschutz-Hinweis aus.
2. Bitte um den Pfad oder Inhalt der Gesamtarchitektur-Markdown-Datei.
3. Frage explizit nach der zugehörigen `architecture.dsl`, falls sie existiert.
4. Extrahiere Rollen, Systeme, Komponenten, Schnittstellen, Scope-Abgrenzung, Demo-Szenarien, Mocks, weggelassene Systeme, offene Fragen und Risiken gemäß `references/architecture-extraction.md`.
5. Fasse die extrahierten Informationen kompakt zusammen.
6. Lasse die Zusammenfassung bestätigen oder korrigieren.

Wenn mehrere Systeme oder Komponenten erkennbar sind, frage danach, für welches einzelne System oder welche einzelne Komponente das PRD erstellt werden soll. Biete die Kandidaten aus der Komponentenliste oder DSL an.

### 3. Szenario B: Ohne Gesamtarchitektur

Wenn keine Gesamtarchitektur vorhanden ist, überspringe die Architektur-Extraktion. Erfrage die fehlenden Kontextinformationen selbst, insbesondere:

- Name und Zweck des IT-Systems oder der Komponente
- Zielgruppen und Rollen
- wichtigste fachliche Vorgänge
- externe Systeme oder Schnittstellen
- Scope in Ausbaustufen: MVP / Minimalversion, Medium-Version, Extended-/Luxus-Version, Out of Scope
- technische Rahmenbedingungen, falls bekannt
- Brownfield- oder Greenfield-Kontext

### 4. Gezielte Rückfragen

Stelle nach der Kontextphase maximal 4-6 gezielte Rückfragen, jeweils einzeln. Priorisiere Fragen, die für ein brauchbares PRD kritisch sind:

- Welches konkrete Problem löst das System?
- Welche Rollen nutzen das System und mit welchen Berechtigungen?
- Welche Funktionen müssen zwingend in die MVP-/Minimalversion?
- Welche Funktionen gehören in eine mögliche Medium-Version?
- Welche Funktionen gehören höchstens in eine Extended-/Luxus-Version?
- Was ist ausdrücklich nicht Teil dieses Systems?
- Welche externen Systeme, Mocks oder APIs sind relevant?
- Welche Demo- oder Erfolgsszenarien müssen später funktionieren?

Im Brownfield-/Starter-Kit-Kontext zusätzlich ableiten oder erfragen, welche Starter-Kit-Bausteine genutzt werden (Auth, DB, UI, E-Mail, LLM, REST API, File Upload) und welche Demo-Inhalte für dieses Projekt nicht relevant sind. Diese Information fliesst in den Abschnitt "Starter Kit Nutzung" im PRD.

Dokumentiere bekannte spätere Ausbaustufen auch dann, wenn sie nicht Teil des MVP sind. So kann die spätere Feature-Planung Datenmodell, Schnittstellen und Architektur besser vorbereiten, ohne Medium- oder Extended-Funktionen als zugesagte MVP-Lieferung zu behandeln.

Vermeide Detailfragen, die erst in `plan-feature` gehören, zum Beispiel konkrete Dateinamen, UI-Komponenten oder vollständige API-Schemas, sofern sie für das PRD nicht zwingend sind.

### 5. PRD erzeugen

Erzeuge das PRD gemäß `references/prd-template.md`.

Wenn ein Zielpfad als Argument genannt wurde, speichere dorthin. Wenn kein Zielpfad genannt wurde, verwende:

```text
docs/project/prds/[systemname].md
```

Normalisiere den Dateinamen kleingeschrieben und mit Bindestrichen, zum Beispiel `docs/project/prds/prozessportal.md`.

### 6. Abschluss

Nach dem Schreiben des PRD:

1. Nenne den gespeicherten Dateipfad.
2. Fasse den Inhalt kurz zusammen.
3. Liste offene Annahmen oder ungeklärte Punkte auf.
4. Weise darauf hin, dass das PRD vor `plan-feature` fachlich geprüft werden muss.
5. Im Mehrpersonen-Fall: Weise darauf hin, dass alle beteiligten Personen das gemeinsame PRD bestätigen sollen, bevor einzelne Features in `TASKS.md` Personen und Branches zugewiesen werden.
6. Im Kurskontext: Empfiehl, Umfang und Ausbaustufen bei Bedarf mit dem Dozenten zu besprechen.

7. Im Brownfield-/Starter-Kit-Kontext: Weise darauf hin, dass nach der PRD-Bestätigung `/adapt-to-project [PRD-Pfad]` ausgeführt werden soll, bevor die erste neue Feature-Session gestartet wird. Dieser Skill bereinigt Demo-Code auf Basis des PRDs und stellt sicher, dass die App danach noch lauffähig ist.

Abschlussfrage:

```text
Ist das PRD vollständig und fachlich korrekt genug, um danach mit plan-feature einzelne Features zu planen?
```
