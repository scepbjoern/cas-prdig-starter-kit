---
name: reflect-rules
description: >
  Reviews suspected lessons learned after a completed and documented feature and proposes targeted updates to agent instruction files and PIV skills so future agents do not repeat the same mistakes. Use after /document before the final /commit when the user or agent suspects repeated user corrections, agent mistakes, rule gaps, skill gaps, unusual rework, or instruction improvements; best run in the same session while the chat history is still available.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  piv-phase: validate
  version: "1.0"
disable-model-invocation: true
argument-hint: "[path-to-plan]"
---

# Reflect Rules: Agent-Regeln Verbessern

## Input

Pfad zur vollständig umgesetzten, validierten und dokumentierten Plan-Datei: `$ARGUMENTS`

Beispiel:

```text
/reflect-rules docs/project/features/antrag-formular/plan.md
```

## Ziel

Prüfe nach einem abgeschlossenen Feature, ob aus Umsetzung, Validierung, Dokumentation und Nutzerkorrekturen dauerhafte Verbesserungen für Agenten-Regeln oder PIV-Skills entstehen sollen.

Der Skill ist ein verdachtsbasierter Reflexionsschritt. Er soll vor allem dann genutzt werden, wenn während der Umsetzung oder Dokumentation ungewöhnlich viele Korrekturen, Planabweichungen, Nacharbeiten oder regelbezogene Missverständnisse aufgetreten sind.

Führe den Skill möglichst in derselben Session direkt nach `/document` aus, weil der Chatverlauf oft die wichtigste Quelle ist. Ein späterer Aufruf in einer neuen Session ist möglich, braucht aber mehr Artefakt-Lektüre und damit mehr Input-Tokens.

## Grundregeln

- Bearbeite zuerst keine Dateien. Erstelle zuerst eine konkrete Vorschlagsliste.
- Arbeite tokenbewusst: Starte mit einer kurzen Triage und lies Regel- oder Skill-Dateien erst vollständig, wenn ein konkreter Verdacht besteht.
- Unterscheide zwischen Einzelfall, projektspezifischer Regel und Starter-Kit-Regel.
- Nimm nur Regeln auf, die in zukünftigen Agent-Sessions real helfen.
- Schreibe keine fachlichen Projektentscheidungen in allgemeine Coding-Regeln.
- Vermeide Duplikate zwischen `KILO_INSTRUCTIONS.md`, `AGENTS.md`, `CLAUDE.md` und Skills.
- Ändere PIV-Skills nur, wenn das Problem durch den Workflow selbst begünstigt wurde.
- Ändere `prime` nur, wenn künftig zusätzliche Dateien, Risiken oder Zusammenhänge zu Beginn einer Session gelesen werden müssen.
- Ändere `plan-feature` nur, wenn künftige Pläne bessere Pflichtlektüre, Gotchas, Akzeptanzkriterien oder Validierung brauchen.
- Ändere `execute` nur, wenn die Task-Umsetzung strengere Checks, Stop-Regeln oder Statusdokumentation braucht.
- Ändere `document` nur, wenn die finale Feature-Dokumentation künftig andere Informationen erfassen oder ausgeben soll.
- Frage vor jeder Änderung an Regel- oder Skill-Dateien nach menschlicher Bestätigung.

## Phase 0: Triage

Beginne mit einer kurzen, sparsamen Prüfung:

- Gibt es im aktuellen Chatverlauf wiederholte Nutzerkorrekturen, Missverständnisse, Stopps, Planabweichungen oder "das sollte in den Regeln stehen"-Momente?
- Hat der Agent selbst mehrfach nacharbeiten müssen, weil Regeln, Plan, Skill-Schritte oder Pflichtlektüre nicht klar genug waren?
- Enthält die Plan-Datei dokumentierte Abweichungen, `needs_human`, Validierungsprobleme oder offene Risiken?
- Gibt es Hinweise in `user-guide.md` oder `developer-notes.md`, dass wichtige Gotchas erst spät entdeckt wurden?

