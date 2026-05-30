---
name: plan-feature
description: >
  Turns a feature idea or PRD reference into a granular, reviewable implementation plan for this starter kit. Use it when a new feature needs a confirmed plan before code is written. ONLY activate when the user explicitly runs /plan-feature or directly requests this specific workflow by name. Do NOT activate during normal development, planning, or implementation conversations.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  piv-phase: plan
  version: "1.0"
disable-model-invocation: true
argument-hint: "[feature-description-or-prd-reference]"
---

# Plan Feature: Feature Planen

## Input

Feature-Beschreibung oder Referenz auf bestehende Datei: `$ARGUMENTS`

Beispiele:

- `/plan-feature Antrag-Formular mit Statusänderung`
- `/plan-feature docs/prd-antrag-workflow.md Kapitel Einreichung`

## Grundregel

Schreibe in dieser Phase keinen Produktivcode. Ziel ist ein bestätigbarer, kontextreicher Plan als autoritative Arbeitsgrundlage für `/execute`.

Qualitätsziel: Der Plan soll so vollständig sein, dass ein Umsetzungsagent das Feature mit minimalen Rückfragen taskweise implementieren kann. Context is King: Der Plan muss relevante Patterns, Pflichtlektüre, Dokumentation, Gotchas, Validierungsbefehle und Akzeptanzkriterien enthalten.

## Phase 1: Initiales Feature-Verständnis

Verstehe zuerst grob, was gebaut werden soll. Stelle in dieser frühen Phase nur Fragen, wenn ohne Antwort keine sinnvolle Recherche starten kann.

Ermittle initial:

- Welches Problem löst das Feature?
- Für welche Rolle ist es gedacht: `admin`, `user_applicant`, `user_reviewer`?
- Welcher User Value oder Business Impact wahrscheinlich gemeint ist
- Was ist im Scope und was explizit nicht?
- Welche Daten, Statuswerte, E-Mails, KI-Funktionen oder Rollenregeln sind betroffen?
- Gibt es ein PRD oder bestehende Dokumentation unter `docs/`?
- Welche manuelle Prüfung soll am Ende möglich sein?

Erstelle oder verfeinere eine vorläufige User Story:

```text
Als <Rolle>
möchte ich <Aktion/Ziel>,
damit <Nutzen/Wert>.
```

Klassifiziere das Feature vorläufig:

- Feature-Typ: New Capability, Enhancement, Refactor oder Bug Fix
- Komplexität: Low, Medium oder High
- Primär betroffene Systeme: UI, Server Actions, Route Handler, Prisma, Auth, E-Mail, LLM, Tests
- Abhängigkeiten: externe Libraries, ENV-Werte, bestehende Daten oder offene Entscheidungen

Wenn Anforderungen unklar sind, aber durch Repo- oder Dokumentationsrecherche wahrscheinlich geklärt werden können, frage den Nutzer noch nicht. Recherchiere zuerst selbst.

## Phase 2: Relevanten Kontext Lesen

Lies mindestens:

- Relevante PRD- oder Konzeptdatei unter `docs/`, falls genannt oder auffindbar
- `KILO_INSTRUCTIONS.md` oder `CLAUDE.md`
- `AGENTS.md`
- `TASKS.md`
- `package.json`
- `prisma/schema.prisma`, wenn Datenmodell, Rollen oder Status betroffen sind
- Ähnliche Implementierungen in `src/app/`, `src/lib/`, `src/components/`, `__tests__/unit/`, `e2e/`

Nutze bestehende Patterns. Erfinde keine parallele Architektur.

Analysiere explizit:

- Projektstruktur, Sprachen, Frameworks und Runtime-Versionen
- Architekturgrenzen zwischen `src/app/`, `src/lib/`, `src/components/`, Prisma und Tests
- ähnliche Implementierungen im Codebase
- Naming-, Datei-, Fehlerbehandlungs-, Logging- und UI-Patterns
- Anti-Patterns, die vermieden werden müssen
- externe Dependencies, Versionen und Integrationsweise
- bestehende Teststruktur und ähnliche Vitest-/Playwright-Beispiele
- Integration Points: Navigation, Route Handler, Server Actions, Prisma-Modelle, Rollenprüfung, E-Mail, LLM

## Phase 3: Externe Recherche und Dokumentation

Nutze externe Recherche nur, wenn sie für korrekte Planung nötig ist, z.B. bei Next.js 16 APIs, Prisma 7, Better Auth, shadcn/ui oder Playwright.

Dokumentiere Referenzen im Plan mit:

- Link zur offiziellen Dokumentation
- spezifischem Abschnitt oder Thema
- kurzer Begründung, warum diese Referenz relevant ist

Prüfe besonders:

- aktuelle APIs und Breaking Changes
- bekannte Gotchas
- Security- und Performance-Aspekte
- Best Practices für die verwendeten Libraries

## Phase 4: Menschliche Präzisierung nach Recherche

Stelle nach Phase 2 und 3 gezielte Rückfragen, wenn wichtige Punkte nicht selbst aus Repo, PRD, Dokumentation oder offiziellen Quellen ableitbar sind.

Frage nur nach Entscheidungen, nicht nach Informationen, die du selbst recherchieren kannst. Gute Rückfragen betreffen zum Beispiel:

