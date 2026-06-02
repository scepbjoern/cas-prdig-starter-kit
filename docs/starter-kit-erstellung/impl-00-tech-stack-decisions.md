# Tech-Stack-Review: ZHAW CAS Agentic Coding – Starter-Repo
**Version 2 | Mai 2026 | Kontext:** CAS Prozessdigitalisierung, Nicht-Softwareingenieure, Kilo Code + OpenRouter

---

## Abschnitt 0: Executive Summary

| Komponente | Bisherig (H25) | Empfehlung (2026) | Begründung (1 Satz) |
|---|---|---|---|
| **Datenbank lokal** | Supabase Cloud (PostgreSQL) | **SQLite via Prisma** (`db push`) | Kein Account, kein Setup, funktioniert offline, ideal für Prototypen |
| **Datenbank Deployment** | Supabase Cloud | **Neon** (serverless PostgreSQL) | Kein Pausing, grosszügiger Free Tier, direkter Prisma-Drop-in |
| **ORM** | Prisma (mit Migrations) | **Prisma 7** (`db push` + Seed-Datei) | Alle Vercel-Bugs gelöst; `db push` und gemeinsame Seed-Datei eliminieren Komplexität |
| **Auth** | Supabase Auth | **Better Auth** (lokal, no-cloud) | Vollständig lokal, RBAC als Plugin, TypeScript-first, für Demo-Rollen geeignet |
| **Deployment** | Vercel (Pflicht) | **Lokal + VS Code Port Forwarding** (Vercel optional, Cloud-Variante) | Eliminiert Deployment-Overhead; Port Forwarding verbindet Laptops für parallele Demos |

---

## Abschnitt 1: Datenbankentscheidung

### Option A: SQLite (lokal) ✅ Gewählt für lokale Entwicklung

SQLite ist die richtige Wahl für die lokale Entwicklungsumgebung im Kurs. Die Begründungen:

**Für Prototypen dieser Komplexität ausreichend?** Ja, vollständig. CRM-ähnliche Datenmodelle (Contacts, Companies, Events, Registrations, File-Referenzen) laufen problemlos auf SQLite. Die Datenbank ist für Lehrzwecke und Prototypen ohne Einschränkungen geeignet.

**Prisma-Kompatibilität:** Hervorragend. SQLite ist ein First-Class Citizen in Prisma 7 – kein Konfigurationsaufwand, keine Zusatz-Pakete, funktioniert out-of-the-box.

**Kein Cloud-Account, kein Setup:** Die Datenbank entsteht automatisch beim ersten `npx prisma db push` als lokale Datei (`prisma/dev.db`). Keine externen Abhängigkeiten, funktioniert offline.

**Team-Synchronisation – Schema und Testdaten:**

Das Schema wird über die `.prisma`-Datei in Git synchronisiert. Nach jedem `git pull` führt jedes Gruppenmitglied einmalig `npx prisma db push` aus, um die lokale DB zu aktualisieren. Wichtig ist zusätzlich, dass auch **Testdaten synchronisiert** werden, damit alle Gruppenmitglieder mit denselben Demo-Daten arbeiten:

- Eine gemeinsame `prisma/seed.ts`-Datei wird im Git-Repository gepflegt.
- Sie enthält alle Demo-Nutzer (inkl. Rollen wie `antragsteller`, `reviewer`), Beispieldatensätze und Referenzdaten.
- Jedes Mitglied führt `npm run db:seed` aus, um eine identische Ausgangslage zu erhalten.
- Änderungen an der Seed-Datei werden wie Code behandelt: commiten, pushen, alle ziehen die neue Version.

```json
// package.json scripts
"db:push": "prisma db push",
"db:seed": "tsx prisma/seed.ts",
"db:reset": "prisma db push --force-reset && tsx prisma/seed.ts",
"db:studio": "prisma studio"
```

**SQLite auf Vercel: Nicht persistierbar.** Vercel's Filesystem ist ephemeral – SQLite-Schreibzugriffe gehen nach jedem Function-Invocation-Neustart verloren. SQLite ist deshalb ausschliesslich für die lokale Entwicklung vorgesehen. Wer deployen möchte, wechselt auf Option B (Neon).

**Für Gruppenarbeit mit gleichzeitigem Zugriff:** SQLite unterstützt keine simultanen Schreibzugriffe von mehreren Personen auf dieselbe DB-Datei. Da aber jede Person ihre eigene lokale Instanz betreibt, ist das kein Problem – der Austausch findet über Git (Schema + Seed-Datei) statt, nicht über eine geteilte DB.

