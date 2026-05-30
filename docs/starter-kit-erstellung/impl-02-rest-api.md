# Teil 2: REST API – Native Route Handlers (Phase 5.1)

> **Hauptdokument:** `impl-00-einstieg.md` → Abschnitt B4, Phase 5.1  
> **Tech-Stack-Entscheidungen:** `impl-00-tech-stack-decisions.md`
> - Framework-Entscheidung → Abschnitt 6 (Next.js App Router)
>
> **Voraussetzungen:** Teil 1 (impl-01-basics.md) vollständig umgesetzt  
> **Quelle:** Detaillierter Plan in `cas-crm-mock/docs/2026-05-08_phase5-1-plan.md`

---

## Ziel

RESTful API-Endpunkte für die Entität `Antrag` mit Zod-Validation als Lernmuster für Studierende.

## Abgrenzung

Route Handler sind **ergänzend** zu den bestehenden Server Actions (`actions.ts`). Sie dienen als Muster für externe Clients. Die UI bleibt auf Server Actions aufgebaut.

---

## Status Quo (nach Teil 1)

- `src/lib/schemas/antrag.ts` ✅ (`antragCreateSchema`, `antragUpdateSchema`)
- `src/lib/auth-helpers.ts` ✅ (`getSession`, `requireSession`, `requireRole`)
- `src/lib/prisma.ts` ✅ (Prisma-Singleton)
- `src/app/(app)/antraege/actions.ts` ✅ (Server Actions für UI)
- `src/app/api/auth/[...all]/route.ts` ✅ (Better Auth)
- `src/middleware.ts` ✅ (schützt Routen)
- `src/app/api/antraege/*` ❌ noch nicht vorhanden

---

## Schritt 5.1.1 – Zod-Schema erweitern

**Datei:** `src/lib/schemas/antrag.ts` (ergänzen)

`antragIdSchema = z.string().cuid()` hinzufügen – wird für Parameter-Validation in `[id]/route.ts` benötigt.

---

## Schritt 5.1.2 – Route Handler `GET /api/antraege` + `POST /api/antraege`

**Datei:** `src/app/api/antraege/route.ts` (neu erstellen)

> ⚠️ **Wichtig:** In Route Handlern **nicht** `requireSession()` verwenden! Diese Funktion ruft `redirect('/login')` auf (HTML-Redirect), was für eine JSON-API ungeeignet ist. Stattdessen `getSession()` nutzen und bei fehlender Session `NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })` zurückgeben.

**GET-Logik:**
1. Session via `getSession()` holen. Ohne Session → 401
2. Rollenbasierte Query: `user_applicant` sieht nur eigene; `admin`/`user_reviewer` sehen alle
3. `prisma.antrag.findMany({ where: ..., include: { ersteller: { select: { name: true, email: true } } }, orderBy: { erstelltAm: 'desc' } })`
4. `NextResponse.json(antraege)`

**POST-Logik:**
1. Session via `getSession()`. Ohne Session → 401
2. Rollenprüfung: nur `user_applicant` oder `admin` dürfen erstellen → sonst 403
3. Body parsen: `const result = antragCreateSchema.safeParse(await req.json())`
4. Bei Fehler: `NextResponse.json({ error: 'Ungültige Daten', details: result.error.errors }, { status: 400 })`
5. `prisma.antrag.create({ data: { ...result.data, erstellerId: session.user.id } })`
6. `NextResponse.json(antrag, { status: 201 })`

**Erwartete Responses:**
- `GET /api/antraege` mit Cookie → 200 JSON-Liste
- `POST /api/antraege` mit gültigem Body + Cookie → 201 erstelltes Objekt
- `POST /api/antraege` mit ungültigem Body → 400 mit Fehlermeldung
- Ohne Cookie → 401 JSON (kein HTML-Redirect)

---

## Schritt 5.1.3 – Route Handler `GET/PUT/DELETE /api/antraege/:id`

**Datei:** `src/app/api/antraege/[id]/route.ts` (neu erstellen)

> ⚠️ **Next.js 16: `params` ist ein Promise!** Seit Next.js 15+ gilt:
> ```typescript
> export async function GET(
>   request: NextRequest,
>   { params }: { params: Promise<{ id: string }> }
> ) {
>   const { id } = await params
>   // ...
> }
> ```
> Das gilt für ALLE Methoden (GET, PUT, DELETE) in diesem File.

