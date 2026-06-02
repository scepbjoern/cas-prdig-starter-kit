# Dokumentation - CAS Starter Kit

Diese Seite ist der zentrale Einstieg in die Dokumentation. Sie trennt zwischen der Dokumentation des Starter Kits und der projektspezifischen Dokumentation, die im Verlauf eines eigenen Digitalisierungsprojekts entsteht.

## Was Kommt Wohin?

| Bereich | Pfad | Inhalt |
|---|---|---|
| Starter-Kit nutzen | `docs/starter-kit-usage/` | Anleitungen für Setup, Anpassung, PIV-Workflow, Testing, Integrationen und Deployment |
| Starter-Kit Entstehung | `docs/starter-kit-erstellung/` | Hintergrunddokumente dazu, wie das Starter Kit aufgebaut wurde |
| Projektarchitektur | `docs/project/architecture/` | Gesamtarchitektur, Prozessübersichten, `architecture.dsl` und Kontextdokumente |
| PRDs | `docs/project/prds/` | Product Requirements Documents für einzelne IT-Systeme oder Komponenten |
| Feature-Artefakte | `docs/project/features/` | Pro Feature ein Unterordner mit `plan.md`, später `user-guide.md` und `developer-notes.md` |
| Entscheidungen | `docs/project/decisions/` | Architektur- oder Fachentscheide, z.B. Rollenmodell, Statusworkflow oder Integrationsentscheide |
| Betrieb und Demo | `docs/project/operations/` | Projektspezifische Demo-, Setup-, ENV-, Reset- oder Betriebsnotizen |

Die Ordner unter `docs/project/` enthalten teilweise `.gitkeep`-Platzhalter. Diese Dateien sorgen dafür, dass GitHub die leeren Ordner synchronisiert und sie nach dem Klonen vorhanden sind. Sobald ein Ordner echte Dokumente enthält, kann die jeweilige `.gitkeep`-Datei entfernt werden.

## Einstieg

| Dokument | Inhalt |
|---|---|
| [`../README.md`](../README.md) | Setup in 5 Schritten |
| [`starter-kit-usage/TECH_STACK_OVERVIEW.md`](starter-kit-usage/TECH_STACK_OVERVIEW.md) | **Technischer Wegweiser:** Welche Bausteine hat das Starter Kit und wann schaue ich wo nach? |
| [`starter-kit-usage/GETTING_STARTED.md`](starter-kit-usage/GETTING_STARTED.md) | Starter Kit für eigenes Projekt anpassen |
| [`starter-kit-usage/PIV-WORKFLOW.md`](starter-kit-usage/PIV-WORKFLOW.md) | Plan -> Implement -> Validate mit Agent Skills |
| [`starter-kit-usage/COLLABORATION.md`](starter-kit-usage/COLLABORATION.md) | Zusammenarbeit mehrerer Personen im selben Repository |
| [`../KILO_INSTRUCTIONS.md`](../KILO_INSTRUCTIONS.md) | Coding-Guide für Kilo Code |
| [`../AGENTS.md`](../AGENTS.md) | Projektkontext |

## Technische Guides

| Dokument | Inhalt |
|---|---|
| [`starter-kit-usage/REST_API_GUIDE.md`](starter-kit-usage/REST_API_GUIDE.md) | REST API erklärt |
| [`starter-kit-usage/SCHEMA_RESET_WORKFLOW.md`](starter-kit-usage/SCHEMA_RESET_WORKFLOW.md) | Datenbank-Schema ändern |
| [`starter-kit-usage/TESTING.md`](starter-kit-usage/TESTING.md) | Unit Tests und E2E Tests: was, warum, wie ausführen |
| [`starter-kit-usage/VSCODE_PORT_FORWARDING.md`](starter-kit-usage/VSCODE_PORT_FORWARDING.md) | App für Demos öffentlich zugänglich machen |
| [`starter-kit-usage/FILE_UPLOAD_GUIDE.md`](starter-kit-usage/FILE_UPLOAD_GUIDE.md) | PDF hochladen, anzeigen und herunterladen |
| [`starter-kit-usage/LLM_INTEGRATION.md`](starter-kit-usage/LLM_INTEGRATION.md) | KI-Features nutzen mit OpenAI oder Together.ai |
| [`starter-kit-usage/EMAIL_INTEGRATION.md`](starter-kit-usage/EMAIL_INTEGRATION.md) | E-Mails senden und empfangen mit Resend |
| [`starter-kit-usage/REST_CLIENT_GUIDE.md`](starter-kit-usage/REST_CLIENT_GUIDE.md) | Externe REST-APIs aufrufen: PLZ-Lookup als Muster-Beispiel |

