# E-Mail-Integration – Resend

E-Mails senden und empfangen über [Resend](https://resend.com).

> **Ausführliche Implementierungsanleitung:** [`../starter-kit-erstellung/impl-06-email.md`](../starter-kit-erstellung/impl-06-email.md)

---

## Architektur

```
OUTBOUND: Antrag eingereicht
  Server Action → emailService.sendEmail() → Resend API → Posteingang

INBOUND: Reviewer antwortet per E-Mail
  E-Mail an antrag@domain.com → Resend Inbound → Webhook
    → POST /api/webhooks/resend → antragEmailService.processIncomingEmail()
```

**Debug-Modus:** Alle E-Mails werden an `EMAIL_TEST_ADDRESS` umgeleitet, wenn `EMAIL_DEBUG_MODE=true`.

---

## Setup-Checkliste

1. Resend-Account erstellen: https://resend.com
2. API-Key generieren (Dashboard → API Keys)
3. Domain verifizieren (oder `onboarding@resend.dev` für Tests nutzen)
4. `.env.local` mit Werten befüllen (siehe unten)
5. `EMAIL_DEBUG_MODE=true` setzen für Entwicklung
6. App neu starten: `npm run dev`
7. Antrag einreichen → E-Mail im Test-Postfach prüfen
8. Für Inbound: Resend Inbound Route konfigurieren (siehe impl-06)

---

## ENV-Variablen

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM_ADDRESS=onboarding@resend.dev
EMAIL_FROM_NAME="CAS Starter Kit"
EMAIL_DEBUG_MODE=true
EMAIL_TEST_ADDRESS=deine.email@example.com
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxx
```

---

## Debug-Modus vs. Produktion

| Modus | `EMAIL_DEBUG_MODE` | Ziel |
|---|---|---|
| Entwicklung | `true` | Alle E-Mails → `EMAIL_TEST_ADDRESS` |
| Produktion | `false` | E-Mails an echte Empfänger |

> **Wichtig:** Im Debug-Modus werden keine echten E-Mails versendet. Das verhindert versehentliche Test-E-Mails an echte Adressen.
