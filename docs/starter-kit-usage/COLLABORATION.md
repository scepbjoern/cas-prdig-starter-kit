# Zusammenarbeit im gemeinsamen Repository

Diese Anleitung beschreibt den Mehrpersonen-Fall im PIV-Workflow: Mehrere Personen arbeiten im selben Repository an einem gemeinsamen IT-System. Sie ergänzt `PIV-WORKFLOW.md` und erklärt nur die PIV- und Repository-Konventionen, die speziell für die Gruppenarbeit gelten.

> Git-Grundbegriffe (Repository, Commit, Push, Branch) sind in [`GIT_GRUNDLAGEN.md`](GIT_GRUNDLAGEN.md) erklärt.

## 1. Grundprinzip

Auch wenn mehrere Personen im selben Repository arbeiten, gibt es genau ein gemeinsames PRD pro IT-System oder Komponente.

Das PRD ist der gemeinsame Konsens über:

- was gebaut wird
- warum es gebaut wird
- welche Rollen, Daten, Schnittstellen und Ausbaustufen relevant sind
- was im MVP, in der Medium-Version, in der Extended-/Luxus-Version und ausserhalb des Scopes liegt

Alle beteiligten Personen bestätigen die neueste reviewte PRD-Version fachlich, bevor die Arbeit aufgeteilt wird. Es gibt keine konkurrierenden Sub-PRDs pro Person.

Wenn sich der gemeinsame fachliche Stand später ändert, wird nicht die bestehende PRD-Datei von Hand angepasst. Stattdessen erstellt `/update-prd [PRD-Pfad]` eine neue PRD-Version und eine Update-Datei. Die Gruppe bestätigt und committet diese neue Version, bevor weitere Feature-Sessions darauf aufbauen.

Die Aufteilung erfolgt erst danach auf Feature-Ebene. Jede Person übernimmt ganze Features vertikal durch den Stack, zum Beispiel UI, Server Actions, Datenmodell, Rollenprüfung und Tests für ein konkretes Feature. Eine Aufteilung nach Schichten wie "Person A nur Frontend" und "Person B nur Backend" wird vermieden, weil sie mehr Abstimmung, Blockaden und Merge-Konflikte erzeugt.

## 2. Ablauf im Mehrpersonen-Fall

Der Ablauf bleibt PIV: Plan -> Implement -> Validate.

```text
Einmal gemeinsam pro IT-System:

  /prime
    |
    v
  /create-prd  --> docs/project/prds/[system]-v001.md
    |
    v
  Commit: PRD-Erstentwurf v001
    |
    v
  Neue Reviewer-Session:
  /prime
    |
    v
  /review-prd  --> docs/project/prd-reviews/[system]-v001-r01-review.md
    |
    v
  Zurück in Autor-Session:
  /integrate-prd-review  --> docs/project/prds/[system]-v002.md
    |
    v
  Alle beteiligten Personen prüfen und bestätigen die neueste PRD-Version
    |
    v
  Commit: PRD-Version + Review-/Integrationsdateien


Danach pro Feature und Person:

  Feature aus PRD auswählen
    |
    v
  Verantwortliche Person und Branch in TASKS.md festhalten
    |
    v
  Neue Session starten
    |
    v
  /prime
    |
    v
  /plan-feature  --> docs/project/features/[feature-name]/plan-v001.md
    |
    v
  Commit: initialer Feature-Plan v001
    |
    v
  Neue Reviewer-Session:
  /prime
    |
    v
  /review-feature-plan  --> docs/project/features/[feature-name]/plan-reviews/plan-v001-r01-review.md
    |
    v
  Zurück in Autor-Session:
  /integrate-feature-plan-review  --> docs/project/features/[feature-name]/plan-v002.md
    |
    v
  Mensch prüft und bestätigt neueste Feature-Plan-Version
    |
    v
  Commit: Plan-Version + Plan-Review-/Integrationsdateien
    |
    v
  /execute
    |
    v
  validieren, optional Zwischencommits, dokumentieren, final committen
```

Wichtig: Jede Person plant und implementiert ihr Feature auf Basis der neuesten bestätigten PRD-Version und der aktuellen `TASKS.md`.

Wenn eine PRD-Aktualisierung bereits vorhandene Feature-Pläne betrifft, werden diese Pläne nicht nebenbei geändert. Dafür wird `/update-feature-plan [Plan-Pfad]` genutzt; bis der betroffene Plan aktualisiert ist, soll er nicht für `/execute` verwendet werden.

## 3. TASKS.md als Koordinationsübersicht

`TASKS.md` bleibt ein Feature-Index. Detailtasks gehören weiterhin in die neueste versionierte Plan-Datei, z.B. `docs/project/features/[feature-name]/plan-v002.md`.

Im Mehrpersonen-Fall wird `TASKS.md` zusätzlich zur Koordinationsschicht:

```markdown
## Aktive Features

| Feature | Status | Verantwortlich | Branch | Schema | Datei | Erstellt |
|---|---|---|---|---|---|---|
| Datenmodell Basis | in_progress | Lea | feature/datenmodell-basis-lea | ja | [plan](docs/project/features/datenmodell-basis/plan-v002.md) | 2026-05-30 |
| Antrag erfassen | planned | Lea | feature/antrag-erfassen-lea | geplant | [plan](docs/project/features/antrag-erfassen/plan-v001.md) | 2026-05-30 |
| Anträge prüfen | planned | Marco | feature/antraege-pruefen-marco | geplant | [plan](docs/project/features/antraege-pruefen/plan-v001.md) | 2026-05-30 |
| E-Mail-Benachrichtigung | in_progress | Marco | feature/email-benachrichtigung-marco | nein | [plan](docs/project/features/email-benachrichtigung/plan-v002.md) | 2026-05-30 |

## Abgeschlossene Features

| Feature | Verantwortlich | Branch | Schema | Datei | Abgeschlossen |
|---|---|---|---|---|---|
| Login-Rollenprüfung | Marco | feature/login-rollenpruefung-marco | nein | [plan](docs/project/features/login-rollenpruefung/plan-v002.md) | 2026-05-29 |
```

Die Spalten bedeuten:

| Spalte | Bedeutung |
|---|---|
| `Feature` | Fachlicher Feature-Name, nicht einzelne technische Tasks |
| `Status` | `planned`, `in_progress`, `needs_human`, `validating` oder `done` |
| `Verantwortlich` | Person, die das Feature vertikal verantwortet |
| `Branch` | Branch, auf dem das Feature bearbeitet wird |
| `Schema` | `nein`, `geplant` oder `ja` für Änderungen an `prisma/schema.prisma` |
| `Datei` | Link zur Feature-Plan-Datei |
| `Erstellt` / `Abgeschlossen` | Datum für Nachvollziehbarkeit |

Regeln für `TASKS.md`:

- Kein Feature gilt als `done`, ohne dokumentierte Validierung in der Feature-Plan-Datei.
- Jede aktive Arbeit hat genau eine verantwortliche Person.
- Jede aktive Arbeit hat einen sichtbaren Branch.
- Detailtasks werden nicht in Root-`TASKS.md` eingetragen.
- Wenn ein Feature die Spalte `Schema` mit `geplant` oder `ja` hat, müssen parallele DB-nahe Features abgestimmt werden.

## 4. Branch-Konvention

Arbeitet pro Feature auf einem eigenen Feature-Branch. Die Branch-Namen sollen direkt mit `TASKS.md` zusammenpassen.

Empfohlenes Muster:

```text
feature/<feature-kurzname>-<person>
```

Beispiele:

```text
feature/antrag-erfassen-lea
feature/antraege-pruefen-marco
feature/email-benachrichtigung-marco
```

Der Branch soll möglichst nur Änderungen für dieses eine Feature enthalten. Fremde parallele Änderungen werden nicht mitcommitted.

## 5. prisma/schema.prisma koordinieren

`prisma/schema.prisma` ist im Mehrpersonen-Fall die konfliktanfälligste Datei. Wenn zwei Personen gleichzeitig Modelle, Felder, Rollen oder Statuswerte ändern, entstehen sehr wahrscheinlich Merge-Konflikte oder inkonsistente Datenmodelle.

Deshalb gilt diese einfache Konvention:

- Schema-Änderungen werden vor der Umsetzung in `TASKS.md` sichtbar gemacht.
- Zwei Personen ändern `prisma/schema.prisma` nicht gleichzeitig ohne kurze Abstimmung.
- Wenn mehrere Features neue Datenmodelle brauchen, wird zuerst ein gemeinsames Foundation-Feature geplant, zum Beispiel `Datenmodell Basis`.
- Die Person mit dem Foundation-Feature setzt die Schema-Änderungen zuerst um und validiert sie.
- Danach aktualisieren die anderen Personen ihren Stand gemäss Git-/GitHub-Material und bauen ihre Features auf dem neuen Schema weiter.
- Nach Schema-Änderungen gilt weiterhin: keine Prisma Migrations verwenden, sondern `npm run db:reset` gemäss Projektregeln.

Empfohlene Reihenfolge bei mehreren DB-nahen Features:

```text
1. Gemeinsame Bestätigung der neuesten reviewten PRD-Version
2. Feature-Kandidaten mit Datenmodellbedarf markieren
3. Foundation-Feature für Datenmodell planen
4. Foundation-Feature umsetzen und validieren
5. Andere Feature-Branches aktualisieren
6. Fachfeatures auf Basis des neuen Schemas umsetzen
```

Wenn während `/execute` auffällt, dass ein anderes aktives Feature ebenfalls `prisma/schema.prisma` verändert, soll der Agent stoppen, den Task auf `needs_human` setzen und die Reihenfolge klären lassen.

## 6. Synchronisieren im Team (Pull/Sync)

Im geteilten Repository gibt es konkrete Momente, an denen ihr sicherstellen müsst, dass euer lokaler Stand dem aktuellen Zustand des gemeinsamen Branches entspricht. Wer veraltet arbeitet, baut auf einem Stand auf, den andere längst überholt haben.

