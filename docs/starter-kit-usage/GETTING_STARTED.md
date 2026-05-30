# Getting Started – Starter Kit für eigenes Projekt anpassen

Dieses Dokument erklärt, welche Teile des Starter Kits angepasst werden müssen,
um es für euren eigenen Digitalisierungsprozess zu nutzen.

---

## 1. Projektkontext definieren

### `AGENTS.md` anpassen
Öffne `AGENTS.md` im Wurzelverzeichnis und ersetze alle `[TODO]`-Einträge:
- Projektbeschreibung: Was digitalisiert dieses Projekt? Welcher Prozess? Welches System wird gemockt?, usw.
- Rollen anpassen: Eigene Rollenbezeichnungen eintragen (oder bei `admin`/`user_applicant`/`user_reviewer` bleiben)
- Scope definieren: Was ist im / ausserhalb des Scope?
- Team-Info ergänzen

---

## 2. Datenmodell anpassen

Die Demo-Entitäten `Antrag` und `Person` sind Platzhalter. Ihr könnt euren AI Agent bitten, eine der folgenden Optionen durchzuführen (D ist für die meisten empfohlen):

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

### Option D: Bestehende Entitäten löschen
Damit es zu keiner Verwirrung kommt, lässt ihr die KI sowohl die Entitäten als auch zugehörigen Schemas, Server Actions, Seiten und Navigation löschen. In diesem Fall müssen auch die Status-Workflows gelöscht werden (siehe nächstes Kapitel).

---

## 3. Status-Workflow anpassen

Der `AntragStatus`-Enum definiert die möglichen Zustände:
- Standard: `ENTWURF → EINGEREICHT → GENEHMIGT/ABGELEHNT`
- Anpassen in `prisma/schema.prisma` (Enum `AntragStatus`)
- Übergänge anpassen in `src/lib/antrag-status.ts`

Auch hier ist es vermutlich sinnvoll den Enum ganz zu löschen.

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

## 7. Erstes Feature mit PIV bauen

Nutze für neue Features den PIV-Ablauf: Plan → Implement → Validate. Die ausführliche Anleitung steht in [`PIV-WORKFLOW.md`](PIV-WORKFLOW.md).

Kurzablauf:

1. `/prime` ausführen, um Projektkontext zu laden.
2. `/plan-feature "[Feature-Beschreibung]"` ausführen.
3. Die erzeugte Datei `docs/project/features/[feature-name]/plan.md` prüfen und bestätigen.
4. In einer neuen Agent-Session erneut  `/prime` ausführen, dann `/execute docs/project/features/[feature-name]/plan.md` ausführen.
5. Nach jedem Task validieren: `npm run test` und manuelle Prüfung mit `npm run dev`.
6. Wenn alle Tasks `done` sind: `/commit` verwenden.

`TASKS.md` ist nur ein Feature-Index. Detailtasks und Validierung liegen immer in der jeweiligen Datei `docs/project/features/[feature-name]/plan.md`.
