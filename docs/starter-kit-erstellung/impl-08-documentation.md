# Teil 8: Dokumentation

> **Hauptdokument:** `impl-00-einstieg.md` → Abschnitt B4, Phase 6.3 + 6.4  
> **Voraussetzungen:** Alle anderen Teile (1–7) abgeschlossen

---

## Übersicht: Zu erstellende Dateien

### Root-Ebene
| Datei | Zweck |
|---|---|
| `README.md` | Einstieg für neue Nutzer (Setup in 5 Schritten) |

### `/docs/starter-kit-usage`-Verzeichnis
| Datei | Zweck |
|---|---|
| `docs/starter-kit-usage/INDEX.md` | Dokumentations-Einstieg: Links auf alle Unterdokumente |
| `docs/starter-kit-usage/GETTING_STARTED.md` | Wie passe ich den Starter Kit für mein Projekt an? |
| `docs/starter-kit-usage/SCHEMA_RESET_WORKFLOW.md` | Schema ändern + DB zurücksetzen |
| `docs/starter-kit-usage/VSCODE_PORT_FORWARDING.md` | Demo mit VS Code Port Forwarding teilen |
| `docs/starter-kit-usage/REST_API_GUIDE.md` | REST API erklärt (Pizzeria-Analogie, für Studierende) |
| `docs/starter-kit-usage/LLM_INTEGRATION.md` | OpenAI/Together.ai nutzen |
| `docs/starter-kit-usage/EMAIL_INTEGRATION.md` | Resend nutzen (Outbound + Inbound) |
| `docs/starter-kit-usage/NEON_SETUP.md` | Optionale Cloud-Datenbank (Neon) |
| `docs/starter-kit-usage/UPLOADTHING_SETUP.md` | Optionaler Cloud-Upload (UploadThing) |
| `docs/starter-kit-usage/VERCEL_DEPLOYMENT.md` | Optionales Deployment auf Vercel |

---

## Schritt 6.3 – `README.md`

```markdown
# cas-prdig-starter-kit

Starter-Repo für den CAS Prozessdigitalisierung, ZHAW.

**Stack:** Next.js 16 · shadcn/ui · Better Auth · Prisma 7 + SQLite · OpenAI/Together.ai · Resend

---

## Setup (5 Schritte)

1. **Repository klonen:**
   ```bash
   git clone https://github.com/[user]/cas-prdig-starter-kit.git
   cd cas-prdig-starter-kit
   ```

2. **Dependencies installieren:**
   ```bash
   npm install
   npx playwright install chromium
   ```

3. **Umgebungsvariablen einrichten:**
   ```bash
   cp .env.example .env
   # .env öffnen und Werte eintragen (BETTER_AUTH_SECRET, API-Keys)
   ```

4. **Datenbank einrichten:**
   ```bash
   npm run db:reset
   ```
   → Erstellt die SQLite-Datenbank und lädt Demo-Daten

5. **App starten:**
   ```bash
   npm run dev
   ```
   → http://localhost:3000

---

## Testlogins

| Rolle | E-Mail | Passwort |
|---|---|---|
| Admin | `admin@example.com` | `a` |
| Antragsteller | `applicant@example.com` | `a` |
| Prüfer | `reviewer@example.com` | `a` |

---

## Hilfreiche Befehle

| Befehl | Zweck |
|---|---|
| `npm run db:push` | Schema in DB übernehmen (ohne Reset) |
| `npm run db:seed` | Testdaten laden |
| `npm run db:reset` | DB zurücksetzen + Testdaten laden |
| `npm run db:studio` | Prisma Studio (DB-Browser) |
| `npm run test` | Unit Tests (Vitest) |
| `npm run test:watch` | Unit Tests im Watch-Modus |
| `npm run test:e2e` | E2E Tests (Playwright, headless) |
| `npm run test:e2e:ui` | E2E Tests visuell |

---

## Dokumentation
Ab hier steht jeweils docs/..., aber eigentlich ist es docs/starter-kit-usage

- [`docs/INDEX.md`](docs/INDEX.md) – Dokumentations-Einstieg (alle Guides)
- [`docs/GETTING_STARTED.md`](docs/GETTING_STARTED.md) – Starter Kit für eigenes Projekt anpassen
- [`KILO_INSTRUCTIONS.md`](KILO_INSTRUCTIONS.md) – Coding-Guide für Kilo Code
- [`AGENTS.md`](AGENTS.md) – Projektkontext (TODO: anpassen)

---

## Nächste Schritte nach dem Setup

1. [`docs/GETTING_STARTED.md`](docs/GETTING_STARTED.md) lesen: Starter Kit für euren Prozess anpassen
2. `AGENTS.md` öffnen und alle `[TODO]`-Einträge ausfüllen
3. Mit Kilo Code Features implementieren (PIV-Loop: Plan → Implement → Validate)
```