- fachlicher Scope oder Non-Scope
- gewünschtes Verhalten bei Statuswechseln oder Sonderfällen
- Priorisierung zwischen zwei plausiblen UX- oder Architekturvarianten
- fehlende fachliche Regeln zu Rollen, Berechtigungen oder Benachrichtigungen
- unklare Akzeptanzkriterien

Nachdem der Mensch Präzisierungsfragen beantwortet hat, prüfe, ob eine erneute Phase 2 oder Phase 3 nötig ist. Wiederhole Repo-Recherche und externe Recherche bei Bedarf gezielter und gründlicher für die geklärten Details, bevor du den finalen Plan schreibst.

Plane nicht auf Basis kritischer Annahmen. Dokumentiere nichtkritische Annahmen ausdrücklich im Plan.

## Phase 5: Strategisches Durchdenken

Denke vor der Plan-Datei explizit durch:

- Wie passt das Feature in die bestehende Architektur?
- Welche Reihenfolge und Abhängigkeiten sind kritisch?
- Welche Edge Cases, Race Conditions oder Fehlerfälle können auftreten?
- Welche Security-, Performance- und Maintainability-Risiken gibt es?
- Welche Alternativen wurden erwogen und warum wird der gewählte Ansatz bevorzugt?
- Ist Backward Compatibility relevant? Nur einplanen, wenn es einen konkreten Grund gibt.

## Phase 6: Architektur- und Datei-Entscheide

Dokumentiere im Plan:

- Betroffene bestehende Dateien
- Neue Dateien mit Begründung
- relevante Dateien mit Zeilenhinweisen, wenn möglich, und warum sie gelesen werden müssen
- konkrete Patterns to Follow mit Beispielen oder Dateireferenzen
- Server Component vs. Client Component
- Server Actions vs. Route Handler
- Zod-Schemas und React Hook Form, falls Formulare betroffen sind
- Prisma-Änderungen, falls nötig
- Better-Auth- und Rollenregeln
- Unit- und E2E-Teststrategie
- Edge Cases und Regressionen

Bei Prisma-Schema-Änderungen: ausdrücklich markieren, dass der Nutzer nach Umsetzung `npm run db:reset` ausführen muss. Keine Prisma Migrations verwenden.

## Phase 7: Plan-Datei Erstellen

Erstelle eine Markdown-Datei unter:

```text
docs/plan-[feature-name].md
```

Nutze kebab-case für `[feature-name]`, z.B. `docs/plan-antrag-formular.md`.

Die Datei ist kombinierter Spec+Plan+Tasks-Container. Verwende `references/plan-template.md` als Ausgangspunkt und fülle alle relevanten Abschnitte konkret aus. Entferne keine Qualitätsabschnitte nur deshalb, weil sie Arbeit machen; schreibe stattdessen `Nicht relevant` mit kurzer Begründung.

Task-Format:

- Nutze Aktionskeywords wie `CREATE`, `UPDATE`, `ADD`, `REMOVE`, `REFACTOR`, `MIRROR`.
- Jeder Task muss atomic und einzeln validierbar sein.
- Jeder Task muss `IMPLEMENT`, `PATTERN`, `IMPORTS`, `GOTCHA`, `ACCEPTANCE CRITERIA` und `VALIDATE` enthalten, sofern anwendbar.
- Jeder Task startet mit Status `planned`.

Validierung stack-spezifisch:

- TypeScript/React/Zod/Prisma-Logik: `npm run test`
- UI-/Rollen-/CRUD-Flows: `npm run test:e2e`
- grössere Änderungen: `npm run build`
- lokale Laufzeit und UI: Nutzer prüft `npm run dev` und manuelle Schritte
- Regressionen über bestehende Vitest- oder Playwright-Tests abdecken, keine Python-/pytest-Regeln verwenden

## Phase 8: Plan-Qualität Prüfen

Prüfe den Plan vor dem Speichern gegen diese Kriterien:

- Context Completeness: Pflichtlektüre, Patterns, Gotchas, Integration Points und Docs sind spezifisch.
- Implementation Ready: Ein anderer Agent kann top-to-bottom umsetzen, ohne zusätzliche Recherche zu erfinden.
- Pattern Consistency: Bestehende Architektur und Konventionen werden eingehalten.
- Information Density: Keine generischen Aufgaben; alle Tasks nennen Dateien, Aktionen und Validierung.
- Validation Complete: Jeder Task hat konkrete Validierungsschritte.
- Edge Cases: relevante Fehlerfälle, Security und Berechtigungen sind bedacht.
- Documentation Ready: spätere Endanwender- und Entwicklerdokumentation ist mitgedacht.

Vergib einen Confidence Score `#/10` für die Wahrscheinlichkeit, dass `/execute` den Plan taskweise erfolgreich umsetzen kann. Begründe Werte unter 8 kurz.

## Phase 9: Root-TASKS.md Aktualisieren

Nach Erstellung der Plan-Datei aktualisiere `TASKS.md` als Feature-Index:

- Feature-Name
- Status `planned`
- Link zur Plan-Datei
- Datum

Trage keine Detailtasks in Root-`TASKS.md` ein.

## Output

Zeige danach:

- Pfad der erstellten Plan-Datei
- Kurzzusammenfassung des Ansatzes
- Feature-Typ und Komplexität
- wichtigste Risiken, Gotchas oder offenen Entscheidungen
- Confidence Score für die Umsetzung
- Offene Fragen oder Annahmen
- Hinweis: Erst nach menschlicher Bestätigung darf `/execute` implementieren
