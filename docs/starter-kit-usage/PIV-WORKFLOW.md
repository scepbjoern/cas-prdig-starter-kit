# PIV-Workflow – Mit Agent Skills Features bauen

Diese Anleitung zeigt dir, wie du mit AI-Agenten strukturiert neue Features im Starter Kit planst, umsetzt und validierst.

## 1. Was ist der PIV-Ansatz?

PIV steht für Plan → Implement → Validate. Du lässt den Agenten nicht direkt Code schreiben, sondern zuerst einen konkreten Plan erstellen, den du prüfst und bestätigst. Danach setzt der Agent den Plan Task für Task um. Validierung bedeutet nicht nur "die App startet", sondern auch Tests, manuelle Prüfung, Rollenverhalten und dokumentierte Akzeptanzkriterien.

Inspiration für diesen Workflow waren unter anderem diese Videos:

- [The True Power of AI Coding - Build Your OWN Workflows (Full Guide)](https://www.youtube.com/watch?v=mHBk8Z7Exag)
- [The 5 Techniques Separating Top Agentic Engineers Right Now](https://www.youtube.com/watch?v=ttdWPDmBN_4)

## 2. Die Skills im Überblick

Im CAS Prozessdigitalisierung gibt es typischerweise zuerst eine Gesamtarchitektur als Markdown-Datei. Diese Gesamtarchitektur beschreibt den End-to-End-Prozess und alle beteiligten IT-Systeme oder Komponenten. Dieses Starter Kit wird danach für genau ein solches IT-System oder eine Komponente verwendet. Das PRD in diesem Repo beschreibt deshalb nicht den ganzen Prozess, sondern das konkrete IT-System, das neu gebaut oder als Mock eines bestehenden Systems umgesetzt wird.

| Skill | Wann nutzen? | Typische Eingabe |
|---|---|---|
| `prime` | Zu Beginn einer Session, um Projektkontext zu laden | `/prime` |
| `create-prd` | Am Anfang eines Starter-Kit-Projekts, um das konkrete IT-System und dessen MVP-Scope zu beschreiben | `/create-prd docs/prd-antragssystem.md` |
| `plan-feature` | Für ein einzelnes Feature aus dem PRD, bevor Code geschrieben wird | `/plan-feature "PRD Kapitel Antrag einreichen"` |
| `execute` | Wenn ein Feature-Plan geprüft und bestätigt wurde | `/execute docs/plan-antrag-formular.md` |
| `document` | Nach Umsetzung, um Dokumentation vorzubereiten | `/document docs/plan-antrag-formular.md` |
| `commit` | Wenn validierte Änderungen committed werden sollen | `/commit` |
| `create-rules` | Wenn Projekt-Instructions aktualisiert werden sollen | `/create-rules` |
| `init-project` | Bei einem frisch geklonten Starter-Kit-Projekt | `/init-project` |

```text
Einmal pro Starter-Kit-Projekt / IT-System:

  Neue Agent-Session starten
          |
          v
       /prime
          |
          v
     /create-prd  --> docs/prd-[system].md
          |
          v
     Mensch prüft und bestätigt PRD


Danach pro Feature aus dem PRD wiederholen:

  Neue Agent-Session starten
          |
          v
       /prime
          |
          v
     /plan-feature  --> ein Feature aus PRD auswählen
          |              --> docs/plan-[feature-name].md
          |              --> TASKS.md Eintrag
          v
     Mensch prüft und bestätigt Feature-Plan
          |
          v
       /execute  --> Task 1 --> Validierung --> Stopp --> Bestätigung
          |             |
          |             v
          |          Task 2 --> Validierung --> Stopp --> Bestätigung
          v
       /document
          |
          v
       /commit
          |
          v
     Für nächstes Feature: neue Agent-Session starten
```

## 3. Wie starte ich einen Skill in meinem Tool?

| Tool | Wie Skill aufrufen |
|---|---|
| Kilo Code | Einmal `npm run setup:skills` ausführen, dann `/prime`, `/create-prd`, `/plan-feature`, `/execute` usw. im Chat verwenden. |
| Codex Extension in VS Code | Einmal `npm run setup:skills` ausführen, dann Skills per Slash Command im Chat verwenden. |
| Claude Extension in VS Code | Einmal `npm run setup:skills` ausführen, dann Skills per Slash Command im Chat verwenden. |
| Antigravity | Einmal `npm run setup:skills` ausführen, dann Skills per Slash Command im Agent-Panel verwenden. |

## 4. Typischer Ablauf für ein IT-System

Beispiel: Eure Gesamtarchitektur beschreibt einen Antragsprozess mit mehreren beteiligten IT-Systemen. In diesem Starter-Kit-Projekt baust oder mockst du eines dieser Systeme, zum Beispiel ein Antragssystem. Dafür erstellst du zuerst ein PRD für genau dieses IT-System. Danach planst und implementierst du einzelne Features aus diesem PRD Schritt für Schritt.

Wichtig: Der Feature-Zyklus wird mehrfach durchlaufen. Für jedes neue Feature startest du bewusst eine neue Agent- oder Chat-Session, lädst mit `/prime` den aktuellen Kontext neu und planst dann genau ein Feature aus dem PRD. Dadurch arbeitet der Agent mit frischem Kontext und vermischt nicht alte Umsetzungsdetails mit dem nächsten Feature.

Der Grund dafür ist sogenannter Context Rod. Je länger ein Chat wird, desto mehr alte Zwischenentscheidungen, Fehlversuche, verworfene Ideen und irrelevante Details bleiben im Kontext. Der Agent kann dadurch schlechter priorisieren oder alte Informationen fälschlicherweise auf das nächste Feature übertragen. Eine neue Session wirkt wie ein sauberer Neustart: Der Agent liest mit `/prime` wieder die aktuellen Projektdateien, das bestätigte PRD und den aktuellen Stand, statt sich auf einen überladenen Chatverlauf zu verlassen.

### Schritt 1: Kontext laden

```text
/prime
```

Der Agent liest Projektregeln, `AGENTS.md`, `TASKS.md`, `package.json`, Prisma-Schema und wichtige Dateien. Danach bekommst du eine kurze Übersicht über den aktuellen Stand.

### Schritt 2: PRD erstellen

```text
/create-prd docs/prd-antragssystem.md
```

Das PRD beschreibt das konkrete IT-System oder die Komponente in diesem Repo: Zielgruppen, Scope, Rollen, Datenmodell, wichtigste User Stories, Schnittstellen zu anderen Systemen und MVP-Grenzen. Es ist noch kein Implementierungsplan für einzelne Dateien, sondern die fachliche Grundlage für mehrere spätere Features.

Prüfe das PRD sorgfältig:

- Passt das PRD zur Gesamtarchitektur?
- Ist klar, welches IT-System hier gebaut oder gemockt wird?
- Sind Rollen und Berechtigungen korrekt beschrieben?
- Ist klar, was im MVP enthalten ist und was nicht?
- Sind die wichtigsten Features und User Stories enthalten?

Bestätige das PRD erst, wenn es als Grundlage für die Feature-Planung taugt.

### Schritt 3: Neue Session für das erste Feature starten

Beende nach dem bestätigten PRD die PRD-Session oder starte mindestens einen neuen Chat. Öffne eine neue Agent-Session für das erste konkrete Feature und lade den Kontext erneut:

```text
/prime
```

### Schritt 4: Einzelnes Feature aus dem PRD planen

```text
/plan-feature "Aus docs/prd-antragssystem.md das Feature Antrag-Formular mit Statusänderung planen"
```

Der Agent recherchiert im PRD und im Repo, stellt gezielte Rückfragen und erstellt danach:

- `docs/plan-antrag-formular.md`
- einen Eintrag in `TASKS.md`

### Schritt 5: Feature-Plan prüfen

Lies den Plan. Achte besonders auf:

- Scope und Non-Scope
- betroffene Dateien
- Rollen und Berechtigungen
- Tasks und Akzeptanzkriterien
- Validierungsschritte

Bestätige den Feature-Plan erst, wenn er fachlich und technisch zum PRD passt.

### Schritt 6: Feature-Plan ausführen

```text
/execute docs/plan-antrag-formular.md
```

Der Agent arbeitet Task für Task. Nach jedem Task stoppt er, zeigt das Ergebnis und wartet auf Bestätigung. Der Status wird direkt in der Plan-Datei aktualisiert.

### Schritt 7: Validieren

Nach jedem Task prüfst du oder der Agent:

```bash
npm run test
```

Für UI- oder Laufzeitverhalten startest du zusätzlich:

```bash
npm run dev
```

Prüfe im Browser, ob das Feature für die vorgesehenen Rollen funktioniert. Bei grösseren Änderungen wird zusätzlich `npm run build` verwendet. E2E-Tests laufen mit `npm run test:e2e`, wenn der Plan es verlangt oder du es ausdrücklich willst.

### Schritt 8: Commit erstellen

Wenn alle Tasks `done` sind:

```text
/commit
```

Der Agent prüft die Änderungen, schlägt eine Conventional-Commit-Message vor und committed erst nach deiner Bestätigung.

### Schritt 9: Für das nächste Feature neu starten

Wenn das nächste Feature aus dem PRD umgesetzt werden soll, starte wieder eine neue Agent- oder Chat-Session:

```text
/prime
/plan-feature "Aus docs/prd-antragssystem.md das nächste Feature <Name> planen"
```

Danach wiederholst du denselben Zyklus: Plan prüfen, `/execute`, validieren, `/document`, `/commit`.

## 5. Task-Status verstehen

| Status | Bedeutung |
|---|---|
| `planned` | Task ist geplant, aber noch nicht gestartet. |
| `in_progress` | Agent arbeitet gerade an diesem Task. |
| `validating` | Code ist umgesetzt, Validierung läuft oder muss dokumentiert werden. |
| `done` | Task ist abgeschlossen und validiert. |
| `needs_human` | Agent braucht eine Entscheidung von dir, bevor es weitergeht. |

Normalfall:

```text
planned -> in_progress -> validating -> done
```

Wenn etwas unklar ist:

```text
planned -> in_progress -> needs_human
```

Du siehst den detaillierten Status in `docs/plan-[feature-name].md`. Im Root-`TASKS.md` steht nur der grobe Feature-Status als Index.

## 6. Was tue ich, wenn der Agent vom Plan abweicht?

Stoppe die Umsetzung sofort, wenn der Agent fachlich oder technisch vom bestätigten Plan abweicht.

Konkretes Vorgehen:

1. Schreibe dem Agenten: `Stopp. Lies den Plan erneut und erkläre die Abweichung.`
2. Verlange einen Vorschlag, wie `docs/plan-[feature-name].md` angepasst werden müsste.
3. Genehmige Planänderungen erst, wenn du sie verstanden hast.
4. Starte `/execute` erst wieder, wenn der Plan aktualisiert oder die ursprüngliche Umsetzung bestätigt ist.

Ein neuer Chat-Kontext ist sinnvoll, wenn:

- der Agent wiederholt vergisst, was im Plan steht
- viele Fehlversuche passiert sind
- du den Plan fachlich stark geändert hast
- die Unterhaltung zu lang und unübersichtlich geworden ist

Das wichtigste PIV-Prinzip bleibt: Die Implement-Phase beginnt immer mit einem bestätigten Plan. Wenn sich während der Umsetzung neue Erkenntnisse ergeben, wird zuerst der Plan aktualisiert und bestätigt, bevor weiter implementiert wird.
