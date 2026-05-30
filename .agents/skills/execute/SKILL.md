---
name: execute
description: >
  Implements a confirmed feature plan one task at a time while updating task status and validation evidence in the plan file. Use it only after a docs/project/features/[feature-name]/plan.md file has been reviewed and approved. ONLY activate when the user explicitly runs /execute or directly requests this specific workflow by name. Do NOT activate during normal development, planning, or implementation conversations.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  piv-phase: implement
  version: "1.0"
disable-model-invocation: true
argument-hint: "[path-to-plan]"
---

# Execute: Plan Umsetzen

## Input

Pfad zur bestätigten Plan-Datei: `$ARGUMENTS`

Beispiel:

```text
/execute docs/project/features/antrag-formular/plan.md
```

## Grundregeln

- Implementiere nur auf Basis einer bestätigten Plan-Datei.
- Arbeite genau einen Task nach dem anderen ab.
- Stoppe nach jedem Task, zeige das Ergebnis und warte auf Bestätigung.
- Ändere keine Dateien, die nicht zum aktuellen Task gehören.
- Lösche keine Dateien ohne explizite Bestätigung.
- Setze einen Task nie auf `done`, ohne Validierung in der Plan-Datei zu dokumentieren.
- Nach einem validierten Task oder einer kohärenten validierten Phase darf ein optionaler Zwischencommit über `/commit` vorgeschlagen werden.
- Ein Feature gilt erst nach allen `done`-Tasks, vollständiger Validierung und `/document` als abgeschlossen, auch wenn es bereits Zwischencommits gibt.
- Im Mehrpersonen-Fall: Arbeite nur am eigenen bestätigten Feature und überschreibe keine Änderungen anderer Personen oder Branches.

## Pflichtlektüre vor Umsetzung

Lies vor dem ersten Task den gesamten Plan vollständig. Starte nicht direkt beim ersten Task, sondern verstehe zuerst den Gesamtzusammenhang.

Lies vollständig:

- Plan-Datei aus `$ARGUMENTS`
- `KILO_INSTRUCTIONS.md` oder `CLAUDE.md`
- `AGENTS.md`
- `TASKS.md`, besonders bei geteiltem Repository für Verantwortliche, Branches und parallele Features
- `prisma/schema.prisma`, wenn Datenmodell, Rollen oder Status betroffen sind
- Alle im aktuellen Task referenzierten Dateien

Analysiere vor der Umsetzung:

- Alle Tasks und ihre Abhängigkeiten
- Reihenfolge und kritische Pfade
- Validierungsschritte aus dem Plan
- Mögliche Auswirkungen auf bestehende Kernworkflows

## Task-Status Aktualisieren

Aktualisiere die Plan-Datei während der Arbeit:

- Beim Start eines Tasks: `planned` -> `in_progress`
- Bei Unklarheit oder fehlender Entscheidung: `needs_human`, Frage in der Plan-Datei dokumentieren, stoppen
- Nach Implementierung vor Validierung: `validating`
- Nach erfolgreicher Validierung: `done`

Erlaubte Statuswerte:

```text
planned | in_progress | needs_human | validating | done
```

## Umsetzung pro Task

Für jeden Task:

1. Task aus der Plan-Datei identifizieren.
2. Betroffene Datei(en), gewünschte Aktion und Akzeptanzkriterien identifizieren.
3. Status auf `in_progress` setzen.
4. Relevante Dateien lesen.
5. Detaillierte Spezifikation aus dem Plan exakt befolgen.
6. Bestehende Code-Patterns, Namenskonventionen und Architekturgrenzen einhalten.
7. TypeScript-Typen sauber definieren, keine unbegründeten `any` oder `as` verwenden.
8. Dokumentation oder kurze Code-Kommentare nur ergänzen, wenn sie für Verständnis oder Nutzung nötig sind.
9. Strukturiertes Logging nur ergänzen, wenn im bestehenden Projektpattern vorhanden oder im Plan gefordert.
10. Minimal korrekte Änderung umsetzen.
11. Tests oder Validierung gemäss Task ergänzen.
12. Prüfen, ob Typdefinitionen, Imports und Schnittstellen konsistent sind.
13. Status auf `validating` setzen.
14. Validierung durchführen oder, falls der Nutzer sie ausführen muss, genaue Anleitung dokumentieren.
15. Validierungsergebnis in der Plan-Datei festhalten.
16. Bei erfolgreicher Validierung Status auf `done` setzen.
17. Stoppen, Ergebnis zeigen und bei sinnvoller logischer Einheit optional auf `/commit` als Zwischencommit hinweisen.

## Validierung

Nutze projektkonforme Checks:

- Unit Tests: `npm run test`
- E2E Tests, falls betroffen: `npm run test:e2e`
- Build nach grösseren Änderungen oder spätestens nach 3 Tasks: `npm run build`
- Manuelle Prüfung in der laufenden App