## Optionale Cloud-Variante

| Dokument | Inhalt |
|---|---|
| [`starter-kit-usage/NEON_SETUP.md`](starter-kit-usage/NEON_SETUP.md) | SQLite -> PostgreSQL mit Neon |
| [`starter-kit-usage/UPLOADTHING_SETUP.md`](starter-kit-usage/UPLOADTHING_SETUP.md) | Lokaler Upload -> UploadThing |
| [`starter-kit-usage/VERCEL_DEPLOYMENT.md`](starter-kit-usage/VERCEL_DEPLOYMENT.md) | Deployment auf Vercel |

## Implementierungsanleitungen

Diese Anleitungen sind primär für AI Agents und interessierte Studierende gedacht. Sie erklären, welche Architekturentscheidungen beim Aufbau des Starter Kits getroffen wurden.

| Dokument | Inhalt | Status |
|---|---|---|
| [`starter-kit-erstellung/impl-00-einstieg.md`](starter-kit-erstellung/impl-00-einstieg.md) | Einstieg und Gesamtplan | Umgesetzt |
| [`starter-kit-erstellung/impl-00-tech-stack-decisions.md`](starter-kit-erstellung/impl-00-tech-stack-decisions.md) | Tech-Stack-Entscheide | Umgesetzt |
| [`starter-kit-erstellung/impl-01-basics.md`](starter-kit-erstellung/impl-01-basics.md) | Setup, DB, Auth, UI | Umgesetzt |
| [`starter-kit-erstellung/impl-02-rest-api.md`](starter-kit-erstellung/impl-02-rest-api.md) | REST API mit Route Handlers und Zod | Umgesetzt |
| [`starter-kit-erstellung/impl-03-testing.md`](starter-kit-erstellung/impl-03-testing.md) | Vitest und Playwright | Umgesetzt |
| [`starter-kit-erstellung/impl-04-ai-coding-instructions.md`](starter-kit-erstellung/impl-04-ai-coding-instructions.md) | KILO_INSTRUCTIONS, AGENTS, Agent-Regeln | Umgesetzt |
| [`starter-kit-erstellung/impl-05-file-upload.md`](starter-kit-erstellung/impl-05-file-upload.md) | Dateiupload und PDF-Anzeige | Umgesetzt |
| [`starter-kit-erstellung/impl-06-email.md`](starter-kit-erstellung/impl-06-email.md) | E-Mail Outbound und Inbound mit Resend | Umgesetzt |
| [`starter-kit-erstellung/impl-07-ai.md`](starter-kit-erstellung/impl-07-ai.md) | LLM-Chat und Dokumentenanalyse | Umgesetzt |
| [`starter-kit-erstellung/impl-08-documentation.md`](starter-kit-erstellung/impl-08-documentation.md) | Dokumentationsstruktur | Umgesetzt |
| [`starter-kit-erstellung/impl-09-rest-client.md`](starter-kit-erstellung/impl-09-rest-client.md) | REST-Client: externe APIs aufrufen (PLZ-Lookup) | Umgesetzt |

## Projektdokumentation

Diese Ordner sind am Anfang bewusst leer und werden im Projektverlauf gefüllt.

| Ordner | Erwartete Dateien |
|---|---|
| `docs/project/architecture/` | `Gesamtarchitektur.md`, `architecture.dsl`, Prozess- oder Systemübersichten |
| `docs/project/prds/` | z.B. `antragssystem.md`; erstellt mit `/create-prd docs/project/prds/antragssystem.md` |
| `docs/project/features/[feature-name]/` | `plan.md`; später `user-guide.md`, `developer-notes.md` und ggf. Validierungsnotizen |
| `docs/project/decisions/` | z.B. `adr-0001-rollenmodell.md` oder `adr-0002-statusworkflow.md` |
| `docs/project/operations/` | z.B. `demo-checklist.md`, `env-setup.md`, `reset-and-seed.md` |