---

## Schritt 6.4a – `docs/INDEX.md` (Dokumentations-Einstieg)

```markdown
# Dokumentation – CAS Starter Kit

Willkommen! Diese Seite führt zu allen Dokumenten des Starter Kits.

---

## Für den Einstieg

| Dokument | Inhalt |
|---|---|
| [`../README.md`](../README.md) | Setup in 5 Schritten |
| [`GETTING_STARTED.md`](GETTING_STARTED.md) | Starter Kit für eigenes Projekt anpassen |
| [`../KILO_INSTRUCTIONS.md`](../KILO_INSTRUCTIONS.md) | Coding-Guide für Kilo Code |
| [`../AGENTS.md`](../AGENTS.md) | Projektkontext (TODO: anpassen) |

---

## Implementierungsanleitungen (wie wurde was gebaut)

| Dokument | Inhalt | Status |
|---|---|---|
| [`impl-01-basics.md`](impl-01-basics.md) | Phase 0–4: Setup, DB, Auth, UI | ✅ Umgesetzt |
| [`impl-02-rest-api.md`](impl-02-rest-api.md) | REST API mit Route Handlers + Zod | ✅ Umgesetzt |
| [`impl-03-testing.md`](impl-03-testing.md) | Vitest + Playwright | ✅ Umgesetzt |
| [`impl-04-ai-coding-instructions.md`](impl-04-ai-coding-instructions.md) | KILO_INSTRUCTIONS, AGENTS, .kiloignore | ✅ Umgesetzt |
| [`impl-05-file-upload.md`](impl-05-file-upload.md) | Dateiupload + PDF-Anzeige | ⬜ Ausstehend |
| [`impl-06-email.md`](impl-06-email.md) | E-Mail Outbound + Inbound (Resend) | ⬜ Ausstehend |
| [`impl-07-ai.md`](impl-07-ai.md) | LLM-Chat + Dokumentenanalyse | ⬜ Ausstehend |

---

## Technische Guides (für Studierende)

| Dokument | Inhalt |
|---|---|
| [`REST_API_GUIDE.md`](REST_API_GUIDE.md) | REST API erklärt mit Pizzeria-Analogie |
| [`SCHEMA_RESET_WORKFLOW.md`](SCHEMA_RESET_WORKFLOW.md) | Datenbank-Schema ändern |
| [`VSCODE_PORT_FORWARDING.md`](VSCODE_PORT_FORWARDING.md) | App für Demos öffentlich zugänglich machen |
| [`LLM_INTEGRATION.md`](LLM_INTEGRATION.md) | KI-Features nutzen (OpenAI/Together.ai) |
| [`EMAIL_INTEGRATION.md`](EMAIL_INTEGRATION.md) | E-Mails senden und empfangen (Resend) |

---

## Optionale Cloud-Variante

| Dokument | Inhalt |
|---|---|
| [`NEON_SETUP.md`](NEON_SETUP.md) | SQLite → PostgreSQL (Neon) |
| [`UPLOADTHING_SETUP.md`](UPLOADTHING_SETUP.md) | Lokaler Upload → UploadThing |
| [`VERCEL_DEPLOYMENT.md`](VERCEL_DEPLOYMENT.md) | Deployment auf Vercel |
```

