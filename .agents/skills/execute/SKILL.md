---
name: execute
description: >
  Implements a confirmed, reviewed, versioned feature plan one task at a time while updating task status and validation evidence in the plan file. Use it only after a docs/project/features/[feature-name]/plan-vNNN.md file has been reviewed, integrated, approved, and committed. ONLY activate when the user explicitly runs /execute or directly requests this specific workflow by name. Do NOT activate during normal development, planning, or implementation conversations.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  piv-phase: implement
  version: "2.0"
disable-model-invocation: true
argument-hint: "[path-to-plan]"
---

> **KiloCode-Modus:** Dieser Skill muss im **Code-Modus** ausgeführt werden. Im Architect- oder Plan-Modus beschränkt KiloCode Schreibrechte auf `.kilo/`-Ordner – Änderungen an Projektdateien und Statusupdates in der Plan-Datei wären nicht möglich. Wechsle in KiloCode vor der Ausführung auf den **Code-Modus**.

# Execute: Plan Umsetzen

## Input

Pfad zur bestätigten Plan-Datei: `$ARGUMENTS`

Beispiel:

```text
/execute docs/project/features/antrag-formular/plan-v002.md
```

## Grundregeln

- Implementiere nur auf Basis einer bestätigten Plan-Datei.
- Verwende eine versionierte Plan-Datei `plan-vNNN.md`. Neue Projekte sollen nicht mehr mit `plan.md` arbeiten.
- Starte nicht mit `plan-v001.md`, wenn noch kein Review und keine Integration gelaufen sind. Der Normalfall nach einer Review-Integration ist `plan-v002.md`.
- Arbeite genau einen Task nach dem anderen ab.
- **Stoppe nach jedem einzelnen Task vollständig. Fahre niemals automatisch mit dem nächsten Task fort – auch dann nicht, wenn alle automatisierten Tests bestanden haben. Jeder Taskwechsel erfordert eine explizite menschliche Antwort.**
- Ändere keine Dateien, die nicht zum aktuellen Task gehören.
- Lösche keine Dateien ohne explizite Bestätigung.
- Setze einen Task nie auf `done`, ohne Validierung in der Plan-Datei zu dokumentieren.
- Nach einem validierten Task oder einer kohärenten validierten Phase darf ein optionaler Zwischencommit über `/commit` vorgeschlagen werden.
- Ein Feature gilt erst nach allen `done`-Tasks, vollständiger Validierung und `/document` als fachlich dokumentiert. Wenn es während Umsetzung oder Dokumentation Verdacht auf wiederholbare Agent-Fehler, Planlücken oder wiederholte Nutzerkorrekturen gab, soll vor dem finalen Commit zusätzlich `/reflect-rules` laufen.
- Im Mehrpersonen-Fall: Arbeite nur am eigenen bestätigten Feature und überschreibe keine Änderungen anderer Personen oder Branches.

## Pflichtpause nach jedem Task

**Diese Regel hat die höchste Priorität und überschreibt jede andere Anweisung zum Arbeitsfluss.**

Nach Abschluss jedes Tasks – unabhängig davon, ob alle automatisierten Validierungen erfolgreich waren – gilt zwingend:

**Schritt A – Zusammenfassung ausgeben:**

Zeige strukturiert:
- Welche Dateien wurden geändert oder erstellt
- Welche automatisierten Befehle wurden ausgeführt (vollständige Befehle nennen) und was das Ergebnis war (Erfolg / Fehleranzahl / relevante Ausgabe)

**Schritt B – Manuelle Prüfung, falls der Task UI oder Laufzeitverhalten betrifft:**

Beschreibe **ausführlich und Schritt für Schritt**, was der Mensch jetzt tun muss:
- Welchen Befehl starten (z.B. `npm run dev`)
- Welche URL im Browser aufrufen
- Was genau zu klicken, einzugeben oder auszulösen ist
- Welche Rolle einloggen, falls rollenbasiertes Verhalten geprüft wird
- Was konkret zu sehen oder nicht zu sehen sein muss (erwartetes Ergebnis)
- Was bei Abweichungen zu melden ist

Warte danach explizit auf die Bestätigung des Menschen, dass die manuelle Prüfung erfolgreich war. Fahre nicht fort, bis diese Bestätigung vorliegt.

**Schritt C – Explizite Weitermachen-Aufforderung:**

Schliesse jeden Task-Abschluss mit dieser exakten Formulierung ab:

