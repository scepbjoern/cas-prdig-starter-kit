# Konzept- & Umsetzungs-Auftrag 10-4: Zusammenarbeit mehrerer Personen im selben Repository

## Deine Rolle
Du bist ein Agent, der in **Kilo Code im Agent-Modus** läuft und direkten Zugriff auf die Projektdateien hat (lesen und editieren). Du erhältst als Kontext die bereits umgesetzten PIV-Skill-Dateien sowie die `PIV-WORKFLOW.md`. Deine Aufgabe ist es, das Konzept für die Zusammenarbeit mehrerer Personen in EINEM gemeinsamen Repository auszuarbeiten und die daraus nötigen Anpassungen an Skills und Dokumentation umzusetzen.

**Wichtig – phasenweises Vorgehen:** Arbeite NICHT alle Aufgaben auf einen Schlag ab. Gehe Phase für Phase vor. Nach jeder Phase stoppst du, zeigst mir das Ergebnis und fragst mich explizit, ob alles passt oder ob noch etwas überarbeitet werden muss. Erst nach meiner Bestätigung gehst du zur nächsten Phase über.

---

## Kontext: Mitgelieferte Dateien

Die folgenden, bereits umgesetzten Dateien werden dir als Kontext mitgegeben bzw. liegen im Projekt vor. Lies sie sorgfältig, bevor du etwas erstellst oder änderst:

- **`.agents/skills/create-prd/SKILL.md`** (+ `references/`) – PRD-Erstellung
- **`.agents/skills/plan-feature/SKILL.md`** (+ ggf. `references/`) – Feature-Planung
- **`.agents/skills/execute/SKILL.md`** – Implementierung
- **`.agents/skills/prime/SKILL.md`** – Kontext laden zu Session-Beginn
- **`.agents/skills/commit/SKILL.md`** – Commits
- **`TASKS.md`** – leichtes Feature-Index-/Task-Tracking-File
- **`docs/starter-kit-usage/PIV-WORKFLOW.md`** – Workflow-Dokumentation für Studierende

---

## Kontext: Die Ausgangslage

### Situation
- In einigen Gruppen des CAS kann nicht jede Person ein eigenes Repository / eigenes IT-System bekommen.
- Es wird Fälle geben, in denen **mindestens zwei Personen im selben Repository** an **einem gemeinsamen IT-System** arbeiten.
- Diese Personen teilen sich die Arbeit auf – z.B. die eine plant und implementiert bestimmte Features, die andere andere Features.

### Bereits getroffene Grundentscheidung (Prämisse, nicht mehr zu hinterfragen)
- **Ein gemeinsames PRD pro IT-System.** Auch wenn mehrere Personen am selben System arbeiten, gibt es genau EIN PRD. Über das *Was* und *Warum* des Systems müssen sich die beteiligten Personen einig sein – das gemeinsame PRD ist der Konsens-Anker. Es gibt KEINE konkurrierenden Sub-PRDs pro Person.
- **Die Aufteilung erfolgt erst auf Feature-Ebene.** Aus dem einen PRD werden mehrere Features abgeleitet (via `plan-feature`). Diese Features werden auf die Personen aufgeteilt.
- **Aufteilung erfolgt Feature-für-Feature (vertikal).** Person A baut Feature 1 komplett (durch den ganzen Stack), Person B baut Feature 2 komplett. Eine Aufteilung nach Schichten (eine Person nur Frontend, eine nur Backend) wird NICHT verfolgt – sie erzeugt zu hohe Kopplung, gegenseitige Blockaden und mehr Merge-Konflikte. Dieser Punkt ist entschieden und soll nicht erneut diskutiert werden.

### Was bewusst NICHT Teil dieses Auftrags ist
- **Keine Git-/GitHub-Grundlagen, kein Branching-/Merging-/Merge-Konflikt-Tutorial.** Dafür existiert bereits separates Lernmaterial. Dieser Auftrag verweist nur an passender Stelle neutral darauf (siehe Platzhalter unten), ohne den Inhalt zu duplizieren oder ein konkretes Material namentlich zu nennen.

---

## Die zu klärenden Fragen

Diese Fragen sollst du im Konzept beantworten:

1. **Wann genau erfolgt die Feature-Aufteilung** im PIV-Ablauf, und wie wird sie festgehalten? (Erwartung: nach bestätigtem gemeinsamem PRD, dokumentiert in `TASKS.md`.)
2. **Wie wird `TASKS.md` zur Koordinationsschicht?** Welche Konvention (Feature → zuständige Person → Branch → Status), damit jede Person sieht, woran die andere arbeitet?
3. **Branch-Strategie pro Feature/Person**, abgestimmt mit dem bereits existierenden (hier nicht näher benannten) GitHub-Lernmaterial. Nur die PIV-/Repo-spezifischen Konventionen festlegen, keine Git-Grundlagen erklären.
4. **Das `prisma/schema.prisma`-Konfliktproblem.** Diese Datei wird bei DB-Änderungen durch mehrere Personen fast garantiert zu Merge-Konflikten führen (bekanntes Problem aus früheren Durchführungen). Wie entschärft man das? (Mögliche Richtungen: Konvention, wer Schema-Änderungen koordiniert; Schema-Änderungen bündeln; klare Reihenfolge; Hinweise in den Skills. Erarbeite eine praktikable, für Nicht-Techniker umsetzbare Lösung.)
5. **`prime` / Kontext laden bei geteiltem Repo.** Was muss eine Person beim Session-Start zusätzlich beachten, wenn parallel jemand anderes am selben Repo arbeitet? (z.B. zuerst pullen, TASKS.md lesen, wer hat was offen.)
6. **Skill-Anpassungen:** Brauchen `create-prd`, `plan-feature`, `prime` (und ggf. `commit`/`execute`) Hinweise für den Mehrpersonen-Fall? Z.B. `create-prd`: Hinweis, dass das PRD im geteilten Fall gemeinsam erstellt und von allen Beteiligten bestätigt wird. Z.B. `plan-feature`: Hinweis, das Feature in TASKS.md einer Person zuzuweisen und einen Branch zu wählen.