---

### Option B: Neon (serverless PostgreSQL) ✅ Für Gruppen mit Deployment-Bedarf

Für Gruppen, die ihre App auf einem Webserver betreiben möchten, ist Neon die empfohlene Datenbank-Alternative.

**Kein Pausing-Problem:** Neon skaliert auf Zero wenn keine Queries laufen, aber das geschieht automatisch und ohne manuelles Eingreifen. Der erste Query nach Inaktivität kann ~300–500 ms dauern, danach läuft die DB normal. Es gibt kein «Projekt pausiert»-Problem wie bei Supabase.

**Free Tier (Mai 2026):** 100 CU-Stunden/Monat (verdoppelt seit Oktober 2025), 0,5 GB Storage, bis zu 10 Projekte – für Kursprojekte grosszügig. Neon wurde 2025 von Databricks akquiriert; der Free Tier wurde seither verbessert, nicht verschlechtert.

**Prisma-Integration:** Standard-PostgreSQL-Adapter, kein Sondersetup. Einzige Anpassung: `provider = "postgresql"` im Prisma-Schema und die Neon-`DATABASE_URL` in `.env.production`.

**Wechsel von SQLite → Neon:** Minimaler Aufwand – nur `provider` und URL im Schema ändern. Das Datenmodell bleibt identisch, da Prisma die Abstraktion übernimmt. Wichtig: SQLite-spezifische Typen wie `Boolean` (in SQLite als Integer gespeichert) sind in PostgreSQL nativ vorhanden – der Wechsel ist reibungslos.

---

### Fazit Datenbankstrategie

| Phase | Empfehlung | Befehle zum Start |
|---|---|---|
| **Lokale Entwicklung** (Standard) | SQLite + `prisma db push` + Seed-Datei | `npx prisma db push && npm run db:seed` |
| **Optionales Deployment** (Cloud-Variante) | Neon (PostgreSQL) | Provider + URL in `.env.production` ändern |

---

## Abschnitt 2: ORM – Prisma weiterhin die richtige Wahl

Prisma bleibt die richtige ORM-Wahl für diesen Kurs. Die kritischen Probleme aus Herbst 2025 sind mit **Prisma 7** (veröffentlicht November 2025) gelöst:

- Die Rust Query Engine wurde durch reines TypeScript/WASM ersetzt. Das eliminiert alle Binary-Kompatibilitätsprobleme auf Vercel.
- Das Bundle schrumpfte von ~14 MB auf ~1,6 MB.
- Kein `prisma generate`-Problem beim Vercel-Deployment mehr.

**Migrations → `db push` für Prototypen:**  
Im Kurskontext wird `prisma db push` statt `prisma migrate dev` verwendet. Das bedeutet: kein Migrations-Verzeichnis, kein Migrations-History-Overhead, keine Konflikte bei schnellen Schema-Iterationen. Für Prototypen ist das ideal; für produktive Systeme würde man zu Migrations wechseln.

**Prisma Studio** bleibt ein zentrales Werkzeug für Nicht-Entwickler: `npx prisma studio` öffnet einen visuellen DB-Browser im Browser, über den Daten betrachtet und direkt bearbeitet werden können – ohne SQL-Kenntnisse.

**Seed-Datei als geteilte Testdaten-Grundlage:**  
Wie in Abschnitt 1 beschrieben, ist die `prisma/seed.ts` das zentrale Mittel zur Synchronisation von Testdaten im Team. Sie wird gemeinsam im Git-Repository gepflegt. Alle Nutzer – inklusive Demo-Rollen (z. B. `antragsteller`, `reviewer`) – werden über die Seed-Datei angelegt, sodass jedes Gruppenmitglied nach `npm run db:reset` eine identische, demo-fähige Ausgangslage hat.

```typescript
// prisma/seed.ts – Beispielstruktur
const users = [
  { email: 'admin@example.com',     name: 'Admin Benutzer',     role: 'admin'         },
  { email: 'applicant@example.com', name: 'Test Antragsteller', role: 'user_applicant'},
  { email: 'reviewer@example.com',  name: 'Test Prüfer',        role: 'user_reviewer' },
];
```

---

## Abschnitt 3: Deployment-Strategie

### Warum lokal first?