---

## Schritt 6.4b – `docs/GETTING_STARTED.md`

```markdown
# Getting Started – Starter Kit für eigenes Projekt anpassen

Dieses Dokument erklärt, welche Teile des Starter Kits angepasst werden müssen,
um es für euren eigenen Digitalisierungsprozess zu nutzen.

---

## 1. Projektkontext definieren

### `AGENTS.md` anpassen
Öffne `AGENTS.md` und ersetze alle `[TODO]`-Einträge:
- Projektbeschreibung: Was digitalisiert ihr? Welcher Prozess?
- Rollen anpassen: Eigene Rollenbezeichnungen eintragen (oder bei `admin`/`user_applicant`/`user_reviewer` bleiben)
- Scope definieren: Was ist im / ausserhalb des Scope?
- Team-Info ergänzen

---

## 2. Datenmodell anpassen

Die Demo-Entitäten `Antrag` und `Person` sind Platzhalter. Ihr könnt:

### Option A: Bestehende Entitäten umbenennen
Beispiel: `Antrag` → `Bestellung`, `Person` → `Lieferant`
1. In `prisma/schema.prisma` umbenennen
2. Alle Vorkommen in `src/` suchen und ersetzen (`Antrag` → `Bestellung`, etc.)
3. `npm run db:reset` ausführen

### Option B: Neue Entitäten hinzufügen
1. Neues Model in `prisma/schema.prisma` definieren
2. `npm run db:reset` ausführen
3. Schema `src/lib/schemas/[entitaet].ts` erstellen
4. Server Actions `src/app/(app)/[entitaet]/actions.ts` erstellen
5. Seiten `src/app/(app)/[entitaet]/` erstellen
6. Navigation `src/lib/navigation.ts` ergänzen

### Option C: Bestehende Entitäten erweitern
Neue Felder zu `Antrag` oder `Person` hinzufügen:
1. In `prisma/schema.prisma` Feld ergänzen
2. Zod-Schema in `src/lib/schemas/` anpassen
3. Formular-Komponente anpassen
4. `npm run db:reset`

---

## 3. Status-Workflow anpassen

Der `AntragStatus`-Enum definiert die möglichen Zustände:
- Standard: `ENTWURF → EINGEREICHT → GENEHMIGT/ABGELEHNT`
- Anpassen in `prisma/schema.prisma` (Enum `AntragStatus`)
- Übergänge anpassen in `src/lib/antrag-status.ts`

---

## 4. Rollen anpassen

Die 3 Standardrollen sind: `admin`, `user_applicant`, `user_reviewer`

Wenn ihr andere Rollennamen möchtet:
1. `prisma/schema.prisma` – Default-Wert bei `User.role` ändern
2. `src/lib/auth.ts` – `defaultValue` ändern
3. `src/middleware.ts` und `src/lib/auth-helpers.ts` – Rollennamen aktualisieren
4. `prisma/seed.ts` – Seed-Nutzer anpassen

> **Achtung:** Rollen-String-Werte müssen in allen Dateien konsistent sein.

---

## 5. UI anpassen

### Farben
`src/app/globals.css` – CSS-Variablen für shadcn/ui Farben anpassen.

### Sprache / Texte
Alle UI-Texte sind auf Deutsch. Suchen und Ersetzen in `src/` für Textanpassungen.

### Navigation
`src/lib/navigation.ts` – Nav-Items hinzufügen/entfernen/umbenennen.

---

## 6. Umgebungsvariablen setzen

`.env` befüllen:
```env
BETTER_AUTH_SECRET="zufälliger-32-zeichen-string"  # openssl rand -hex 16
RESEND_API_KEY="re_..."                              # https://resend.com
OPENAI_API_KEY="sk-..."                              # optional: https://openai.com
TOGETHERAI_API_KEY="..."                             # optional: https://api.together.ai
```

---

## 7. Erstes Feature bauen (Kilo Code)

1. `TASKS.md` öffnen → neue Task anlegen
2. Kilo Code öffnen → Architect-Modus
3. Task beschreiben: «Implementiere [Feature] gemäss TASKS.md»
4. Kilo Code erstellt Plan → bestätigen → implementieren
5. `npm run test` → grün?
6. `npm run dev` → manuell testen?
7. Committen: `git commit -m "feat: [Feature]"`
```

