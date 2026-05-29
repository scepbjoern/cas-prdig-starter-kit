# REST API – Erklärung und Nutzung

## Was ist eine REST API?

Eine REST API ist eine Schnittstelle, über die externe Programme (z. B. eine mobile App, ein anderes Backend oder ein Test-Tool) mit einer Webanwendung kommunizieren können – ohne eine HTML-Seite aufzurufen.

Statt einer Webseite gibt die API strukturierte **JSON-Daten** zurück. Anfragen werden über **HTTP-Methoden** unterschieden:

| HTTP-Methode | Bedeutung |
|---|---|
| `GET` | Daten lesen |
| `POST` | Neuen Eintrag erstellen |
| `PUT` | Bestehenden Eintrag ersetzen/aktualisieren |
| `DELETE` | Eintrag löschen |

## Verfügbare Endpunkte

| Methode | URL | Beschreibung |
|---|---|---|
| `GET` | `/api/antraege` | Alle eigenen Anträge abrufen (Admin: alle) |
| `POST` | `/api/antraege` | Neuen Antrag erstellen |
| `GET` | `/api/antraege/:id` | Einzelnen Antrag abrufen |
| `PUT` | `/api/antraege/:id` | Antrag aktualisieren |
| `DELETE` | `/api/antraege/:id` | Antrag löschen |

---

## Authentifizierung: Wie funktioniert das?

Die API ist **nicht öffentlich** – jede Anfrage muss mit einer gültigen Anmeldesitzung versehen sein. Ohne Anmeldung gibt die API `401 Unauthorized` zurück.

Die Anmeldung läuft über einen **Session-Cookie**. Wenn du dich im Browser auf der App anmeldest, speichert der Browser automatisch einen Cookie namens `better-auth.session_token`. Dieser Cookie muss bei jeder API-Anfrage mitgeschickt werden.

### Session-Token aus dem Browser kopieren

1. App im Browser öffnen und **einloggen**
2. Browser-Entwicklertools öffnen: `F12` oder `Rechtsklick → Untersuchen`
3. Tab **«Application»** (Chrome/Edge) bzw. **«Speicher»** (Firefox) öffnen
4. Links: **Cookies** → URL der App auswählen
5. Cookie `better-auth.session_token` suchen und den **Wert** kopieren

Dieser Wert sieht z. B. so aus: `eyJhbGciOiJIUzI1NiJ9...` (ein langer Base64-String).

---

## Testen mit Hoppscotch (empfohlen)

