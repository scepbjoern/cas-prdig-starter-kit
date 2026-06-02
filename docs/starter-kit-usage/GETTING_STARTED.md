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

## 3. PRD erstellen

Das PRD (Product Requirements Document) beschreibt euer IT-System: Rollen, Scope, Datenmodell, Features und Ausbaustufen. Es ist die fachliche Grundlage für alle späteren Feature-Pläne.

```text
/create-prd docs/project/prds/[systemname].md
```

Der Skill führt euch durch einen Dialog und schreibt das PRD. Falls eine Gesamtarchitektur vorhanden ist, könnt ihr diese als Kontext mitgeben.

Prüft das PRD sorgfältig – insbesondere den Abschnitt **"Starter Kit Nutzung"**, der auflistet, welche Starter-Kit-Bausteine genutzt werden und welche Demo-Inhalte irrelevant sind. Bestätigt das PRD erst, wenn es als Grundlage für die Feature-Planung taugt.

Die vollständige Anleitung steht in [`PIV-WORKFLOW.md`](PIV-WORKFLOW.md).

---

## 4. Starter Kit bereinigen

Nach PRD-Bestätigung bereinigt `/adapt-to-project` den Workspace automatisch: Demo-Seiten werden durch minimale Platzhalter ersetzt und irrelevante Demo-Entitäten aus dem Prisma-Schema entfernt. Der Skill validiert am Ende den Build und repariert TypeScript-Fehler selbst.

```text
/adapt-to-project docs/project/prds/[systemname].md
```

Startet nach der Bereinigung `npm run dev` und prüft kurz, ob die App noch läuft. Danach habt ihr eine saubere Ausgangslage für die Feature-Entwicklung.

> **Bereits ein PRD ohne "Starter Kit Nutzung"?** Lest zuerst den Retrofit-Hinweis in [`PIV-WORKFLOW.md`](PIV-WORKFLOW.md) (Schritt 3).

---

## 5. Features bauen

Ab jetzt wiederholt ihr für jedes Feature aus dem PRD denselben Zyklus. Die vollständige Anleitung mit allen Schritten und Hintergründen steht in [`PIV-WORKFLOW.md`](PIV-WORKFLOW.md).

Kurzablauf pro Feature:

1. Neue Agent-Session starten, `/prime` ausführen
2. `/plan-feature "[Feature aus PRD]"` – Agent erstellt `docs/project/features/[feature-name]/plan.md`
3. Plan prüfen und bestätigen
4. `/execute docs/project/features/[feature-name]/plan.md` – Task für Task umsetzen
5. Nach jedem Task: `npm run test` und manuelle Prüfung mit `npm run dev`
6. Wenn alle Tasks `done`: `/document` ausführen, bei Verdacht auf wiederholbare Fehler `/reflect-rules`, dann `/commit`

`TASKS.md` ist nur ein Feature-Index. Detailtasks und Validierung liegen immer in der jeweiligen Datei `docs/project/features/[feature-name]/plan.md`.
