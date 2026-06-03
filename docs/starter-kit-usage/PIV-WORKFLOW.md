# PIV-Workflow – Mit Agent Skills Features bauen

Diese Anleitung zeigt dir, wie du mit AI-Agenten strukturiert neue Features im Starter Kit planst, umsetzt und validierst.

## 1. Was ist der PIV-Ansatz?

PIV steht für Plan → Implement → Validate. Du lässt den Agenten nicht direkt Code schreiben, sondern zuerst einen konkreten Plan erstellen, den du prüfst und bestätigst. Danach setzt der Agent den Plan Task für Task um. Validierung bedeutet nicht nur "die App startet", sondern auch Tests, manuelle Prüfung, Rollenverhalten und dokumentierte Akzeptanzkriterien.

Inspiration für diesen Workflow waren unter anderem diese Videos:

- [The True Power of AI Coding - Build Your OWN Workflows (Full Guide)](https://www.youtube.com/watch?v=mHBk8Z7Exag)
- [The 5 Techniques Separating Top Agentic Engineers Right Now](https://www.youtube.com/watch?v=ttdWPDmBN_4)

## 2. Die Skills im Überblick

Im CAS Prozessdigitalisierung gibt es typischerweise zuerst eine Gesamtarchitektur als Markdown-Datei. Diese Gesamtarchitektur beschreibt den End-to-End-Prozess und alle beteiligten IT-Systeme oder Komponenten. Dieses Starter Kit wird danach für genau ein solches IT-System oder eine Komponente verwendet. Das PRD in diesem Repo beschreibt deshalb nicht den ganzen Prozess, sondern das konkrete IT-System, das neu gebaut oder als Mock eines bestehenden Systems umgesetzt wird.

Die Gesamtarchitektur ist für `create-prd` hilfreich, aber nicht verpflichtend. Wenn ihr eine Gesamtarchitektur verwendet, gebt neben dem Markdown-Dokument immer auch die zugehörige `architecture.dsl` mit, falls sie existiert. Die DSL-Datei ist die maschinenlesbare Quelle für Architekturdiagramm-Informationen; SVG- oder PNG-Exporte werden nicht inhaltlich analysiert.

Datenschutz: Gesamtarchitekturen können Unternehmensnamen, interne Systeme, Personenrollen oder vertrauliche Prozessdetails enthalten. Anonymisiert die Unterlagen vor dem Einfügen oder Hochladen, wenn daraus ein reales Unternehmen, reale Personen oder sensible Informationen erkennbar sind.

Wenn mehrere Personen im selben Repository an einem gemeinsamen IT-System arbeiten, gilt weiterhin dieser PIV-Ablauf. Beachtet zusätzlich die Koordinationsregeln in [`COLLABORATION.md`](COLLABORATION.md), insbesondere zu gemeinsamem PRD, Feature-Aufteilung, `TASKS.md`, Branches und `prisma/schema.prisma`.

| Skill | Wann nutzen? | Typische Eingabe |
|---|---|---|
| `prime` | Zu Beginn einer Session, um Projektkontext zu laden | `/prime` |
| `create-prd` | Am Anfang eines Starter-Kit-Projekts, um das konkrete IT-System, seine Ausbaustufen und dessen MVP-Scope zu beschreiben | `/create-prd docs/project/prds/antragssystem.md` plus Gesamtarchitektur-Markdown und `architecture.dsl`, falls vorhanden. Der Skill speichert das initiale PRD als `v001`, z.B. `antragssystem-v001.md`. |
| `adapt-to-project` | Einmalig nach PRD-Bestätigung, vor dem ersten `plan-feature`: bereinigt Demo-Code auf Basis des PRDs und validiert den Build | `/adapt-to-project docs/project/prds/antragssystem-v001.md` |
| `plan-feature` | Für ein einzelnes Feature aus dem PRD, bevor Code geschrieben wird | `/plan-feature "PRD Kapitel Antrag einreichen"` |
| `execute` | Wenn ein Feature-Plan geprüft und bestätigt wurde | `/execute docs/project/features/antrag-formular/plan.md` |
| `document` | Nach Umsetzung und Validierung, um Feature-Dokumentation zu erstellen | `/document docs/project/features/antrag-formular/plan.md` |
| `reflect-rules` | Nach `/document` bei Verdacht auf wiederholbare Agent-Fehler, Nacharbeiten, Planlücken oder wiederholte Nutzerkorrekturen | `/reflect-rules docs/project/features/antrag-formular/plan.md` |
| `commit` | Nach bestätigtem PRD, erfolgreicher Starter-Kit-Bereinigung, bestätigtem Feature-Plan, validiertem Task, kohärenter Phase oder finalem Feature-Abschluss | `/commit` |
| `create-rules` | Wenn Projekt-Instructions aktualisiert werden sollen | `/create-rules` |
| `init-project` | Bei einem frisch geklonten Starter-Kit-Projekt | `/init-project` |

![PIV-Workflow Übersicht](PIV-Workflow_UEBERSICHT.png)
*Erstellt mit OpenAI gpt-image-2, Thinking Mode (ChatGPT GPT-5.5)*

## 3. Wie starte ich einen Skill in meinem Tool?

| Tool | Wie Skill aufrufen |
|---|---|
| Kilo Code | Einmal `npm run setup:skills` ausführen, dann `/prime`, `/create-prd`, `/plan-feature`, `/execute` usw. im Chat verwenden. |
| Codex Extension in VS Code | Einmal `npm run setup:skills` ausführen, dann Skills per Slash Command im Chat verwenden. |
| Claude Extension in VS Code | Einmal `npm run setup:skills` ausführen, dann Skills per Slash Command im Chat verwenden. |
| Antigravity | Einmal `npm run setup:skills` ausführen, dann Skills per Slash Command im Agent-Panel verwenden. |

## 4. Typischer Ablauf für ein IT-System

Beispiel: Eure Gesamtarchitektur beschreibt einen Antragsprozess mit mehreren beteiligten IT-Systemen. In diesem Starter-Kit-Projekt baust oder mockst du eines dieser Systeme, zum Beispiel ein Antragssystem. Dafür erstellst du zuerst ein PRD für genau dieses IT-System. Danach planst und implementierst du einzelne Features aus diesem PRD Schritt für Schritt.

Falls keine Gesamtarchitektur vorhanden ist, funktioniert `create-prd` trotzdem. Der Skill fragt dann Rollen, Umsysteme, Schnittstellen, Scope und Ausbaustufen direkt im Dialog ab.

Im CAS-Kontext ist das Starter-Kit-Projekt Brownfield: Der technische Stack ist bereits durch das Starter Kit und die Projektregeln vorgegeben. Das PRD soll deshalb keine neuen Stack-Entscheide erfinden, sondern auf vorhandene Vorgaben wie `AGENTS.md`, `KILO_INSTRUCTIONS.md`, `package.json`, Prisma-Schema und bestehende Starter-Kit-Konventionen referenzieren. Wenn euer konkretes System keine Benutzeroberfläche, keine E-Mail-Funktion oder andere vorhandene Starter-Kit-Bausteine benötigt, ist das im Prototyp akzeptabel. Solche Bausteine müssen nicht gelöscht werden, solange sie nicht stören.

Wichtig: Der Feature-Zyklus wird mehrfach durchlaufen. Für jedes neue Feature startest du bewusst eine neue Agent- oder Chat-Session, lädst mit `/prime` den aktuellen Kontext neu und planst dann genau ein Feature aus dem PRD. Dadurch arbeitet der Agent mit frischem Kontext und vermischt nicht alte Umsetzungsdetails mit dem nächsten Feature.

Der Grund dafür ist sogenannter Context Rod. Je länger ein Chat wird, desto mehr alte Zwischenentscheidungen, Fehlversuche, verworfene Ideen und irrelevante Details bleiben im Kontext. Der Agent kann dadurch schlechter priorisieren oder alte Informationen fälschlicherweise auf das nächste Feature übertragen. Eine neue Session wirkt wie ein sauberer Neustart: Der Agent liest mit `/prime` wieder die aktuellen Projektdateien, das bestätigte PRD und den aktuellen Stand, statt sich auf einen überladenen Chatverlauf zu verlassen.

### Schritt 1: Kontext laden

```text
/prime
```

Der Agent liest Projektregeln, `AGENTS.md`, `TASKS.md`, `package.json`, Prisma-Schema und wichtige Dateien. Danach bekommst du eine kurze Übersicht über den aktuellen Stand.

### Schritt 2: PRD erstellen

```text
/create-prd docs/project/prds/antragssystem.md
```

Der Skill speichert das initiale PRD als Dokumentversion `v001`. Wenn du keinen Versionssuffix angibst, ergänzt der Skill ihn automatisch, z.B. `docs/project/prds/antragssystem-v001.md`.

Falls du bereits mit einer älteren Skill-Version ein PRD ohne Versionssuffix erstellt hast, gilt dieses bestehende PRD logisch als `v001`. Verwende dann zunächst den vorhandenen Dateipfad weiter; spätere Review- oder Update-Workflows referenzieren es als Version `v001`.

Der Skill fragt zuerst, ob eine Gesamtarchitektur vorliegt. Wenn ja, gib die Gesamtarchitektur-Markdown-Datei und, falls vorhanden, die zugehörige `architecture.dsl` als Kontext mit. SVG- oder PNG-Exporte des Architekturdiagramms dienen höchstens als visuelle Referenz und werden nicht inhaltlich analysiert.

Prüfe vor dem Teilen der Architekturunterlagen, ob sie anonymisiert werden müssen. Entferne oder ersetze Unternehmensnamen, reale Personennamen, interne Systemnamen oder vertrauliche Prozessdetails, wenn diese nicht in den Agent-Dialog gehören.

Das PRD beschreibt das konkrete IT-System oder die Komponente in diesem Repo: Zielgruppen, Scope, Rollen, Datenmodell, wichtigste User Stories, Schnittstellen zu anderen Systemen und MVP-Grenzen. Zusätzlich hält es mögliche Ausbaustufen fest: MVP / Minimalversion, Medium-Version und Extended-/Luxus-Version. Es ist noch kein Implementierungsplan für einzelne Dateien, sondern die fachliche Grundlage für mehrere spätere Features.

Die Ausbaustufen helfen, Unsicherheit über den Projektumfang sichtbar zu machen. Die KI entscheidet nicht, ob der Umfang für ein Kursprojekt zu gross oder zu klein ist. Diese Einschätzung bleibt Aufgabe der Studierenden und sollte bei Bedarf mit dem Dozenten validiert werden.

Prüfe das PRD sorgfältig:

- Falls vorhanden: Passt das PRD zur Gesamtarchitektur und wurde die `architecture.dsl` berücksichtigt?
- Ist klar, welches IT-System hier gebaut oder gemockt wird?
- Sind Rollen und Berechtigungen korrekt beschrieben?
- Ist klar, was in MVP / Minimalversion, Medium-Version, Extended-/Luxus-Version und Out of Scope gehört?
- Sind die wichtigsten Features und User Stories enthalten?
- Verweisen User Stories und Demo-Szenarien nachvollziehbar aufeinander?
- Referenziert das PRD im Brownfield-/Starter-Kit-Kontext die bestehenden technischen Vorgaben statt neue Stack-Entscheide zu erfinden?
- Sind Architekturunterlagen anonymisiert, falls sie vertrauliche Informationen enthalten?
- Enthält das PRD den Abschnitt "Starter Kit Nutzung" mit ausgefüllter Bausteine-Tabelle und Liste irrelevanter Demo-Inhalte?

Bestätige das PRD erst, wenn es als Grundlage für die Feature-Planung taugt.

Nach der fachlichen Bestätigung des PRDs sollst du den Stand committen. Nutze dafür entweder:

```text
/commit
```

Oder erstelle den Commit in VS Code Source Control. Dort kannst du dir bei Bedarf eine Commit Message vorschlagen lassen.

### Schritt 3: Starter Kit bereinigen

```text
/adapt-to-project docs/project/prds/antragssystem-v001.md
```

Dieser Schritt läuft **einmalig**, direkt nach PRD-Bestätigung und noch in derselben oder einer neuen Session – jedenfalls bevor die erste Feature-Session gestartet wird.

Der Skill liest den Abschnitt "Starter Kit Nutzung" aus dem bestätigten PRD, schlägt vor, welche Demo-Seiten durch Platzhalter ersetzt und welche Demo-Prisma-Modelle entfernt werden, und führt die Bereinigung nach deiner Bestätigung durch. Am Ende validiert er den Build automatisch: `npm run build` muss grün sein, bevor der Skill abschliesst.

Nach der Bereinigung: Starte kurz `npm run dev` und prüfe, ob die App noch läuft.

Wenn Bereinigung und Prüfung erfolgreich sind, erstelle auch für diesen abgeschlossenen Bereinigungsschritt einen Commit. So bleibt der PRD-Stand getrennt von der technischen Starter-Kit-Anpassung nachvollziehbar.

> **Du hast bereits ein PRD ohne den Abschnitt "Starter Kit Nutzung"?**
> Führe zuerst diesen Prompt in einem normalen Chat aus, bevor du `/adapt-to-project` aufrufst:
>
> ```
> Lies mein bestehendes PRD in docs/project/prds/[name]-v001.md vollständig.
> Falls mein PRD noch keinen Versionssuffix hat, verwende stattdessen den
> vorhandenen Pfad docs/project/prds/[name].md und behandle es logisch als v001.
> Ergänze einen Abschnitt "Starter Kit Nutzung" mit einer Tabelle der genutzten
> Starter-Kit-Bausteine (Auth, DB, UI, E-Mail, LLM, REST API, File Upload) und
> einer Liste der Demo-Inhalte, die für dieses Projekt nicht relevant sind. Orientiere Dich am Kapitel "Starter Kit Nutzung" in .agents/skills/create-prd/references/prd-template.md.
> Speichere das aktualisierte PRD.
> ```
>
> Prüfe das Ergebnis kurz und bestätige, dass die Liste korrekt ist.

### Schritt 4: Neue Session für das erste Feature starten

Beende nach dem bestätigten PRD und der Bereinigung die Session oder starte mindestens einen neuen Chat. Öffne eine neue Agent-Session für das erste konkrete Feature und lade den Kontext erneut:

```text
/prime
```

### Schritt 5: Einzelnes Feature aus dem PRD planen

```text
/plan-feature "Aus docs/project/prds/antragssystem-v001.md das Feature Antrag-Formular mit Statusänderung planen"
```

Der Agent recherchiert im PRD und im Repo, stellt gezielte Rückfragen und erstellt danach:

- `docs/project/features/antrag-formular/plan.md`
- einen Eintrag in `TASKS.md`

### Schritt 6: Feature-Plan prüfen

Lies den Plan. Achte besonders auf:

- Scope und Non-Scope
- Etappe: MVP / Minimalversion, Medium-Version oder Extended-/Luxus-Version
- betroffene Dateien
- Rollen und Berechtigungen
- Tasks und Akzeptanzkriterien
- Validierungsschritte

Bestätige den Feature-Plan erst, wenn er fachlich und technisch zum PRD passt.

Nach der Bestätigung des Feature-Plans sollst du die Plan-Datei und den aktualisierten Eintrag in `TASKS.md` committen. Dadurch startet `/execute` später von einem klar bestätigten Planstand. Nutze dafür `/commit` oder VS Code Source Control mit vorgeschlagener Commit Message.

### Schritt 7: Neue Session für die Umsetzung starten

Nach dem bestätigten Feature-Plan startest du bewusst eine neue Session. So beginnt `/execute` mit frischem Kontext – ohne die Planungsgeschichte, Rückfragen und Zwischenentscheide aus der Planungs-Session.

```text
/prime
```

Der Agent liest erneut Projektregeln, aktuellen Stand und den soeben bestätigten Feature-Plan in `docs/project/features/[feature-name]/plan.md`.

### Schritt 8: Feature-Plan ausführen

```text
/execute docs/project/features/antrag-formular/plan.md
```

Der Agent arbeitet Task für Task. Nach jedem Task stoppt er, zeigt das Ergebnis und wartet auf Bestätigung. Der Status wird direkt in der Plan-Datei aktualisiert.

### Schritt 9: Validieren

Nach jedem Task prüfst du oder der Agent:

```bash
npm run test
```

Für UI- oder Laufzeitverhalten startest du zusätzlich:

```bash
npm run dev
```

Prüfe im Browser, ob das Feature für die vorgesehenen Rollen funktioniert. Bei grösseren Änderungen wird zusätzlich `npm run build` verwendet. E2E-Tests laufen mit `npm run test:e2e`, wenn der Plan es verlangt oder du es ausdrücklich willst.

### Schritt 10: Optionalen Zwischencommit erstellen

Wenn ein Task oder eine kohärente Phase validiert ist, darfst du einen Zwischencommit erstellen:

```text
/commit
```

Der Agent prüft die Änderungen, schlägt eine Conventional-Commit-Message vor und committed erst nach deiner Bestätigung. Ein Zwischencommit soll nur einen logisch zusammengehörenden, geprüften Stand enthalten. Committe keine bekannten roten Tests, keine undokumentierten Planabweichungen und keine fremden parallelen Änderungen.

Zwischencommits sind besonders sinnvoll bei längeren Features, Schema-Änderungen, abgeschlossenen UI-/Backend-Phasen oder bevor du den Branch mit anderen teilst. Sie ersetzen aber nicht den Feature-Abschluss: Erst wenn alle Tasks `done` sind, die Validierung dokumentiert ist, `/document` gelaufen ist und ein allfälliger `/reflect-rules`-Bedarf geprüft wurde, gilt das Feature als fertig.

Alternativ zu `/commit` kannst du auch in VS Code Source Control committen und dir dort eine Commit Message vorschlagen lassen. Wichtig ist nicht das Tool, sondern dass der Commit klein, nachvollziehbar und validiert ist.

### Schritt 11: Feature dokumentieren

Wenn alle Tasks `done` sind und die Validierung vollständig dokumentiert ist:

```text
/document docs/project/features/antrag-formular/plan.md
```

`/document` erstellt `user-guide.md` und `developer-notes.md` im Feature-Ordner. Am Ende weist der Skill darauf hin, dass `/reflect-rules` bei Verdacht auf regelbezogene Probleme direkt in derselben Session genutzt werden soll.

### Schritt 12: Agent-Regeln reflektieren und final committen

Nach `/document` prüfst du, ob aus der Umsetzung dauerhafte Regel- oder Skill-Verbesserungen entstehen sollen. Nutze `/reflect-rules` vor allem dann, wenn es während Umsetzung oder Dokumentation auffällig viele Korrekturen, Nacharbeiten, Planabweichungen oder regelbezogene Missverständnisse gab:

```text
/reflect-rules docs/project/features/antrag-formular/plan.md
/commit
```

`/reflect-rules` betrachtet nicht nur technische Fehler, Planabweichungen und Nacharbeiten. Der Skill prüft auch, ob der Nutzer wiederholt Dinge aktiv vermitteln oder korrigieren musste, die durch bessere Projektregeln, Pflichtlektüre, Plan-Templates oder Skill-Schritte hätten klar sein sollen.

Führe `/reflect-rules` möglichst direkt in derselben Session nach `/document` aus, weil der Chatverlauf die wichtigste Quelle für Nutzerkorrekturen und Agent-Nacharbeiten ist. Der Skill arbeitet zuerst mit einer sparsamen Triage, kann bei vertiefter Analyse aber zusätzliche Input-Tokens brauchen.

Mögliche Zielorte für bestätigte Anpassungen sind zum Beispiel `KILO_INSTRUCTIONS.md`, `AGENTS.md`, `CLAUDE.md`, `.agents/skills/prime/SKILL.md`, `.agents/skills/plan-feature/SKILL.md`, `.agents/skills/execute/SKILL.md`, `.agents/skills/document/SKILL.md` oder `docs/starter-kit-usage/PIV-WORKFLOW.md`.

Der Skill schlägt Änderungen zuerst vor und setzt sie erst nach Bestätigung um. Informiere deinen Dozierenden über vorgenommene Regelvorschläge und Änderungen, damit auch das Starter-Kit-Repo mit der Zeit besser wird.

Der anschliessende finale Commit enthält typischerweise die Feature-Dokumentation, Plan-Nachführung, bestätigte Regelanpassungen und letzte Cleanup-Änderungen. Du kannst dafür `/commit` nutzen oder den Commit in VS Code Source Control mit vorgeschlagener Commit Message erstellen.

### Schritt 13: Für das nächste Feature neu starten

Für jedes weitere Feature aus dem PRD startest du zweimal eine neue Session – einmal für die Planung, einmal für die Umsetzung:

**Session A – Planung:**
```text
/prime
/plan-feature "Aus docs/project/prds/antragssystem-v001.md das nächste Feature <Name> planen"
```
Plan prüfen und bestätigen. Danach Session beenden.

**Session B – Umsetzung:**
```text
/prime
/execute docs/project/features/<feature-name>/plan.md
```
Pro Task validieren, bei Bedarf Zwischencommits erstellen, am Ende `/document`, bei Verdacht `/reflect-rules` in derselben Session, dann `/commit`.

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

Du siehst den detaillierten Status in `docs/project/features/[feature-name]/plan.md`. Im Root-`TASKS.md` steht nur der grobe Feature-Status als Index.

## 6. Was tue ich, wenn der Agent vom Plan abweicht?

Stoppe die Umsetzung sofort, wenn der Agent fachlich oder technisch vom bestätigten Plan abweicht.

Konkretes Vorgehen:

1. Schreibe dem Agenten: `Stopp. Lies den Plan erneut und erkläre die Abweichung.`
2. Verlange einen Vorschlag, wie `docs/project/features/[feature-name]/plan.md` angepasst werden müsste.
3. Genehmige Planänderungen erst, wenn du sie verstanden hast.
4. Starte `/execute` erst wieder, wenn der Plan aktualisiert oder die ursprüngliche Umsetzung bestätigt ist.

Ein neuer Chat-Kontext ist sinnvoll, wenn:

- der Agent wiederholt vergisst, was im Plan steht
- viele Fehlversuche passiert sind
- du den Plan fachlich stark geändert hast
- die Unterhaltung zu lang und unübersichtlich geworden ist

Das wichtigste PIV-Prinzip bleibt: Die Implement-Phase beginnt immer mit einem bestätigten Plan. Wenn sich während der Umsetzung neue Erkenntnisse ergeben, wird zuerst der Plan aktualisiert und bestätigt, bevor weiter implementiert wird.