---

## Schritt 6.4c – `docs/SCHEMA_RESET_WORKFLOW.md`

```markdown
# Schema-Reset-Workflow

Dieser Workflow wird benötigt, wenn das Prisma-Schema geändert wird.

> ⚠️ **Alle Daten in der lokalen Datenbank werden gelöscht!**
> Sicherstellen, dass alle wichtigen Daten in `prisma/seed.ts` gespeichert sind.

## Wann nötig?

- Neues Model hinzugefügt
- Feld zu bestehendem Model hinzugefügt oder entfernt
- Enum-Werte geändert
- Relation hinzugefügt oder geändert

## Schritte

1. **Schema anpassen** – `prisma/schema.prisma` bearbeiten
2. **seed.ts prüfen** – Neue Testdaten für neue Felder/Models ergänzen
3. **Datenbank zurücksetzen:**
   ```bash
   npm run db:reset
   ```
   Dies führt aus:
   - `prisma db push --force-reset` (DB löschen + Schema einlesen)
   - `prisma generate` (Client-Code neu generieren)
   - `tsx prisma/seed.ts` (Testdaten laden)

4. **Verifikation:**
   ```bash
   npm run db:studio   # DB-Inhalte prüfen
   npm run dev         # App starten und testen
   ```

## Im Team

Wenn ihr in einer Gruppe arbeitet:
1. Schema-Änderung committen und pushen
2. Alle Team-Mitglieder führen `npm run db:reset` aus (jeder hat seine eigene lokale DB)
```

---

## Schritt 6.4d – `docs/VSCODE_PORT_FORWARDING.md`

```markdown
# VS Code Port Forwarding – App für Demos teilen

Ermöglicht, die lokal laufende App für andere Laptops und das Publikum zugänglich zu machen.

> **Voraussetzung:** VS Code mit GitHub-Account (für Dev Tunnels)  
> Referenz: `impl-00-tech-stack-decisions.md` → Abschnitt 3

## Schritte

1. **App starten:**
   ```bash
   npm run dev
   ```

2. **Port Forwarding öffnen:**
   - VS Code → Terminal-Panel → Tab **«Ports»** öffnen
   - Oder: `Ctrl+Shift+P` → «Forward a Port»

3. **Port weiterleiten:**
   - «Forward Port» klicken → Port `3000` eingeben → Enter

4. **Öffentlich machen:**
   - In der Ports-Liste: Rechtsklick auf Port 3000 → **«Port Visibility» → «Public»**

5. **URL teilen:**
   - Generierte URL (z.B. `https://abc123-3000.devtunnels.ms`) kopieren und teilen
   - Diese URL ist so lange aktiv, wie VS Code offen und der Dev-Server läuft

## Mehrere Dienste

Für mehrere Ports (z.B. Frontend 3000 + Webhook-Endpoint für Resend):
- Beide Ports können gleichzeitig im Ports-Tab weitergeleitet werden
- Jeder Port erhält eine eigene URL

## Gültigkeitsdauer

Die URL ist **session-gebunden**: Aktiv solange VS Code offen und App läuft.
Beim nächsten Start entsteht eine neue URL. Für Demo-Sessions von 30–60 Minuten ist die Stabilität gut (Laptop nicht in Ruhezustand versetzen).

## Fallback: Localtunnel

Falls VS Code Port Forwarding nicht funktioniert:
```bash
npx localtunnel --port 3000
```
Kein Download, kein Account nötig. Weniger stabil, aber ausreichend für kurze Demos.
```

---

## Schritt 6.4e – `docs/REST_API_GUIDE.md`

```markdown
# REST API – Erklärung und Nutzung

## Die Pizzeria-Analogie