**GET-Logik:**
1. Session via `getSession()`. Ohne → 401
2. `const { id } = await params`; `antragIdSchema.safeParse(id)` validieren → ungültig: 400
3. `prisma.antrag.findUnique({ where: { id }, include: { ersteller: { select: { name: true } } } })`
4. Nicht gefunden → 404; `user_applicant` darf nur eigene sehen → sonst 403
5. Gefunden → `NextResponse.json(antrag)`

**PUT-Logik:**
1. Session + `params` validieren
2. `user_applicant` nur eigene + nur `ENTWURF`; `admin` alles; `user_reviewer` via PUT nicht erlaubt → 403
3. Body via `antragUpdateSchema.safeParse(await req.json())`
4. `prisma.antrag.update({ where: { id }, data: result.data })`
5. `NextResponse.json(antrag)`

**DELETE-Logik:**
1. Session + `params` validieren
2. Admin immer; `user_applicant` nur eigene + nur `ENTWURF` → sonst 403
3. `prisma.antrag.delete({ where: { id } })`
4. `NextResponse.json({ message: 'Gelöscht' })`

**Einheitliche Fehlerbehandlung (alle Methoden):**
```typescript
// Am Ende jeder Handler-Funktion im catch-Block:
if (error instanceof z.ZodError) {
  return NextResponse.json({ error: 'Ungültige Daten', details: error.errors }, { status: 400 })
}
if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
  return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
}
return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
```

---

## Schritt 5.1.4 – Middleware anpassen

**Datei:** `src/middleware.ts`

`PUBLIC_PATHS` um `/api/antraege` erweitern:
```typescript
const PUBLIC_PATHS = ['/login', '/api/auth', '/api/antraege']
```

**Begründung:** Die Middleware leitet auf `/login` um (HTML-Redirect). Für API-Clients ist das unbrauchbar. Die Route Handler prüfen die Session selbst via `getSession()` und geben korrekte 401/403 JSON-Antworten zurück.

---

## Schritt 5.1.5 – Authz-Regeln (Übersicht)

| Aktion | Erlaubt für |
|---|---|
| `GET /api/antraege` | Alle Rollen (applicant sieht nur eigene) |
| `POST /api/antraege` | `user_applicant`, `admin` |
| `GET /api/antraege/:id` | Alle Rollen (applicant nur eigene) |
| `PUT /api/antraege/:id` | Eigentümer (nur ENTWURF) + `admin` |
| `DELETE /api/antraege/:id` | Eigentümer (nur ENTWURF) + `admin` |

---

## Schritt 5.1.6 – Smoke-Test

Nach Implementierung:
```bash
npm run build  # muss fehlerfrei kompilieren
npm run dev    # Server starten
```

Dann im Browser oder mit `curl` testen:

```bash
# 1. Ohne Cookie → 401 JSON (kein Redirect)
curl http://localhost:3000/api/antraege

# 2. Mit Cookie (aus Browser DevTools kopieren) → 200 JSON-Liste
curl http://localhost:3000/api/antraege -H "Cookie: better-auth.session_token=..."

# 3. POST mit ungültigem Body → 400 Bad Request
curl -X POST http://localhost:3000/api/antraege \
  -H "Cookie: better-auth.session_token=..." \
  -H "Content-Type: application/json" \
  -d '{"titel":""}'

# 4. DELETE fremder Antrag als applicant → 403 Forbidden
curl -X DELETE http://localhost:3000/api/antraege/<fremde-id> \
  -H "Cookie: applicant-session-token..."
```

---

## Betroffene Dateien

| Datei | Aktion |
|---|---|
| `src/app/api/antraege/route.ts` | Neu erstellen |
| `src/app/api/antraege/[id]/route.ts` | Neu erstellen |
| `src/lib/schemas/antrag.ts` | Ergänzen: `antragIdSchema` |
| `src/middleware.ts` | Anpassen: `PUBLIC_PATHS` |

---

## Nächste Schritte

- **Teil 3** (Testing): `docs/impl-03-testing.md`
- **Teil 5** (Dateiupload): `docs/impl-05-file-upload.md`
