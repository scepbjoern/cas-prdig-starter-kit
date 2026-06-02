# REST-Client – Externe APIs aufrufen

Das Starter Kit zeigt nicht nur, wie die App eine REST-API **anbietet** (als Server), sondern auch, wie sie selbst eine **externe REST-API aufruft** (als Client). Das Beispiel dafür ist die PLZ/Ort-Autocomplete im Antrag-Formular.

---

## Was das Feature tut

Beim Erstellen oder Bearbeiten eines Antrags kann optional ein Ort angegeben werden. Sobald mindestens zwei Zeichen eingegeben werden, erscheinen automatisch passende Ortsvorschläge aus der Schweiz – inklusive Kantonskürzel. Ein Klick auf einen Vorschlag füllt das Feld aus.

---

## Das Muster: Proxy-Endpunkt

Die App ruft die externe PLZ-Datenbank nicht direkt aus dem Browser auf, sondern über einen eigenen Zwischen-Endpunkt:

```
Browser → /api/plz-lookup?q=8001 → openplzapi.org/ch/Localities?postalCode=8001
```

Dieser Proxy-Endpunkt läuft auf dem Server und kapselt den externen API-Call. Das hat drei Vorteile:

| Vorteil | Erklärung |
|---|---|
| Keine CORS-Probleme | Browser dürfen externe APIs oft nicht direkt aufrufen – der Server darf es immer |
| Einheitliche Fehlerbehandlung | Fehler der externen API werden abgefangen und als verständliche Meldung weitergegeben |
| Einfach anpassbar | Wenn die externe API wechselt, wird nur der Proxy-Endpunkt geändert |

Das Muster lässt sich direkt auf andere externe Datenquellen übertragen – z.B. Wetterdaten, Firmendaten oder Währungskurse.

---

## Externe API: OpenPLZ-API

Das Starter Kit nutzt die öffentliche [OpenPLZ-API](https://openplzapi.org) für Schweizer Postleitzahlen und Ortsnamen. Sie ist kostenlos, braucht keine Authentifizierung und unterstützt Suche nach PLZ und Ortsname.

---

## Wo im Repository

```
src/app/api/plz-lookup/
  route.ts              # Proxy-Endpunkt: nimmt ?q=... entgegen, ruft OpenPLZ-API auf

src/components/antraege/
  antrag-form.tsx       # Formular: PLZ-Suchfeld mit Dropdown und 300ms Verzögerung

src/lib/schemas/
  antrag.ts             # Zod-Schema: plzOrt und kanton als optionale Felder

prisma/schema.prisma    # Datenmodell: plzOrt und kanton im Antrag-Modell
```

---

## Datenfluss

```
1. Nutzer tippt im Feld «Ort»
2. Nach 300ms (Debounce): fetch('/api/plz-lookup?q=...')
3. /api/plz-lookup ruft openplzapi.org auf
4. Vorschläge werden als Dropdown angezeigt
5. Nutzer wählt Eintrag → plzOrt und kanton werden gesetzt
6. Beim Absenden: Felder werden in der Datenbank gespeichert
```

---

## Für eigene externe APIs adaptieren

Das Muster ist auf andere Anwendungsfälle übertragbar:

| Anwendungsfall | Externe API | Proxy-Endpunkt |
|---|---|---|
| Firmensuche | Zefix (CH Handelsregister) | `/api/firmen` |
| Wetterdaten | Open-Meteo | `/api/wetter` |
| Währungsumrechnung | exchangerate-api.com | `/api/waehrung` |

In jedem Fall: eigenen Route Handler in `src/app/api/<name>/route.ts` anlegen, externe URL aufbauen, `fetch()` aufrufen, Antwort vereinfachen und zurückgeben.

---

## Weiterführende Dokumente

- [`../starter-kit-erstellung/impl-09-rest-client.md`](../starter-kit-erstellung/impl-09-rest-client.md) – Implementierungsanleitung mit vollständigem Code
- [`REST_API_GUIDE.md`](REST_API_GUIDE.md) – Wie die App eigene REST-Endpunkte anbietet
