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