```
✓ Task [N] abgeschlossen und validiert.
Bitte prüfen und mit "weiter" bestätigen, damit Task [N+1] gestartet wird.
```

**Fahre erst nach einer expliziten menschlichen Antwort (z.B. "weiter", "ok", "ja") mit dem nächsten Task fort. Interpretiere Schweigen oder fehlende Antwort nicht als Bestätigung.**

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

Wenn ein Task im Plan erkennbar nur ein technischer Folgeschritt des vorherigen Tasks ist und keine eigenständige fachliche Validierung erlaubt (z.B. ein isolierter „`npx prisma generate`"-Task nach einem Schema-Task), führe beide zusammen aus und behandle sie als eine Einheit für Validierung und Commit. Dokumentiere das kurz in der Plan-Datei. Dies ist die Ausnahme – im Normalfall wird jeder Task einzeln abgearbeitet.

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
14. Automatisierte Validierung durchführen (z.B. `npm run test`, `npm run build`) und dem Nutzer explizit berichten, welche Befehle ausgeführt wurden und was das Ergebnis war. Keine Validierung stillschweigend überspringen.
15. Nutzer zur manuellen Prüfung auffordern: Falls UI- oder Laufzeitverhalten betroffen ist, den Nutzer explizit bitten, `npm run dev` zu starten und das Ergebnis im Browser zu prüfen. Warten, bis der Nutzer die manuelle Prüfung bestätigt hat.
16. Validierungsergebnis (automatisiert und manuell) in der Plan-Datei festhalten.
17. Status erst auf `done` setzen, nachdem der Nutzer die Validierung bestätigt hat.
18. Zusammenfassung des abgeschlossenen Tasks ausgeben: Was wurde umgesetzt, welche Validierungen liefen, welches Ergebnis.
19. `/commit` als Zwischencommit vorschlagen. Dieser Schritt ist nach jedem abgeschlossenen Task verpflichtend – nicht optional. Der Nutzer entscheidet, ob er den Commit jetzt macht oder erst nach mehreren Tasks.

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
- Führe keine stille Korrektur im Produktivcode und keine direkte Änderung der bestehenden Plan-Version durch.
- Erkläre konkret, welche Plan- oder PRD-Stelle nicht mehr tragfähig ist und warum daraus keine plan-konforme Umsetzung möglich ist.
- Wenn das PRD betroffen ist, fordere den Nutzer auf, zuerst `/update-prd [PRD-Pfad]` auszuführen.
- Wenn der Feature-Plan betroffen ist, fordere den Nutzer auf, danach oder direkt `/update-feature-plan [Plan-Pfad]` auszuführen.
- Fahre erst mit `/execute [neuer Plan-Pfad]` fort, wenn die neue Plan-Version fachlich und technisch bestätigt sowie committed wurde.

## Dokumentation nach Umsetzung

Am Ende der Umsetzung soll nach vollständiger Validierung der Dokumentations-Skill aufgerufen werden:

```text
/document docs/project/features/[feature-name]/plan-vNNN.md
```

Der Skill erstellt Endanwender- und Entwicklerdokumentation im selben Feature-Unterordner, z.B. `docs/project/features/[feature-name]/user-guide.md` und `docs/project/features/[feature-name]/developer-notes.md`.

Zwischencommits vor `/document` sind erlaubt, wenn der jeweilige Stand validiert und plan-konform ist. Nach `/document` soll der Nutzer prüfen, ob `/reflect-rules` direkt in derselben Session sinnvoll ist. Das ist besonders wichtig, wenn der Chatverlauf Hinweise auf wiederholbare Agent-Fehler, Planlücken, ungewöhnliche Nacharbeiten oder wiederholte Nutzerkorrekturen enthält. Danach wird der Feature-Abschluss normalerweise mit einem finalen `/commit` festgehalten.

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
- Hinweis auf den nächsten Workflow `/document docs/project/features/[feature-name]/plan-vNNN.md` ausgeben.
- Ready-for-Feature-Abschluss-Abschnitt ausgeben: Änderungen vollständig, Validierungen erfolgreich oder dokumentiert, offene Risiken genannt.
- Auf `/document` als nächsten Workflow hinweisen.

## Unerwartete Issues und Planabweichungen

- Dokumentiere Issues, die nicht im Plan vorgesehen waren.
- Begründe jede notwendige Abweichung vom Plan.
- Führe keine nicht genehmigten fachlichen Scope-Änderungen durch.
- Halte bestehende Funktionalität regressionsfrei; wenn ein Restrisiko bleibt, dokumentiere es im Abschlussbericht.
