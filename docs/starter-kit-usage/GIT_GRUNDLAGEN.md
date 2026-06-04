# Git und GitHub – Grundlagen für das Starter-Kit-Projekt

Dieses Dokument erklärt die Git-Grundlagen, die ihr für die Arbeit mit dem Starter Kit braucht. Es richtet sich an Personen, die Git noch nicht oder kaum kennen.

Für die Arbeit in einer Gruppe – also wenn mehrere Personen im selben Repository arbeiten – gelten zusätzliche Regeln. Diese sind in [`COLLABORATION.md`](COLLABORATION.md) beschrieben und werden hier nicht wiederholt.

---

## 1. Was ist Git und wozu brauchen wir es?

**Git** ist ein Versionskontrollsystem: Es speichert die Geschichte eurer Änderungen als eine Abfolge von Snapshots, sogenannte Commits. Damit kann jederzeit nachvollzogen werden, was wann geändert wurde.

**GitHub** ist die Plattform, auf der euer Repository online liegt. Git ist das Werkzeug auf eurem Computer; GitHub der gemeinsame Ablageort in der Cloud.

Für euer Starter-Kit-Projekt ist Git aus zwei Gründen wichtig:

- Der PIV-Workflow (Plan → Implement → Validate) baut auf regelmässigen Commits auf. Jeder abgeschlossene Planschritt, jede validierte Phase und jeder Feature-Abschluss wird als Commit festgehalten.
- Der `/commit`-Skill führt alle Git-Befehle automatisch aus. Ihr müsst diese nicht selbst eintippen.

---

## 2. Repository: Der Projektordner mit Geschichte

Ein **Repository** (kurz: Repo) ist euer Projektordner – aber nicht nur der aktuelle Inhalt, sondern auch die komplette Änderungshistorie. Das Repository existiert an zwei Orten gleichzeitig:

| Ort | Was es ist |
|---|---|
| **Lokal** | Der Ordner auf eurem Computer, in dem ihr direkt arbeitet |
| **Remote (GitHub)** | Die Online-Kopie auf `github.com`, zugänglich für alle Beteiligten |

Beide Kopien sind synchronisiert, solange ihr regelmässig committed und pushed.

---

## 3. Euer Repository einrichten und klonen

### Schritt 1: Eigenes Repository aus dem Starter Kit erstellen

Das Starter Kit ist ein GitHub-Template. Ihr erstellt daraus euer eigenes Repository, indem ihr auf GitHub auf **„Use this template"** klickt und dann **„Create a new repository"** wählt.

Dabei wichtig: Setzt das Repository auf **Private** (nicht Public). Euer Code und eure Projektdokumentation enthalten typischerweise Details zum digitalisierten Prozess und zum beauftragenden Unternehmen – diese sollen nicht öffentlich einsehbar sein.

### Schritt 2: Teammitglieder einladen

Da euer Repository privat ist, haben andere Personen standardmässig keinen Zugriff – auch Teammitglieder nicht. Um sie einzuladen:

1. Öffnet euer Repository auf GitHub
2. Geht zu **Settings → Collaborators and teams → Add people**
3. Gebt den GitHub-Benutzernamen oder die E-Mail-Adresse der einzuladenden Person ein
4. Wählt die Rolle **Write** (damit die Person Commits pushen kann)
5. Die eingeladene Person erhält eine E-Mail und muss die Einladung akzeptieren

Wiederholt das für alle Gruppenmitglieder.

### Schritt 3: Repository in VS Code klonen

Öffnet VS Code und klont das Repository über die Befehlspalette:

1. Drückt `Ctrl+Shift+P` (Windows/Linux) oder `Cmd+Shift+P` (Mac)
2. Gebt `Git: Clone` ein und bestätigt
3. Fügt die GitHub-URL eures Repositories ein
4. Wählt einen lokalen Ordner auf eurem Computer
5. VS Code öffnet das geklonte Projekt automatisch

---

## 4. Commit: Ein Snapshot eurer Arbeit

Ein **Commit** ist ein Snapshot des aktuellen Projektstands. Er enthält:

- die geänderten Dateien
- eine Nachricht, die beschreibt, was geändert wurde und warum
- einen Zeitstempel und Autor

**Wann committen im PIV-Workflow?**

| Zeitpunkt | Beispiel |
|---|---|
| Nach dem initialen PRD-Entwurf `v001` | PRD erstellt, noch vor dem Review |
| Nach Review-Integration und Bestätigung einer neuen PRD-Version | PRD `v002` plus Review-/Integrationsdateien |
| Nach dem initialen Feature-Plan | `plan-v001.md` erstellt |
| Nach validiertem Task oder kohärenter Phase | Zwischencommit während `/execute` |
| Nach `/document` | Finaler Feature-Abschluss |

Ihr müsst keine Git-Befehle dafür eintippen. Der `/commit`-Skill schlägt eine Commit-Message vor, zeigt euch die betroffenen Dateien und wartet auf eure Bestätigung – erst dann committed und pushed er.

---

## 5. Push: Commits zu GitHub hochladen

Ein Commit liegt zunächst nur lokal auf eurem Computer. Mit einem **Push** ladet ihr ihn auf GitHub hoch, wo er für alle Beteiligten zugänglich wird.

Der `/commit`-Skill pushed automatisch nach jedem Commit. Ihr müsst `git push` nicht manuell ausführen.

---

## 6. Was wird nicht committet?

Nicht alles im Projektordner gehört ins Repository. Die Datei `.gitignore` legt fest, welche Dateien Git ignoriert:

| Datei / Ordner | Warum nicht im Repo |
|---|---|
| `.env` | Enthält Secrets (API-Keys, Auth-Tokens) – darf niemals öffentlich sichtbar sein |
| `node_modules/` | Sehr gross; wird mit `npm install` jederzeit neu generiert |
| `dev.db` | Die lokale SQLite-Datenbank mit euren Testdaten; nicht geteilt |
| `src/generated/prisma/` | Auto-generiert durch `npx prisma generate` |

> `.env` ist besonders kritisch: Committet niemals eure API-Keys. Wenn ihr das Repo auf einem neuen Computer klont, müsst ihr `.env` manuell anlegen und alle Werte neu eintragen.

---

## 7. Branch: Parallele Entwicklungslinien

Ein **Branch** ist eine parallele Entwicklungslinie innerhalb desselben Repositories. Der Hauptbranch heisst üblicherweise `main` und enthält den stabilen, geteilten Code.

Für Einzelpersonen reicht es, immer auf `main` zu arbeiten. Bei Gruppenarbeit werden Feature-Branches genutzt, damit mehrere Personen unabhängig voneinander entwickeln können, ohne sich gegenseitig zu blockieren. Die genauen Regeln dazu stehen in [`COLLABORATION.md`](COLLABORATION.md).

---

## 8. Git-History als Kontext für die KI

Die Commit-History ist nicht nur für euch als Menschen nützlich – sie ist auch aktiver Arbeitskontext für den AI-Agenten. Zum Beispiel liest der `/prime`-Skill beim Session-Start automatisch die letzten Commits mit `git log` und den aktuellen Branch- und Arbeitsbaumstatus mit `git status`.

Das bedeutet:

- Die KI weiss dadurch, was zuletzt implementiert, validiert und dokumentiert wurde – ohne dass ihr das explizit erklären müsst.
- Gut formulierte Commit-Messages (die der `/commit`-Skill für euch erstellt) helfen der KI, den Projektzustand präzise einzuschätzen.
- Wenn die KI berichtet, auf welchem Stand das Projekt ist, basiert das zu einem grossen Teil auf dieser automatisch eingelesenen Git-History.

Ihr müsst dafür nichts selbst tun – der `/prime`- und der `/commit`-Skill kümmern sich darum.

---

## 9. Team-Arbeit

Wenn ihr zu mehreren im selben Repository arbeitet, gibt es zusätzliche Regeln für das gemeinsame PRD, die Feature-Aufteilung, Branches, Synchronisation und das Prisma-Schema. All das ist in [`COLLABORATION.md`](COLLABORATION.md) beschrieben.