Wenn die Plan-Datei konkrete Validierungsbefehle nennt, führe alle dort genannten Befehle vollständig und in der angegebenen Reihenfolge aus. Standardchecks ergänzen die Plan-Validierung, ersetzen sie aber nicht.

Wenn eine Validierung fehlschlägt:

- Fehlerursache analysieren
- Implementierung oder Test korrigieren
- denselben Validierungsschritt erneut ausführen
- erst fortfahren, wenn der Schritt erfolgreich ist oder der Task mit `needs_human` gestoppt wurde

Überspringe keine Validierungsschritte. Falls ein Schritt nicht ausführbar ist, dokumentiere den Grund und die manuelle Alternative in der Plan-Datei.

Prüfe Regressionen stack-spezifisch:

- Bestehende Vitest-Tests für betroffene Schemas, Utilities und Statuslogik erweitern, wenn ein Kernverhalten stabil bleiben muss.
- Bestehende Playwright-Flows erweitern oder neue E2E-Schritte ergänzen, wenn Login, CRUD, Rollen, Navigation oder Statusworkflow betroffen sind.
- Bei reinen Dokumentations- oder Konfigurationsänderungen reicht eine begründete manuelle Regressionseinschätzung.
- Keine Python-, pytest- oder separate `tests/test_regression.py`-Regeln verwenden.

Nach jedem Task soll der Nutzer `npm run dev` prüfen, falls ein UI- oder Laufzeitverhalten betroffen ist. Der Agent soll den Nutzer dazu auffordern, den Dev-Server zu prüfen, statt automatisch langfristige Dev-Server-Prozesse zu erzwingen.

## Plan- und PRD-Abweichungen

Wenn sich während der Implementierung ergibt, dass der bestätigte Plan oder ein zugrunde liegendes PRD nicht mehr korrekt ist:

- Setze den betroffenen Task auf `needs_human`, wenn die Abweichung eine fachliche oder architektonische Entscheidung erfordert.
- Erstelle einen konkreten Vorschlag, wie `docs/project/features/[feature-name]/plan.md` aktualisiert werden soll.
- Erstelle, falls ein PRD betroffen ist, einen konkreten Vorschlag, wie das PRD aktualisiert werden soll.
- Zeige beide Vorschläge zur Genehmigung, bevor du Plan oder PRD inhaltlich änderst.
- Dokumentiere nach Genehmigung in der Plan-Datei, welche Abweichung beschlossen wurde und warum.

## Dokumentation nach Umsetzung

Am Ende der Umsetzung soll nach vollständiger Validierung der Dokumentations-Skill aufgerufen werden:

```text
/document docs/project/features/[feature-name]/plan.md
```

Der Skill erstellt Endanwender- und Entwicklerdokumentation im selben Feature-Unterordner, z.B. `docs/project/features/[feature-name]/user-guide.md` und `docs/project/features/[feature-name]/developer-notes.md`.

Zwischencommits vor `/document` sind erlaubt, wenn der jeweilige Stand validiert und plan-konform ist. `/document` bleibt die finale Abschlussstufe für das gesamte Feature und wird danach normalerweise mit einem finalen `/commit` festgehalten.

## Prisma-Regel

Bei Änderungen an `prisma/schema.prisma`:

- Dokumentiere genau, was am Schema geändert wurde.
- Informiere den Nutzer, dass `npm run db:reset` ausgeführt werden muss.
- Verwende keine Prisma Migrations.
- Setze betroffene Tasks erst auf `done`, wenn die notwendige DB-Validierung dokumentiert ist.
- Im Mehrpersonen-Fall: Prüfe vor der Änderung `TASKS.md` auf andere aktive Schema-Features. Wenn ein paralleles Schema-Feature existiert oder die Reihenfolge unklar ist, setze den Task auf `needs_human` und stoppe zur Abstimmung.

## Abschluss

Wenn alle Tasks `done` sind:

- Root-`TASKS.md` auf Status `done` für dieses Feature aktualisieren.
- Zusammenfassung aller abgeschlossenen Tasks ausgeben.
- Dateien mit Änderungen auflisten.
- Validierungsergebnisse zusammenfassen.
- Manuelle Test-Anleitung geben.
- Hinweis auf den nächsten Workflow `/document docs/project/features/[feature-name]/plan.md` ausgeben.
- Ready-for-Feature-Abschluss-Abschnitt ausgeben: Änderungen vollständig, Validierungen erfolgreich oder dokumentiert, offene Risiken genannt.
- Auf `/document` und danach einen finalen `/commit` als nächste Workflows hinweisen, ohne selbst zu committen.

## Unerwartete Issues und Planabweichungen

- Dokumentiere Issues, die nicht im Plan vorgesehen waren.
- Begründe jede notwendige Abweichung vom Plan.
- Führe keine nicht genehmigten fachlichen Scope-Änderungen durch.
- Halte bestehende Funktionalität regressionsfrei; wenn ein Restrisiko bleibt, dokumentiere es im Abschlussbericht.