---

## Die Phasen

### Phase 1: Analyse & Konzept (zuerst, dann stoppen)

1. Lies die mitgelieferten Skill-Dateien, `TASKS.md` und `PIV-WORKFLOW.md`.
2. Halte fest, wie der Solo-Ablauf aktuell funktioniert (PRD → plan-feature → execute → commit) und an welchen Stellen der Mehrpersonen-Fall davon abweicht.
3. Beantworte die sechs Fragen oben konzeptionell (noch ohne Dateien zu ändern).
4. Achte besonders auf das `schema.prisma`-Konfliktproblem – erarbeite hierfür eine konkrete, einfache Konvention.

**Output Phase 1:** Ein kompaktes Konzeptdokument (Antworten auf die 6 Fragen, inkl. empfohlener TASKS.md-Konvention und schema.prisma-Strategie). **Dann stoppen und fragen, ob das Konzept passt, bevor du irgendetwas im Repo änderst.**

---

### Phase 2: TASKS.md-Konvention festlegen (dann stoppen)

- Entwirf die konkrete `TASKS.md`-Struktur/Konvention für den Mehrpersonen-Fall (Feature, zuständige Person, Branch, Status).
- Achte auf Konsistenz mit dem bestehenden TASKS.md-Format aus dem Solo-Workflow – der Mehrpersonen-Fall soll eine Erweiterung sein, kein Bruch.
- Zeige ein ausgefülltes Beispiel mit 2 Personen und mehreren Features.

**Output Phase 2:** Vorgeschlagene TASKS.md-Konvention + Beispiel. **Dann stoppen und Freigabe einholen.**

---

### Phase 3: Skill-Anpassungen umsetzen (dann stoppen)

- Setze die in Phase 1 beschlossenen Skill-Anpassungen um (direkt im Repo, da Agent-Modus).
- Halte die Anpassungen minimal und gezielt: nur Hinweise/Abschnitte für den Mehrpersonen-Fall ergänzen, bestehende Solo-Logik nicht brechen.
- Beachte Progressive Disclosure: Falls ein Hinweis länger wird, ggf. in `references/` auslagern statt die `SKILL.md` aufzublähen.
- Wahrscheinlich betroffen: `create-prd` (gemeinsames PRD bestätigen), `plan-feature` (Feature in TASKS.md zuweisen + Branch), `prime` (zuerst pullen / TASKS.md prüfen bei geteiltem Repo). Prüfe selbst, ob `execute`/`commit` ebenfalls einen Hinweis brauchen.

**Output Phase 3:** Die geänderten Skill-Stellen (als Diff oder klar markiert) mit kurzer Begründung pro Änderung. **Dann stoppen und Feedback einholen.**

---

### Phase 4: Kollaborations-Doku schreiben (dann stoppen)

- Erstelle eine knappe Dokumentation für Studierende zum Mehrpersonen-Fall. Prüfe zuerst, ob sie als eigener Abschnitt in `PIV-WORKFLOW.md` passt oder als separate Datei in `docs/starter-kit-usage/` (z.B. `05-collaboration.md`). Empfiehl die sinnvollere Variante und begründe kurz.
- Inhalt:
  - Grundprinzip: ein gemeinsames PRD, Aufteilung erst auf Feature-Ebene, Feature-für-Feature (vertikal).
  - Wie die TASKS.md-Koordination funktioniert (aus Phase 2).
  - Die schema.prisma-Konvention (aus Phase 1) – verständlich für Nicht-Techniker.
  - Was beim Session-Start im geteilten Repo zu beachten ist (prime + pull + TASKS.md).
  - Neutraler Platzhalter-Verweis auf das bestehende Git-/GitHub-Material, z.B.: `> Für die Git-Grundlagen (Branching, Merging, Merge-Konflikte) siehe [Git-/GitHub-Material – LINK]`. Den genauen Titel/Link NICHT festlegen – als Platzhalter lassen, damit der Dozent ihn selbst einträgt.
- Stil/Ton/Formatierung konsistent mit der bestehenden `PIV-WORKFLOW.md`. Keine Git-Grundlagen erklären.

**Output Phase 4:** Die Doku (bzw. der ergänzte Abschnitt) + Begründung des Ablageorts. **Dann stoppen und Feedback einholen.**

---

### Phase 5: Abschluss (dann stoppen)

- Fasse zusammen, welche Dateien du erstellt/geändert hast.
- Weise explizit auf mögliche Auswirkungen auf Sub-Agent 10-3 hin (Beispiel-PRD): Sollte das Beispiel-PRD den Mehrpersonen-Fall illustrieren oder einen Hinweis enthalten? Gib hierzu eine klare Empfehlung, da 10-3 zeitlich nach 10-4 ausgeführt wird.
- Liste offene Designentscheidungen für mich auf.

**Output Phase 5:** Zusammenfassung der Änderungen + Empfehlung für 10-3 + offene Punkte. **Dann stoppen.**

---

## Erwartetes Gesamt-Vorgehen (Zusammenfassung)

Phase 1 (Konzept) → Freigabe → Phase 2 (TASKS.md-Konvention) → Freigabe → Phase 3 (Skill-Anpassungen) → Freigabe → Phase 4 (Kollaborations-Doku) → Freigabe → Phase 5 (Abschluss + Hinweis für 10-3). Nach jeder Phase: stoppen, Ergebnis zeigen, auf meine Bestätigung warten.