Das REST API des Starter Kits funktioniert wie ein Restaurant:

| Restaurant | REST API |
|---|---|
| Speisekarte (URL) | `GET /api/antraege` |
| Kellner (Route Handler) | `src/app/api/antraege/route.ts` |
| Bestellprüfung (Zod) | Validiert ob die Bestellung gültig ist |
| Küche (Prisma) | Liest/schreibt die Datenbank |
| Rechnung (Response) | JSON zurück an den Client |

## Verfügbare Endpunkte

| Methode | URL | Beschreibung |
|---|---|---|
| GET | `/api/antraege` | Alle Anträge (eigene / alle je nach Rolle) |
| POST | `/api/antraege` | Neuen Antrag erstellen |
| GET | `/api/antraege/:id` | Einzelnen Antrag abrufen |
| PUT | `/api/antraege/:id` | Antrag aktualisieren |
| DELETE | `/api/antraege/:id` | Antrag löschen |

## Authentifizierung

Alle Endpunkte erfordern eine aktive Session (Cookies). Ohne Session: `401 Unauthorized`.

## HTTP Status Codes

| Code | Bedeutung |
|---|---|
| 200 OK | Anfrage erfolgreich |
| 201 Created | Ressource erstellt |
| 400 Bad Request | Ungültige Daten (Zod-Fehler) |
| 401 Unauthorized | Nicht eingeloggt |
| 403 Forbidden | Keine Berechtigung |
| 404 Not Found | Nicht gefunden |
| 500 Server Error | Interner Fehler |

## Mit curl testen

```bash
# Alle Anträge abrufen (mit Session-Cookie aus Browser)
curl http://localhost:3000/api/antraege \
  -H "Cookie: better-auth.session_token=<dein-token>"

# Neuen Antrag erstellen
curl -X POST http://localhost:3000/api/antraege \
  -H "Cookie: better-auth.session_token=<dein-token>" \
  -H "Content-Type: application/json" \
  -d '{"titel":"Mein Test-Antrag","beschreibung":"Erstellt via API"}'
```

Session-Token herausfinden: Browser → DevTools → Application → Cookies → `better-auth.session_token`
```

---

## Schritt 6.4f – Weitere Guides (Kurzform)

Die verbleibenden Guides `LLM_INTEGRATION.md`, `EMAIL_INTEGRATION.md`, `NEON_SETUP.md`, `UPLOADTHING_SETUP.md` und `VERCEL_DEPLOYMENT.md` verweisen jeweils auf die zugehörigen `impl-0X.md`-Dokumente und die Tech-Stack-Review-Datei.

**`docs/LLM_INTEGRATION.md`** → verweist auf `docs/impl-07-ai.md`  
**`docs/EMAIL_INTEGRATION.md`** → verweist auf `docs/impl-06-email.md`  
**`docs/NEON_SETUP.md`** → verweist auf Tech-Stack-Review Abschnitt 1 (Option B: Neon) + Prisma-Adapter-Anpassung  
**`docs/UPLOADTHING_SETUP.md`** → verweist auf Tech-Stack-Review Abschnitt 5 (Cloud-Variante) + `impl-05-file-upload.md`  
**`docs/VERCEL_DEPLOYMENT.md`** → verweist auf Tech-Stack-Review Abschnitt 3 + 7 (Variante 2)

Diese Guides enthalten je:
- Link auf die ausführliche Implementierungsanleitung
- Setup-Checkliste (5–10 Schritte)
- ENV-Variablen die benötigt werden

---

## Akzeptanzkriterien

- [ ] `README.md` enthält Setup in 5 Schritten, Testlogins, Befehle-Tabelle
- [ ] `docs/INDEX.md` listet alle Dokumente mit Status
- [ ] `docs/GETTING_STARTED.md` erklärt alle Anpassungspunkte
- [ ] `docs/SCHEMA_RESET_WORKFLOW.md` enthält klaren Schritt-für-Schritt-Ablauf
- [ ] `docs/VSCODE_PORT_FORWARDING.md` erklärt Port Forwarding für Demos
