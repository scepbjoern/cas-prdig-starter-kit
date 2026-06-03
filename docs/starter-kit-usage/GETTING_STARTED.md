# Getting Started – Starter Kit für eigenes Projekt anpassen

Dieses Dokument erklärt die ersten Schritte, um das Starter Kit für euer eigenes IT-System vorzubereiten.

---

## 1. Projektkontext definieren

Öffne `AGENTS.md` im Wurzelverzeichnis und ersetze alle `[TODO]`-Einträge:

- **Projektbeschreibung:** Was digitalisiert dieses Projekt? Welcher Prozess wird abgebildet? Welches IT-System wird gebaut oder gemockt?
- **Rollen:** Eigene Rollenbezeichnungen eintragen oder bei `admin`/`user_applicant`/`user_reviewer` bleiben
- **Scope:** Was ist im / ausserhalb des Scope?
- **Team-Info:** Gruppenname, Mitglieder, Kursjahrgang

---

## 2. Umgebungsvariablen setzen

Befülle `.env` mit den benötigten Werten. Welche Dienste euer IT-System nutzt, klärt ihr im nächsten Schritt beim PRD.

```env
BETTER_AUTH_SECRET="zufälliger-32-zeichen-string"  # openssl rand -hex 16 (immer nötig)
RESEND_API_KEY="re_..."                              # nur wenn E-Mail genutzt → Anleitung: EMAIL_INTEGRATION.md
OPENAI_API_KEY="sk-..."                              # nur wenn LLM genutzt → Anleitung: LLM_INTEGRATION.md
TOGETHERAI_API_KEY="..."                             # Alternative zu OpenAI → Anleitung: LLM_INTEGRATION.md
```

Die Anleitungen für API-Keys und Konfiguration der einzelnen Dienste findet ihr in `docs/starter-kit-usage/`:

- E-Mail: [`EMAIL_INTEGRATION.md`](EMAIL_INTEGRATION.md)
- LLM: [`LLM_INTEGRATION.md`](LLM_INTEGRATION.md)

---

## 3. PRD erstellen und reviewen

Das PRD (Product Requirements Document) beschreibt euer IT-System: Rollen, Scope, Datenmodell, Features und Ausbaustufen. Es ist die fachliche Grundlage für alle späteren Feature-Pläne.

```text
/create-prd docs/project/prds/[systemname].md
```

Der Skill führt euch durch einen Dialog und schreibt das PRD. Falls eine Gesamtarchitektur vorhanden ist, könnt ihr diese als Kontext mitgeben.

Der erste Entwurf wird als `v001` gespeichert und soll committed werden, bevor ihr den Review startet. Danach folgt mindestens eine kritische Review-Runde in einer frischen Agent-Session:

```text
/review-prd docs/project/prds/[systemname]-v001.md
```

Zurück in der Autor-Session integriert ihr den Review. Dabei entsteht eine neue PRD-Version, typischerweise `v002`:

```text
/integrate-prd-review docs/project/prds/[systemname]-v001.md docs/project/prd-reviews/[systemname]-v001-r01-review.md
```

Prüft die neue PRD-Version sorgfältig – insbesondere den Abschnitt **"Starter Kit Nutzung"**, der auflistet, welche Starter-Kit-Bausteine genutzt werden und welche Demo-Inhalte irrelevant sind. Bestätigt die neueste PRD-Version erst, wenn sie als Grundlage für die Feature-Planung taugt, und committed sie danach separat inklusive Review-/Integration-Dateien.

Wenn sich später fachlich etwas am PRD ändert, bearbeitet die bestehende Datei nicht von Hand. Nutzt stattdessen:

```text
/update-prd docs/project/prds/[systemname]-v002.md
```

Der Skill erstellt eine neue PRD-Version, ergänzt die Änderungshistorie und schreibt eine Update-Datei. Wenn dadurch bestehende Feature-Pläne betroffen sind, werden sie nicht automatisch geändert; dafür nutzt ihr `/update-feature-plan`.

Die vollständige Anleitung steht in [`PIV-WORKFLOW.md`](PIV-WORKFLOW.md).

---

## 4. Starter Kit bereinigen

Nach PRD-Review, Review-Integration und fachlicher Bestätigung der neuesten PRD-Version bereinigt `/adapt-to-project` den Workspace automatisch: Demo-Seiten werden durch minimale Platzhalter ersetzt und irrelevante Demo-Entitäten aus dem Prisma-Schema entfernt. Der Skill validiert am Ende den Build und repariert TypeScript-Fehler selbst.

```text
/adapt-to-project docs/project/prds/[systemname]-v002.md
```

Startet nach der Bereinigung `npm run dev` und prüft kurz, ob die App noch läuft. Danach habt ihr eine saubere Ausgangslage für die Feature-Entwicklung.

> **Bereits ein PRD ohne "Starter Kit Nutzung"?** Lest zuerst den Retrofit-Hinweis in [`PIV-WORKFLOW.md`](PIV-WORKFLOW.md) (Schritt 5).

---

## 5. Features bauen

Ab jetzt wiederholt ihr für jedes Feature aus dem PRD denselben Zyklus. Die vollständige Anleitung mit allen Schritten und Hintergründen steht in [`PIV-WORKFLOW.md`](PIV-WORKFLOW.md).

Kurzablauf pro Feature:

1. Neue Agent-Session starten, `/prime` ausführen
2. `/plan-feature "[Feature aus PRD]"` – Agent erstellt `docs/project/features/[feature-name]/plan-v001.md`
3. Initialen Plan und `TASKS.md` committen
4. Neue Reviewer-Session starten, `/prime`, dann `/review-feature-plan docs/project/features/[feature-name]/plan-v001.md`
5. Zurück in die Autor-Session, `/integrate-feature-plan-review ...` – Agent erstellt typischerweise `plan-v002.md` und aktualisiert `TASKS.md`
6. Neue Plan-Version prüfen, bestätigen und committen
7. `/execute docs/project/features/[feature-name]/plan-v002.md` – Task für Task umsetzen
8. Nach jedem Task: `npm run test` und manuelle Prüfung mit `npm run dev`
9. Wenn alle Tasks `done`: `/document` ausführen, bei Verdacht auf wiederholbare Fehler `/reflect-rules`, dann `/commit`

Wenn ein PRD-Update, Dozentenfeedback oder ein Befund während `/execute` einen bestehenden Feature-Plan betrifft, nutzt `/update-feature-plan docs/project/features/[feature-name]/plan-vNNN.md`. Der Skill erstellt eine neue Plan-Version, aktualisiert `TASKS.md` und schreibt eine Update-Datei im Feature-Ordner.

`TASKS.md` ist nur ein Feature-Index. Detailtasks und Validierung liegen immer in der jeweiligen Datei `docs/project/features/[feature-name]/plan-vNNN.md`.