**Wann muss ich synchronisieren?**

| Zeitpunkt | Warum |
|---|---|
| Zu Beginn jeder Arbeitssession, vor `/prime` | Stellt sicher, dass `TASKS.md`, PRDs, Feature-Pläne und Code dem aktuellen Stand entsprechen. |
| Nachdem ein Feature als `done` in `TASKS.md` markiert und in den gemeinsamen Branch gemergt wurde | Die Änderungen eurer Kollegin/eures Kollegen sind jetzt in `main`. Ohne Sync baut ihr auf einem veralteten Stand auf. |
| Bevor ihr euren Feature-Branch in den gemeinsamen Branch mergt | Verhindert unnötige Konflikte und stellt sicher, dass ihr alle aktuellen Änderungen der anderen integriert. |
| Nach Abschluss eines Foundation-Features mit `Schema = ja` | Das Prisma-Schema hat sich geändert. Ohne Sync arbeitet ihr mit einem inkonsistenten Datenmodell. Danach gilt: `npx prisma generate && npm run db:reset` ausführen. |

Die genauen Git-Befehle für Fetch, Pull und Branch-Update findet ihr in der GitHub-Dokumentation oder über die VS Code-Befehlspalette (`Ctrl+Shift+P` → `Git: Pull`).

**TASKS.md als Frühwarnsystem**

`TASKS.md` zeigt euch, ob jemand ein Feature gerade abgeschlossen hat. Wenn ein Feature in die Tabelle „Abgeschlossene Features" wechselt oder auf `done` gesetzt wird, ist das ein Signal: Es gibt wahrscheinlich neue Commits im gemeinsamen Branch, die ihr noch nicht lokal habt.

**Wie erkennt der Agent den Mehrpersonen-Fall?**

`/prime` liest `TASKS.md` und prüft automatisch, ob mehrere Personen als Verantwortliche oder mehrere Feature-Branches eingetragen sind. Falls ja, weist es aktiv darauf hin, dass ihr vor Planung oder Umsetzung synchronisieren solltet. Ihr müsst dem Agenten also nicht extra mitteilen, ob ihr allein oder im Team arbeitet – das ergibt sich aus `TASKS.md`.

## 7. Session-Start im geteilten Repo

Startet für jedes Feature bewusst eine neue Agent-Session. Ladet den aktuellen Kontext neu:

```text
/prime
```

Vor Planung oder Umsetzung im geteilten Repository prüft ihr:

- Ist mein lokaler Stand aktuell gemäss Git-/GitHub-Material?
- Bin ich auf dem richtigen Branch für mein Feature?
- Was steht in `TASKS.md` zu aktiven Features, verantwortlichen Personen und Branches?
- Arbeitet jemand anderes gerade an einem Feature mit `Schema = geplant` oder `Schema = ja`?
- Ist mein Feature-Plan bestätigt?
- Gibt es fremde uncommitted Änderungen im Arbeitsbaum, die ich nicht anfassen darf?

`prime` soll euch dabei helfen, den aktuellen Projektstand, `TASKS.md`, Git-Status und mögliche Kollaborationsrisiken kompakt sichtbar zu machen. Es ersetzt aber nicht die Teamabstimmung bei parallelen Schema-Änderungen oder fachlichen Abhängigkeiten.

## 8. Commit-Regel

Commits bleiben klein und featurebezogen. Bei längeren Features sind Zwischencommits ausdrücklich sinnvoll, sobald ein Task oder eine kohärente Phase validiert und in der Plan-Datei dokumentiert ist.

Vor `/commit` prüft ihr:

- Gehören die Änderungen zu meinem Feature?
- Stimmen Feature, Branch und Plan-Datei mit `TASKS.md` überein?
- Sind Validierungen in der Feature-Plan-Datei dokumentiert?
- Enthält der Arbeitsbaum fremde Änderungen, die nicht in meinen Commit gehören?

Der Agent soll nur Dateien stagen, die zur bestätigten logischen Einheit gehören. Fremde parallele Änderungen bleiben unangetastet.

Typische Commit-Zeitpunkte:

- nach dem initialen PRD-Entwurf `v001`
- nach Review-Integration und fachlicher Bestätigung einer neuen PRD-Version
- nach `/update-prd` und fachlicher Bestätigung einer neuen PRD-Version
- nach dem initialen Feature-Plan `plan-v001.md`
- nach Review-Integration und fachlicher Bestätigung einer neuen Feature-Plan-Version
- nach `/update-feature-plan` und fachlicher Bestätigung einer neuen Feature-Plan-Version
- nach einem validierten Task als Zwischencommit
- nach einer abgeschlossenen validierten Phase, z.B. Datenmodell oder UI-Grundgerüst
- nach `/document` als finaler Feature-Commit

Ein Feature gilt trotz Zwischencommits erst als abgeschlossen, wenn alle Tasks `done` sind, die Validierung dokumentiert ist, die Feature-Dokumentation erstellt wurde und der finale Commit erfolgt ist.
