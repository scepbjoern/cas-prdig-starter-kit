# AGENTS.md – Projektkontext

> Angepasst von: [Gruppenname], [Datum]
> Coding-Regeln und Stack-Details: siehe KILO_INSTRUCTIONS.md

## Projektbeschreibung

[TODO: 2–3 Sätze – was digitalisiert dieser Prototyp, welcher Prozess wird abgebildet?]

Beispiel: «Dieses System digitalisiert den Antrags- und Genehmigungsprozess der Abteilung X.
Mitarbeitende (user_applicant) können Anträge erfassen; Vorgesetzte (user_reviewer) können
genehmigen oder ablehnen; Admins verwalten Benutzer und Einstellungen.»

## Stack-Entscheidungen

> Vollständige Stack-Tabelle und Coding-Konventionen: `KILO_INSTRUCTIONS.md`

Kerntechnologien: Next.js 16 · shadcn/ui · Prisma 7 + SQLite · Better Auth · OpenAI/OpenRouter/together.ai · Resend

**Verboten:** Supabase, DaisyUI, LangChain, Prisma Migrations.

## Rollenkonzept

| Rolle | Bezeichnung | Beschreibung |
|---|---|---|
| `admin` | Administrator | Benutzerverwaltung, Systemkonfiguration, volle Rechte |
| `user_applicant` | Antragsteller | Kann Prozessobjekte erstellen und bearbeiten (eigene) |
| `user_reviewer` | Prüfer/Genehmiger | Kann Prozessobjekte prüfen und Status ändern |

[TODO: Rollen an den eigenen Prozess anpassen]

## Scope des Prototypen

**Im Scope:**
- [TODO: Prozessschritte und Entitäten des digitalisierten Prozesses]
- CRUD für Prozessobjekte mit Statusworkflow
- Rollenbasierter Zugriff
- E-Mail-Benachrichtigungen bei Statuswechseln
- LLM-Unterstützung für [TODO: konkreter Use Case]
- Lokaler Betrieb via VS Code Port Forwarding

**Ausserhalb des Scope:**
- Mobile-Optimierung
- Produktions-Deployment mit echten Benutzerdaten
- Komplexe externe API-Integrationen

## Testing-Ansatz

- **Vitest** für Unit Tests (Zod-Schemas, Validierungslogik)
- **Playwright** für E2E Tests (Login, CRUD-Flows)
- PIV-Loop: Plan → Implement → **du führst `npm run test` aus** → Document → bei Verdacht Reflect Rules → Commit
  - Unit Tests laufen automatisch als Teil des Validate-Schritts
  - E2E Tests (`npm run test:e2e`) werden nur auf explizite Anfrage ausgeführt (benötigen laufenden Dev-Server)

## Datenmodell

[TODO: Entitäten und Relationen des eigenen Prozesses hier eintragen]

Demo-Entitäten im Starter-Kit (als Muster, anpassen/ersetzen):
- `Antrag`: id, titel, beschreibung, status (ENTWURF/EINGEREICHT/GENEHMIGT/ABGELEHNT), ersteller
- `Person`: id, vorname, nachname, email, telefon, adresse

## Entwicklungsstand

siehe `TASKS.md`

## Team

[TODO: Gruppenname, Mitglieder, Kursjahrgang]