Der Vercel-Deployment-Prozess hat in Herbst 2025 unverhältnismässig viel Zeit gekostet (Environment Variables, Prisma-Kompatibilität, DIRECT_DATABASE_URL, Pooler-Konfiguration). Dieser Aufwand steht in keinem Verhältnis zum Mehrwert für Kurszwecke. Die Standardstrategie ist deshalb: **Lokal entwickeln, lokal präsentieren.**

### Demo-Szenario: Mehrere Laptops verbunden

Für realistische Prozess-Demos – bei denen z. B. Gruppenmitglied A einen REST-Service betreibt, der von Gruppenmitglied B's Webapp aufgerufen wird – reicht Screen Sharing allein nicht aus. Es ist wahrscheinlich notwendig, dass **mehrere Laptops parallel in Betrieb** sind, die miteinander verbunden sind. Genau dafür eignet sich VS Code Port Forwarding:

- Jedes Gruppenmitglied gibt seinen lokalen Port (z. B. 3000 für Frontend, 3001 für einen API-Service) über VS Code Port Forwarding frei.
- Die generierten öffentlichen URLs können von den anderen Laptops und vom Publikum aufgerufen werden.
- So kann live gezeigt werden, dass Nutzer A (Rolle: Antragsteller) und Nutzer B (Rolle: Reviewer) die gleiche App aus verschiedenen Browsern mit unterschiedlichen Rollen und Sichten nutzen.

### VS Code Port Forwarding ✅ Empfohlen

**Einrichtung** (kein Download, kein Account ausser GitHub für VS Code):
1. App läuft mit `npm run dev` auf `localhost:3000`.
2. VS Code → Terminal-Panel → Tab «Ports» öffnen.
3. «Forward Port» → Port `3000` eingeben.
4. Visibility auf **«Public»** setzen.
5. Generierte URL (z. B. `https://abc123-3000.devtunnels.ms`) an Publikum oder andere Laptops weitergeben.

**Gültigkeitsdauer der URL:** Die URL ist **session-gebunden** – sie ist aktiv, solange VS Code geöffnet ist und die App auf dem entsprechenden Port läuft. Es gibt keine feste Zeitbeschränkung (kein 60-Minuten-Ablauf). Wird VS Code geschlossen oder der Dev-Server gestoppt, wird die URL inaktiv. Beim nächsten Start entsteht in der Regel eine neue URL. Für Hackathon-Präsentationen (29.5.2026) ist die Stabilität über eine Demo-Session von 30–60 Minuten erfahrungsgemäss gut, solange der Laptop nicht in den Ruhezustand wechselt.

**Für mehrere Dienste** (z. B. Frontend auf 3000, API auf 4000): Beide Ports können gleichzeitig im Ports-Tab weitergeleitet werden.

### Alternative: Localtunnel (Fallback)

Falls VS Code Port Forwarding an einem bestimmten Gerät nicht funktioniert:
```bash
npx localtunnel --port 3000
```
Kein Download, kein Account nötig. Sofortige öffentliche URL. Weniger stabil, aber ausreichend für kurze Demos.

### Deployment auf Vercel

Vercel wird in der **Cloud-Variante** (Abschnitt 7, Variante 2) optional unterstützt. Details dazu in Abschnitt 1 (Neon) und Abschnitt 7. Vercel ist kein Bestandteil der Default-Variante.

---

## Abschnitt 4: Auth-Strategie

### Auth ist Pflichtbestandteil des Starter-Repos

Für Prozess-Demos ist Auth nicht optional, sondern ein Kernfeature: Nur mit verschiedenen Nutzerrollen lässt sich demonstrieren, dass ein Antragsteller andere Screens und Rechte hat als ein Reviewer. Das Starter-Repo enthält deshalb **Auth fix eingebaut**, mit vordefinierten Demo-Nutzern und Rollen, die über die Seed-Datei angelegt werden.

### Anforderungen

- Vollständig lokal betreibbar, kein Cloud-Account.
- Mindestens 2 vordefinierte Demo-Nutzer mit verschiedenen Rollen (z. B. `antragsteller`, `reviewer`).
- Rollenbasierte Zugriffskontrolle (RBAC): Verschiedene Screens, Daten und Rechte je nach Rolle.
- Einfach durch LLMs implementierbar (Kilo Code).

### Optionen im Vergleich: Better Auth vs. Auth.js v5