Wenn keine solchen Hinweise erkennbar sind:

1. Erkläre kurz, dass keine regelwürdigen Muster sichtbar sind.
2. Weise darauf hin, dass ein tieferer Audit mehr Input-Tokens braucht.
3. Gib den Dozierenden-Hinweis nur aus, wenn trotzdem relevante Starter-Kit-Beobachtungen entstanden sind.
4. Empfiehl `/commit` als nächsten Schritt.
5. Stoppe den Skill hier, ausser der Nutzer verlangt ausdrücklich einen vertieften Audit.

Fahre nur mit Phase 1 fort, wenn Phase 0 einen konkreten Verdacht ergeben hat oder der Nutzer trotz fehlender Hinweise ausdrücklich eine vertiefte Prüfung wünscht.

## Situative Lektüre

Lies nur so viel wie nötig.

Für die Triage reicht normalerweise:

- Plan-Datei aus `$ARGUMENTS`
- relevante Abschlussabschnitte in `docs/project/features/[feature-name]/user-guide.md`, falls vorhanden
- relevante Abschlussabschnitte in `docs/project/features/[feature-name]/developer-notes.md`, falls vorhanden
- sichtbarer Chatverlauf, insbesondere Nutzerkorrekturen und Agent-Nacharbeiten

Lies erst bei konkretem Verdacht vollständig:

- `KILO_INSTRUCTIONS.md`, wenn Coding-, Stack-, Testing- oder Architekturregeln betroffen sind
- `AGENTS.md`, wenn projektspezifischer Kontext, Rollen, Scope oder Datenmodell betroffen sind
- `CLAUDE.md`, nur wenn ein Claude-spezifischer Kurzverweis betroffen ist
- `.agents/skills/prime/SKILL.md`, wenn Session-Start-Kontext fehlt
- `.agents/skills/plan-feature/SKILL.md`, wenn Pläne strukturell zu schwach waren
- `.agents/skills/execute/SKILL.md`, wenn Umsetzung, Validierung oder Statusführung problematisch war
- `.agents/skills/document/SKILL.md`, wenn Abschlussdokumentation wichtige Informationen nicht erfasst hat
- `.agents/skills/create-rules/SKILL.md`, wenn ein späterer Instruction-Refresh den Regeltyp erhalten muss
- `docs/starter-kit-usage/PIV-WORKFLOW.md`, wenn Nutzer den Workflow-Schritt oder Zweck verstehen müssen

Nutze Git nur gezielt und lesend, z.B. `git status`, `git diff HEAD --name-only` oder einen Diff auf konkrete Zielpfade. Wenn der Chatverlauf nicht verfügbar oder unvollständig ist, erkläre, dass die Analyse weniger zuverlässig ist und eventuell mehr Input-Tokens durch Artefakt-Lektüre braucht.

## Phase 1: Feature-Abschluss Prüfen

Prüfe:

- Sind alle Feature-Tasks `done` oder begründete Ausnahmen dokumentiert?
- Sind Validierungen dokumentiert?
- Wurde `/document` bereits ausgeführt?
- Existieren `user-guide.md` und `developer-notes.md` oder ist dokumentiert, warum nicht?

Wenn `/document` noch nicht gelaufen ist, stoppe und empfehle zuerst:

```text
/document docs/project/features/[feature-name]/plan.md
```

## Phase 2: Lernpunkte Sammeln

Ermittle aus Plan, Dokumentation, Diffs und sichtbarem Chatkontext:

- Welche Fehler, Planabweichungen, Testfehler oder Nacharbeiten sind passiert?
- Welche Dinge musste der Nutzer aktiv vermitteln, wiederholt korrigieren oder dem Agenten erneut erklären?
- Waren diese Nutzerkorrekturen fachlich-inhaltlich unvermeidbar oder hätten bessere Regeln, Pflichtlektüre, Templates oder Skill-Schritte geholfen?
- Welche Validierungen wurden vergessen, falsch geplant, zu spät ausgeführt oder nicht sauber dokumentiert?
- Welche bestehenden Regeln waren unklar, widersprüchlich, zu allgemein oder fehlten?
- Welche Skill-Schritte haben das Problem nicht verhindert?
- Welche Agent-Fehler sind wahrscheinlich wiederholbar und deshalb regelwürdig?