[Hoppscotch](https://hoppscotch.io) ist ein kostenloses, browserbasiertes API-Testtool – keine Installation nötig.

### Option A: App läuft lokal (nur eigener Laptop)

Hoppscotch kann auf `http://localhost:3000` zugreifen, wenn es im selben Browser geöffnet ist. Weil Hoppscotch unter `https://hoppscotch.io` läuft und deine App unter `http://localhost:3000`, blockiert der Browser aus Sicherheitsgründen Cookies von `localhost` (Cross-Origin-Beschränkung). **Daher ist für lokale Tests Port Forwarding empfohlen** (siehe Option B) oder curl (siehe unten).

### Option B: App via Port Forwarding teilen (empfohlen für Klassenraum)

Mit VS Code Port Forwarding erhält deine lokal laufende App eine öffentliche HTTPS-URL. Diese funktioniert problemlos mit Hoppscotch.

→ Anleitung: [VSCODE_PORT_FORWARDING.md](./VSCODE_PORT_FORWARDING.md)

Die generierte URL sieht z. B. so aus: `https://abc123-3000.devtunnels.ms`

**Wichtig:** Nach dem Aktivieren von Port Forwarding musst du dich über die neue HTTPS-URL einloggen (nicht über `localhost`), damit der Session-Cookie für diese URL gilt.

### Anfragen in Hoppscotch stellen

#### GET /api/antraege – Alle Anträge abrufen

1. Hoppscotch öffnen: [hoppscotch.io](https://hoppscotch.io)
2. Methode auf **`GET`** setzen
3. URL eingeben: `https://<deine-tunnel-url>/api/antraege`
4. Tab **«Headers»** öffnen → **«Add header»** klicken:
   - Key: `Cookie`
   - Value: `better-auth.session_token=<dein-token>`
5. **«Send»** klicken → im unteren Bereich erscheint die JSON-Antwort

Erwartete Antwort (200 OK):
```json
[
  {
    "id": "clx...",
    "titel": "Mein erster Antrag",
    "beschreibung": "...",
    "status": "ENTWURF",
    "erstelltAm": "2026-05-01T10:00:00.000Z",
    "ersteller": { "name": "Max Muster", "email": "max@example.com" }
  }
]
```

#### GET /api/antraege/:id – Einzelnen Antrag abrufen

Gleich wie oben, aber mit einer konkreten ID in der URL:

URL: `https://<deine-tunnel-url>/api/antraege/clx1234abcd`

#### POST /api/antraege – Neuen Antrag erstellen

1. Methode auf **`POST`** setzen
2. URL: `https://<deine-tunnel-url>/api/antraege`
3. Tab **«Headers»**:
   - `Cookie` → `better-auth.session_token=<dein-token>`
   - `Content-Type` → `application/json`
4. Tab **«Body»** → Typ **«JSON»** wählen → Inhalt eingeben:
```json
{
  "titel": "Mein Test-Antrag",
  "beschreibung": "Erstellt via Hoppscotch"
}
```
5. **«Send»** klicken

Erwartete Antwort (201 Created):
```json
{
  "id": "clx...",
  "titel": "Mein Test-Antrag",
  "beschreibung": "Erstellt via Hoppscotch",
  "status": "ENTWURF",
  ...
}
```

---

## HTTP Status Codes

| Code | Bedeutung | Ursache |
|---|---|---|
| 200 OK | Anfrage erfolgreich | Daten wurden zurückgegeben |
| 201 Created | Ressource erstellt | POST war erfolgreich |
| 400 Bad Request | Ungültige Daten | Pflichtfelder fehlen oder sind ungültig |
| 401 Unauthorized | Nicht eingeloggt | Cookie fehlt oder ist abgelaufen |
| 403 Forbidden | Keine Berechtigung | Falsche Rolle oder fremder Eintrag |
| 404 Not Found | Nicht gefunden | ID existiert nicht |
| 500 Server Error | Interner Fehler | Fehler im Server-Code |

---

## Exkurs: Authentifizierung in der Realität

Die aktuelle Implementierung verwendet **Session-Cookies** – das ist eine bewusste Vereinfachung für diesen Prototypen.

### Warum Session-Cookies für externe Clients problematisch sind

Ein Session-Cookie entsteht, wenn sich ein Mensch über den Browser einloggt. Er ist:
- **kurzlebig**: läuft nach einer bestimmten Zeit ab (Session-Timeout)
- **browserzentriert**: ein programmatischer Client (anderes Backend, mobile App, Skript) müsste sich zuerst «einloggen wie ein Mensch», um den Token zu erhalten
- **nicht erneuerbar**: ohne erneuten Login-Vorgang gibt es keinen Mechanismus, den Token automatisch zu verlängern

Für den Prototypen funktioniert das: Man loggt sich einmal ein, kopiert den Token, und nutzt ihn solange er gültig ist. Für eine produktive Anwendung wäre das jedoch unpraktikabel.

### Was in der Realität verwendet wird

Für Clients, die **dauerhaft und programmatisch** auf eine API zugreifen sollen, gibt es zwei verbreitete Ansätze:

**API-Keys** (einfach):
- Der Client registriert sich einmal und erhält einen langlebigen Schlüssel (z. B. `sk-abc123`)
- Bei jeder Anfrage wird der Key im `Authorization`-Header mitgeschickt: `Authorization: Bearer sk-abc123`
- Der Server prüft den Key gegen eine Datenbanktabelle
- Einfach umzusetzen, aber kein User-Kontext: der Key gehört einer Anwendung, nicht einem Nutzer

**OAuth 2.0** (komplex, aber flexibel):
- **Client Credentials Flow**: Für Service-to-Service-Kommunikation. Client authentifiziert sich mit `client_id` + `client_secret` und erhält einen kurzlebigen Access-Token, der automatisch erneuert werden kann.
- **Authorization Code Flow**: Für user-delegierten Zugriff – ein Nutzer autorisiert eine Drittanwendung einmalig, die danach mit Refresh-Tokens selbstständig neue Access-Tokens holen kann.
- OAuth 2.0 ist der Industriestandard (z. B. «Login mit Google», API-Zugriffe bei Stripe, GitHub etc.)

### Warum wir das hier vereinfacht haben

Better Auth (die verwendete Auth-Bibliothek) unterstützt API-Keys und OAuth prinzipiell. Für diesen Starter Kit wurde bewusst darauf verzichtet, um den Fokus auf die Grundkonzepte (Route Handler, Zod-Validation, Autorisierungslogik) zu legen – nicht auf produktionsreife Auth-Infrastruktur.

---

## Testen mit curl (alternativ, für Fortgeschrittene)

`curl` ist ein Kommandozeilentool. Es ist auf macOS/Linux vorinstalliert; auf Windows über WSL oder Git Bash verfügbar.

```bash
# Alle Anträge abrufen
curl http://localhost:3000/api/antraege \
  -H "Cookie: better-auth.session_token=<dein-token>"

# Neuen Antrag erstellen
curl -X POST http://localhost:3000/api/antraege \
  -H "Cookie: better-auth.session_token=<dein-token>" \
  -H "Content-Type: application/json" \
  -d '{"titel":"Mein Test-Antrag","beschreibung":"Erstellt via curl"}'

# Einzelnen Antrag abrufen
curl http://localhost:3000/api/antraege/<id> \
  -H "Cookie: better-auth.session_token=<dein-token>"
```