| Kriterium | Better Auth | Auth.js v5 |
|---|---|---|
| Lokaler Betrieb | ✅ Vollständig lokal | ✅ Vollständig lokal |
| RBAC built-in | ✅ Ja – dediziertes `access-control`-Plugin | ⚠️ Manuell – über JWT-Callbacks und Middleware |
| Demo-Nutzer vordefinieren | ✅ Über Seed-Datei + Prisma, straightforward | ✅ Über Seed-Datei + Prisma, etwas mehr Konfiguration |
| TypeScript-first | ✅ Durchgängig | ✅ Seit v5 stark verbessert |
| LLM-Trainingsdaten | ✅ Gut (v1 stabil seit früh 2025) | ✅ Sehr gut (langjähriger Standard) |
| Setup-Komplexität | ✅ Geringer – Plugin-Architektur | ⚠️ Mittel – RBAC via Callbacks erfordert mehr Boilerplate |
| Prisma-Integration | ✅ Nativer Prisma-Adapter | ✅ Nativer Prisma-Adapter (`@auth/prisma-adapter`) |
| SQLite-Support | ✅ | ✅ |
| Stabilität/Reife | ✅ v1 stabil | ✅ v5 stabil seit Ende 2024 |

**RBAC im Detail:**

*Better Auth* bietet ein dediziertes `access-control`-Plugin, das Rollen und Berechtigungen deklarativ definiert. Rollen können beim User-Objekt gespeichert und in Server Components, Middleware und Client Components abgefragt werden. Das ist für den Kurskontext direkt nutzbar.

*Auth.js v5* unterstützt RBAC über das `profile()`-Callback (Rollen aus der DB in den JWT-Token übertragen) und Middleware-Guards. Es funktioniert gut, erfordert aber mehr manuelles Setup. Die Dokumentation für RBAC ist umfangreich und LLMs kennen die Patterns gut.

**Empfehlung: Better Auth**

Better Auth ist die bessere Wahl für diesen Kurs, weil:
1. Das RBAC-Plugin die Rollenlogik deklarativ und LLM-generierbar macht.
2. Die Plugin-Architektur zusätzliche Features (z. B. Magic Links, MFA) modular ergänzt, ohne das Basis-Setup zu verkomplizieren.
3. Setup und Konfiguration mit weniger Boilerplate auskommen als Auth.js v5.

Auth.js v5 ist eine solide Alternative, wenn eine Gruppe das vorzieht (bessere LLM-Abdeckung durch langjährigen Standard). Beide Optionen sind vollständig lokal und erfüllen die Kernanforderungen.

### Vordefinierte Demo-Nutzer via Seed-Datei

Im Starter-Repo sind drei Demo-Nutzer per Seed vorgesehen:

| Nutzer | E-Mail | Passwort | Rolle |
|---|---|---|---|
| Admin | `admin@example.com` | `a` | `admin` |
| Antragsteller | `applicant@example.com` | `a` | `user_applicant` |
| Prüfer | `reviewer@example.com` | `a` | `user_reviewer` |

Diese Accounts werden bei `npm run db:seed` automatisch angelegt. Jedes Gruppenmitglied kann nach dem Seeding sofort mit beiden Rollen arbeiten.

---

## Abschnitt 5: File Storage

### File Storage ist Standardbestandteil

Für Geschäftsprozess-Prototypen ist das Hochladen und Referenzieren von Dateien (Antragsformulare, Bestätigungen, PDFs, Bilder) ein Standardfeature. File Storage wird deshalb im Starter-Repo **standardmässig eingebaut**.

### Lokale Variante: `public/uploads/` via Node.js

Für die lokale Entwicklung werden Dateien im Verzeichnis `public/uploads/` des Next.js-Projekts gespeichert. Diese Dateien sind über die öffentliche URL `/uploads/dateiname.pdf` abrufbar – ohne externe Abhängigkeiten, kein Cloud-Account.

**Wie funktioniert das technisch?**  
Next.js App Router unterstützt File Uploads über Route Handler nativ, mit Node.js's eingebautem `fs`-Modul. **Keine externe Library nötig**:

Der zurückgegebene Pfad (`/uploads/dateiname.pdf`) kann direkt als URL in der App und in der Datenbank gespeichert werden.

**Einschränkung für Vercel:** Vercel's Filesystem ist ephemeral – lokal hochgeladene Dateien persistieren nicht bei Serverless Deployments. Für die Cloud-Variante wird UploadThing eingesetzt.

### Cloud-Variante (Deployment): UploadThing

Für Gruppen, die ihr Projekt deployen, ist **UploadThing** die empfohlene Lösung:

- Native Next.js App Router Integration, sehr einfaches Setup.
- Kostenloses Tier für Kursprojekte ausreichend.
- Minimale Code-Änderung beim Wechsel von lokaler Lösung: Upload-Komponente und API Route tauschen, Rest der App bleibt gleich.

### Fazit File Storage

| Phase | Lösung | Aufwand |
|---|---|---|
| **Lokal** (Standard) | `public/uploads/` + Node.js `fs` | Kein Zusatzpaket, direkter Einstieg |
| **Cloud** (Deployment) | UploadThing | ~30 Minuten Setup, Cloud-Account nötig |

---

## Abschnitt 6: Übrige Stack-Komponenten

### Next.js App Router ✅ Weiterhin erste Wahl

Next.js bleibt der Standard für Full-Stack-Web-Apps in 2026. Die LLM-Abdeckung (Kilo Code, Claude, GPT) ist für Next.js App Router deutlich grösser als für Alternativen wie SvelteKit oder Remix. Das ist für Agentic Coding der entscheidende Faktor.

### Tailwind CSS + shadcn/ui ✅ Neue Standardwahl

**shadcn/ui** ersetzt DaisyUI als Standard-UI-Bibliothek. Begründung:

- LLMs generieren für shadcn/ui konsistent besseren und passenderen Code. shadcn/ui ist der de-facto Standard im Vercel/Next.js-Ökosystem und entsprechend stark in den Trainingsdaten der Modelle vertreten.
- shadcn/ui-Komponenten werden via CLI als lokale Dateien ins Projekt kopiert – kein «Black Box»-Verhalten, volle Kontrolle und Anpassbarkeit.
- Zugängliche, produktionsreife Komponenten (basierend auf Radix UI Primitives) out-of-the-box.

Das bestehende `cas-crm-mock`-Repo wird vollständig auf Tailwind + shadcn/ui umgestellt (kein DaisyUI-Kompromiss).

### React Hook Form + Zod ✅ Weiterhin Standard

Keine relevante Alternative hat sich 2026 durchgesetzt. Die Kombination bleibt Community-Standard für Next.js-Forms, gut dokumentiert und von LLMs sehr gut beherrschbar.

---

## Abschnitt 7: Empfohlener Stack – 2 Varianten

### Variante 1: «Lokal» – Standard für den Kurs ✅

**Ziel**: Von null auf eine laufende, demo-fähige App in unter 20 Minuten. Vollständig offline, keine Cloud-Accounts erforderlich.

| Komponente | Lösung | Warum |
|---|---|---|
| Framework | Next.js 15 (App Router) | Beste LLM-Unterstützung, Full-Stack in einem Projekt |
| Styling | Tailwind CSS + shadcn/ui | LLMs generieren besten Code, poliertes UI, Radix-Accessibility |
| Formulare/Validierung | React Hook Form + Zod | Community-Standard, sehr gut von LLMs beherrschbar |
| Icons | Lucide Icons | shadcn/ui-kompatibel, leichtgewichtig |
| ORM | Prisma 7 (`db push`) | Studio, deklarative Schema-Sprache, Vercel-Bugs gelöst |
| Datenbank | **SQLite** (lokal, `prisma/dev.db`) | Zero-Setup, offline, kein Account, `npx prisma db push` |
| Auth | **Better Auth** (lokal) | Kein Cloud-Account, RBAC-Plugin, Demo-Nutzer via Seed |
| File Storage | **`public/uploads/`** + Node.js `fs` | Zero-Dependency, kein Account, sofort nutzbar |
| Deployment | **Keines** – lokal only | Eliminiert H25-Overhead vollständig |
| Demo/Präsentation | **VS Code Port Forwarding** | Built-in, zero-install, mehrere Laptops verbindbar |
| Versionskontrolle | GitHub | Standard |

**Setup-Befehle (5 Schritte)**:
```bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
npx shadcn@latest init
npm install prisma @prisma/client better-auth
npx prisma init --datasource-provider sqlite
# Prisma Schema + Auth-Schema anpassen, dann:
npx prisma db push && npm run db:seed
npm run dev
```

---

### Variante 2: «Cloud» – Für Gruppen mit Deployment-Bedarf

**Ziel**: Identischer Stack wie Variante 1, aber mit persistenter Cloud-Datenbank, Cloud-Dateiupload und öffentlichem Deployment auf Vercel.

Alle Komponenten bleiben gleich wie in Variante 1, mit diesen drei Änderungen:

| Komponente | Variante 1 (Lokal) | Variante 2 (Cloud) |
|---|---|---|
| **Datenbank** | SQLite (`file:./dev.db`) | **Neon** (serverless PostgreSQL) |
| **File Storage** | `public/uploads/` + Node.js `fs` | **UploadThing** |
| **Deployment** | Lokal / VS Code Port Forwarding | **Vercel** |

**Prisma-Anpassung** für den Wechsel auf Neon:
```diff
# prisma/schema.prisma
datasource db {
-  provider = "sqlite"
-  url      = "file:./dev.db"
+  provider = "postgresql"
+  url      = env("DATABASE_URL")
}
```

Die restliche App-Logik, Auth, UI und alle Geschäftslogik-Schichten bleiben unverändert.

---

## Abschnitt 8: Migrations-Hinweise für cas-crm-mock

### Was muss am bestehenden Repo geändert werden?

#### 1. Datenbank: Supabase Cloud → SQLite

```diff
# prisma/schema.prisma
datasource db {
-  provider  = "postgresql"
-  url       = env("DATABASE_URL")
-  directUrl = env("DIRECT_DATABASE_URL")
+  provider = "sqlite"
+  url      = "file:./dev.db"
}
```

- Supabase-spezifische Typen wie `@db.Text` entfernen (in SQLite nicht nötig).
- RLS-Policies entfallen vollständig (keine Entsprechung in SQLite).
- `.env` vereinfacht sich erheblich: kein `SUPABASE_URL`, kein `SUPABASE_ANON_KEY`, kein `DIRECT_DATABASE_URL`.

#### 2. ORM: Migrations → `db push` + Seed-Datei

- `prisma/migrations/`-Verzeichnis entfernen oder in `.gitignore` aufnehmen.
- `prisma/seed.ts` neu erstellen mit Demo-Nutzern und Testdaten.
- `package.json` Scripts ergänzen:
```json
"db:push": "prisma db push",
"db:seed": "tsx prisma/seed.ts",
"db:reset": "prisma db push --force-reset && tsx prisma/seed.ts",
"db:studio": "prisma studio"
```
- Prisma auf Version 7 updaten: `npm install prisma@latest @prisma/client@latest`.

#### 3. Auth: Supabase Auth → Better Auth

- `@supabase/supabase-js` aus den Dependencies entfernen.
- `npm install better-auth` installieren.
- `lib/auth.ts` neu erstellen (Better Auth Konfiguration mit Prisma-Adapter).
- Middleware (`middleware.ts`) für Route-Schutz anpassen.
- Login/Logout-Komponenten ersetzen (LLM-gestützt: ~30–60 Minuten).
- Demo-Nutzer in `prisma/seed.ts` anlegen.

#### 4. File Storage: Supabase Storage → `public/uploads/`

- `@supabase/storage-js`-Imports entfernen.
- Upload-Route Handler (`app/api/upload/route.ts`) neu erstellen mit Node.js `fs` (wie in Abschnitt 5 beschrieben).
- `public/uploads/`-Verzeichnis anlegen, `.gitkeep` hinzufügen.
- `.gitignore` ergänzen: `public/uploads/*` (hochgeladene Dateien nicht committen, nur das leere Verzeichnis).

#### 5. UI: DaisyUI → shadcn/ui

- `npm uninstall daisyui`
- `tailwind.config.ts` bereinigen (DaisyUI-Plugin-Eintrag entfernen).
- `npx shadcn@latest init` ausführen.
- Bestehende DaisyUI-Klassen (`btn`, `card`, `modal`, etc.) schrittweise durch shadcn/ui-Komponenten ersetzen.
- LLM-gestützte Migration: Pro Seite/Komponente die Klassen beschreiben lassen und shadcn/ui-Äquivalent generieren.

#### Geschätzter Gesamtaufwand für Migration
- Erfahrener Entwickler: ~4–8 Stunden.
- Mit LLM-Unterstützung (Kilo Code): ~2–4 Stunden.
- Empfehlung: Als neues Starter-Repo aufbauen statt altes Repo migrieren – sauberer und schneller.

---

*Recherche-Grundlage: Aktuelle Dokumentationen (Neon, Prisma 7, Better Auth, Auth.js v5, VS Code Dev Tunnels, UploadThing, shadcn/ui), Community-Diskussionen (r/nextjs, r/webdev), Benchmark- und Review-Artikel (März–Mai 2026). Stand: Mai 2026.*
