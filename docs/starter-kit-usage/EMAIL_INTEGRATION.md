# E-Mail-Integration – Resend

E-Mails senden und empfangen über [Resend](https://resend.com).
Sowohl Outbound als auch Inbound nutzen ausschliesslich Resends Standard-Domains (`onboarding@resend.dev` bzw. die automatisch bereitgestellte `.resend.app`-Empfangsdomain) – kein DNS-Setup, keine eigene Domain nötig.

---

## Architektur

```
OUTBOUND: Antrag eingereicht / entschieden
  Server Action → emailService.sendEmail() → Resend API → Posteingang

INBOUND: Reviewer antwortet per E-Mail
  Reviewer sendet E-Mail an anything@<name>.resend.app
    → Resend Inbound → Webhook POST /api/webhooks/resend
      → Resend API GET /emails/receiving/{id} (E-Mail-Body nachladen)
        → antragEmailService.processIncomingEmail()
          → Notiz wird an den Antrag angehängt
```

**Debug-Modus:** Alle Outbound-E-Mails werden an `EMAIL_TEST_ADDRESS` umgeleitet, wenn `EMAIL_DEBUG_MODE=true`.

---

## Teil 1 – Outbound (E-Mails senden)

### Schritt 1: Resend-Account und API-Key

1. Account erstellen: [resend.com](https://resend.com) → Sign Up
2. **API Keys → Create API Key** → Namen vergeben → kopieren
3. Als Absender steht `onboarding@resend.dev` sofort zur Verfügung – kein weiteres Setup nötig

### Schritt 2: Umgebungsvariablen setzen

In `.env`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM_ADDRESS=onboarding@resend.dev
EMAIL_FROM_NAME="CAS Starter Kit"
EMAIL_DEBUG_MODE=true
EMAIL_TEST_ADDRESS=deine.email@example.com
```

### Schritt 3: Outbound testen

1. `npm run dev` starten
2. Als `applicant@example.com` anmelden → Antrag einreichen
3. **Resend Dashboard → Logs** prüfen: E-Mail erscheint als versendet
4. Posteingang von `EMAIL_TEST_ADDRESS` prüfen (E-Mail kommt dort an, nicht beim echten Antragsteller)

---

## Teil 2 – Inbound (E-Mails empfangen)

Inbound ermöglicht es einem Reviewer, per E-Mail einen Kommentar an einen Antrag anzuhängen. Dazu sendet er eine E-Mail mit der Antrag-ID im Betreff (`[cm123abc...]`). Das System erkennt die ID, findet den Antrag und speichert die E-Mail als Notiz.

> **Wie Resend Inbound funktioniert:** Resend stellt automatisch eine Empfangsdomain bereit (z.B. `xyz.resend.app`). Jede E-Mail an diese Domain löst ein `email.received`-Webhook-Event aus. Das Webhook-Payload enthält nur Metadaten (kein Body) – der vollständige E-Mail-Inhalt wird vom Code separat über die Resend-API nachgeladen.

> **Voraussetzung für lokale Tests:** Eine öffentlich erreichbare URL ist nötig, damit Resend den Webhook erreichen kann (VS Code Port Forwarding, Schritt 4 unten).

### Schritt 4: VS Code Port Forwarding aktivieren

Damit Resend Webhooks an die lokale App senden kann, muss Port 3000 öffentlich erreichbar sein:

1. `npm run dev` starten
2. VS Code → Terminal-Panel → Tab **«Ports»** öffnen
3. **«Forward Port»** klicken → Port `3000` eingeben → Enter
4. Bei Bedarf mit GitHub-Account authorisieren
5. In der Ports-Liste: Rechtsklick auf Port 3000 → **«Port Visibility» → «Public»**
6. Generierte URL notieren, z.B. `https://abc123-3000.devtunnels.ms`

> Die URL ändert sich bei jedem Neustart von VS Code. Dann muss die Webhook-URL in Resend (Schritt 5) aktualisiert werden.

> **Fallback:** `npx localtunnel --port 3000` – kein Account nötig, weniger stabil.

### Schritt 5: Webhook in Resend erstellen

1. Resend Dashboard → **Webhooks** → **Add Webhook**
2. Felder ausfüllen:
   - **Endpoint URL:** Port-Forwarding-URL + `/api/webhooks/resend`  
     Beispiel: `https://abc123-3000.devtunnels.ms/api/webhooks/resend`  
     > ⚠️ Der Pfad `/api/webhooks/resend` am Ende ist zwingend – ohne ihn landet der Request auf der Login-Seite und schlägt fehl.
   - **Events:** `email.received` aktivieren (alle anderen deaktiviert lassen)
3. **Add** klicken
4. Den angezeigten **Signing Secret** (`whsec_...`) kopieren

### Schritt 6: Webhook Secret in .env setzen

Den kopierten Secret in `.env` eintragen:

```env
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxx
```

Danach `npm run dev` neu starten (Umgebungsvariablen werden beim Start eingelesen, ausser falls "Reload env" automatisch angezeigt wird).

### Schritt 7: Inbound testen

1. Dev-Server läuft, Port Forwarding ist aktiv (Schritt 4)
2. Resend Dashboard → **Email** → **Receiving**: die bereitgestellte Empfangsadresse einsehen (Format: `irgendwas@<name>.resend.app`)
3. Eine der bestehenden Antrags-IDs aus der App kopieren (z.B. `cm9abc123def456ghi789`)
4. E-Mail senden an die Resend-Empfangsadresse:
   - **Betreff:** `[cm9abc123def456ghi789]` (Antrag-ID in eckigen Klammern)
   - **Inhalt:** beliebiger Text, z.B. «Antrag genehmigt, Unterlagen vollständig.»
5. **Resend Dashboard → Webhooks → dein Webhook → Deliveries** prüfen: Eintrag erscheint mit Status `200`
6. In der App: betreffenden Antrag öffnen → **Kommunikationsverlauf** am Ende der Seite erscheint mit dem E-Mail-Inhalt

---

## ENV-Variablen – Übersicht

```env
# Outbound und Inbound API-Zugriff (Pflicht)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM_ADDRESS=onboarding@resend.dev
EMAIL_FROM_NAME="CAS Starter Kit"

# Debug-Modus (für Entwicklung: alle Outbound-E-Mails an Testadresse)
EMAIL_DEBUG_MODE=true
EMAIL_TEST_ADDRESS=deine.email@example.com

# Inbound Webhook-Signatur (erst nach Schritt 5 setzen)
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxx
```

---

## Debug-Modus vs. Produktion

| Modus | `EMAIL_DEBUG_MODE` | Outbound-Ziel |
|---|---|---|
| Entwicklung | `true` | Alle E-Mails → `EMAIL_TEST_ADDRESS` |
| Produktion | `false` | E-Mails an echte Empfänger |

> Im Debug-Modus werden keine echten E-Mails an Antragsteller versendet.

---

## Fehlerbehebung

| Problem | Mögliche Ursache | Lösung |
|---|---|---|
| Webhook liefert 307 / landet auf Login | Pfad fehlt in der Webhook-URL | URL im Resend Dashboard prüfen: muss auf `/api/webhooks/resend` enden |
| Webhook liefert 401 | Secret falsch oder nicht gesetzt | `RESEND_WEBHOOK_SECRET` in `.env` prüfen, Server neu starten |
| Webhook liefert 404 | Falscher Pfad | URL im Resend Dashboard prüfen: muss auf `/api/webhooks/resend` enden |
| Keine Webhook-Delivery | Port Forwarding inaktiv | VS Code Ports-Tab prüfen, Visibility auf «Public» setzen |
| Notiz erscheint ohne Text | `RESEND_API_KEY` fehlt | API-Key in `.env` prüfen – wird für das Nachladen des E-Mail-Bodys benötigt |
| Notiz erscheint nicht | Antrag-ID nicht erkannt | Betreff-Format prüfen: `[cuid]` – Kleinbuchstaben und Zahlen, 20–30 Zeichen |
