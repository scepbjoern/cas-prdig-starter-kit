# AGENTS.md – Projekt-Constitution

> Spec Kit Constitution für dieses Projekt.
> Angepasst von: [Gruppenname], [Datum]
> Coding-Regeln und Stack-Details: siehe KILO_INSTRUCTIONS.md

## Projektbeschreibung

Gruppe: 02 - KESB-Entscheid-Umsetzung bei der Zuger Kantonalbank (ZugerKB)
Version: v2.0 (31.05.2026)

Dieses System digitalisiert den KESB‑Entscheidungs‑ und Kontoeröffnungsprozess für Bestandeskunden
der ZugerKB: KESB‑Mitarbeitende erfassen Verfügungen und laden begleitende Dokumente hoch; ein
prüfender PD16-/VEBK‑Workflow visualisiert, analysiert (LLM‑gestützt) und entscheidet über die
Eröffnung von Banking‑Produkten. Admins verwalten Benutzer und Systemkonfigurationen.

Ziel des Prototyps ist ein lokal lauffähiger, demonstrierbarer Ablauf (CRUD, Status‑Workflow,
E‑Mail‑Benachrichtigungen, PDF‑Generierung und eine LLM‑gestützte Dokumentanalyse). (Quelle: Gesamtarchitektur-Dokument, v2.0)

## Stack-Entscheidungen

> Vollständige Stack-Tabelle und Coding-Konventionen: `KILO_INSTRUCTIONS.md`

Kerntechnologien: Next.js 16 · shadcn/ui · Prisma 7 + SQLite · Better Auth · OpenAI/together.ai · Resend

**Verboten:** Supabase, DaisyUI, LangChain, Prisma Migrations.

## Rollenkonzept

| Rolle | Bezeichnung | Beschreibung |
|---|---|---|
| `admin` | Administrator | Benutzerverwaltung, Systemkonfiguration, volle Rechte |
| `user_applicant` | KESB‑Mitarbeitende (z. B. "Jonas") | Erfassen von Verfügungen/Anträgen, Upload von Dokumenten |
| `user_reviewer` | PD16 / VEBK‑Prüfer (z. B. "Ivan", "Sandra") | Prüfen, Analyse anstossen, Genehmigen / Ablehnen |

Hinweis: Im Prototyp sind die Rollen als einfache Strings implementiert (Standard: `admin`, `user_applicant`, `user_reviewer`). Die Team‑Rollen (KESB, PD16, VEBK, optional Compliance) sind konzeptionelle Zuordnungen, die in `prisma/schema.prisma` und den Seed‑Testnutzern abgebildet sind. (Quelle: Gesamtarchitektur-Dokument)

## Scope des Prototypen


**Im Scope:**
- Abbildung des KESB‑Verfügungsprozesses für Bestandeskunden (Erfassung → Prüfung → Entscheidung)
- CRUD für `Antrag`‑Objekte mit Statusworkflow (`ENTWURF`, `EINGEREICHT`, `GENEHMIGT`, `ABGELEHNT`)
- Rollenbasierte Zugriffssteuerung (Test‑Logins / statische Seed‑User)
- E‑Mail‑Benachrichtigungen bei relevanten Statuswechseln (Dashboard + Mail)
- PDF‑Generierung (Basisvertragsdokumente) und Upload/Download
- LLM‑gestützte Dokumentanalyse: Analyse hochgeladener PDFs, Speicherung strukturierter JSON‑Ergebnisse in `Antrag.kiAnalyse`
- Lokaler Betrieb / Demo‑Bereitstellung (VS Code Port Forwarding)

**Ausserhalb des Scope:**
- Mobile-Optimierung
- Produktions-Deployment mit echten Benutzerdaten
- Komplexe externe API-Integrationen

Weitere explizite Ausschlüsse (siehe Architektur‑Dokument):
- eDossier / revisionssichere Dokumentenarchivierung (wird weggelassen)
- Vollwertiges IAM (Fidentity) — Login über statische, vordefinierte Test‑User
- Vollständige Finnova‑Integration (Kernbank API nur als Mock mit simulierten Antworten)
- Compliance‑Involvierung in Ausbaustufe 1 (ggf. Ausbaustufe 2)
- Mehrsprachigkeit (nur Deutsch)
- Revisionssichere Protokollierung, DSGVO/Datenschutz‑Produkte (nur Testdaten verwenden)

## Testing-Ansatz

- **Vitest** für Unit Tests (Zod-Schemas, Validierungslogik)
- **Playwright** für E2E Tests (Login, CRUD-Flows)
- PIV-Loop: Plan → Implement → `npm run test` → Commit

Zusätzlich: Test‑Logins und Seed‑Daten unterstützen Demo‑Szenarien (siehe `README.md` Testlogins). E‑2‑E Tests sind vorgesehen, aber nicht alle Demo‑Szenarien müssen vollständig automatisiert sein.

## Datenmodell


Hauptentitäten (aktuell im Code / Prisma):

- `Antrag` (Prozessobjekt)
	- `id: String (cuid)`
	- `titel: String`
	- `beschreibung: String?`
	- `status: AntragStatus (ENTWURF | EINGEREICHT | GENEHMIGT | ABGELEHNT)`
	- `erstellerId -> User` (Relation)
	- `dateiPfad: String?`, `dateiName: String?`
	- `notizen: String?`
	- `kiAnalyse: String?` (speichert JSON‑Analysen der LLM‑Funktion)

- `Person` (Stammdaten)
	- `id: String (cuid)`
	- `vorname, nachname, email, telefon?, adresse?`

Weitere technische Modelle (Better Auth): `User`, `Session`, `Account`, `Verification` — siehe `prisma/schema.prisma`.

Hinweis: Die Zod‑Schemas in `src/lib/schemas/` spiegeln die Validierung für `Antrag` und `Person` wider (z.B. `antragCreateSchema`, `personSchema`).

## Entwicklungsstand


Siehe `TASKS.md` für laufende Tasks und Priorisierung. Die Architektur‑Dokumentation (v2.0) enthält bereits Abnahmeszenarien, Demo‑Szenarien und offene Fragen, die in Tasks überführt werden sollten.

## Team


**Gruppe:** 02 - KESB‑Entscheid‑Umsetzung bei der Zuger Kantonalbank (ZugerKB)
**Version:** v2.0 – 31.05.2026

**Team:** Ivan Besmer, Urs Hüniger, Stefan Sommer, Ernat Zoric
**Kursjahrgang:** 2026

**Kernteam / Verantwortlichkeiten:**
- Urs Hüniger — Lead UI / Prozessportal
- Stefan Sommer — Backend / Datenbank, API
- Ivan Besmer — PDF‑Generierung, Dokumentenlogik
- Ernat Zoric — Benachrichtigungssystem, Finnova‑Mock

Reviewer / Mentor: Björn (Architektur‑Review)

PR: follow-up commit to create a pull request branch.