Ignoriere:

- reine Fachentscheidungen, die nur der Nutzer treffen konnte
- einmalige Tippfehler ohne strukturelle Ursache
- projektspezifische Inhalte, die nicht in allgemeine Starter-Kit-Regeln gehören
- Regeln, die eine bestehende klare Regel nur umformulieren

## Phase 3: Zielort Bestimmen

Ordne jeden sinnvollen Lernpunkt genau einem primären Zielort zu:

| Zielort | Verwenden für |
|---|---|
| `KILO_INSTRUCTIONS.md` | dauerhafte Coding-, Stack-, Testing-, Architektur- oder Anti-Pattern-Regeln |
| `AGENTS.md` | projektspezifischer Kontext, Rollen, Scope, Datenmodell, Teamangaben |
| `CLAUDE.md` | sehr knappe tool-spezifische Weiterleitung oder Claude-spezifische Hinweise |
| `.agents/skills/prime/SKILL.md` | Session-Start liest falschen oder zu wenig Kontext |
| `.agents/skills/plan-feature/SKILL.md` | Pläne enthalten zu wenig Kontext, falsche Tasks oder schwache Validierung |
| `.agents/skills/execute/SKILL.md` | Umsetzung überspringt Checks, verletzt Statuslogik oder weicht vom Plan ab |
| `.agents/skills/document/SKILL.md` | Abschlussdokumentation erfasst wichtige Feature-Ergebnisse nicht |
| `.agents/skills/create-rules/SKILL.md` | künftige Instruction-Refreshes würden den neuen Regeltyp wieder verlieren |
| `docs/starter-kit-usage/PIV-WORKFLOW.md` | Nutzer müssen den Workflow-Schritt oder Zweck verstehen |
| keine Änderung | Einzelfall, fachliche Entscheidung oder bereits ausreichend geregelt |

## Phase 4: Vorschläge Ausgeben

Gib vor Änderungen eine kompakte Tabelle aus:

| Beobachtung | Ursache | Vorschlag | Zielort | Nutzen | Sicherheit |
|---|---|---|---|---|---|

Sicherheit:

- `hoch`: klar wiederholbarer Regelmangel
- `mittel`: plausibler Regelmangel, aber nicht sicher wiederholbar
- `niedrig`: eher Einzelfall oder nur mit Nutzerbestätigung sinnvoll

Empfiehl nur Änderungen mit `hoch` oder begründetem `mittel`. Frage danach nach Bestätigung.

## Phase 5: Änderungen Umsetzen

Nach menschlicher Bestätigung:

1. Lies jede Zieldatei direkt vor dem Patch erneut.
2. Ändere nur bestätigte Zielorte.
3. Halte Änderungen kurz und konkret.
4. Vermeide überbreite Regeln, die spätere Features unnötig einschränken.
5. Ergänze bei Skill-Listen den neuen Skill nur, wenn er fehlt.
6. Prüfe nach Änderungen mit `git diff --check`.

## Phase 6: Abschluss

Gib aus:

- welche Vorschläge umgesetzt wurden
- welche Vorschläge verworfen oder zurückgestellt wurden
- welche Dateien geändert wurden
- ob `git diff --check` erfolgreich war
- Hinweis auf den nächsten Workflow `/commit`
- Hinweis für den Nutzer:

```text
Bitte informiere deinen Dozierenden über die vorgenommenen Regelvorschläge und Änderungen, damit auch das Starter-Kit-Repo mit der Zeit besser wird.
```

Wenn keine Änderung nötig war, gib trotzdem den Dozierenden-Hinweis aus, falls relevante Beobachtungen für das Starter-Kit entstanden sind.
