# Vercel Deployment

Optionales Deployment der App auf [Vercel](https://vercel.com).

> **Tech-Stack-Entscheidung:** [`../starter-kit-erstellung/impl-00-tech-stack-decisions.md`](../starter-kit-erstellung/impl-00-tech-stack-decisions.md) → Abschnitt 3 + 7 (Variante 2)

---

## Voraussetzungen

- GitHub-Repository mit dem Starter Kit
- Vercel-Account (kostenlos): https://vercel.com
- **Neon-Datenbank** eingerichtet (SQLite funktioniert nicht auf Vercel)
- **UploadThing** eingerichtet (lokaler Upload funktioniert nicht auf Vercel)

---

## Setup-Checkliste

1. Vercel-Account erstellen und mit GitHub verbinden
2. «New Project» → Repository auswählen
3. Framework Preset: **Next.js** (automatisch erkannt)
4. Environment Variables eintragen (siehe unten)
5. «Deploy» klicken
6. Deployment-URL aufrufen und testen
7. Custom Domain einrichten (optional)
8. Bei Änderungen: `git push` löst automatisch neues Deployment aus

---

## ENV-Variablen (Vercel Dashboard → Settings → Environment Variables)

```env
DATABASE_URL="postgresql://..."           # Neon Connection String
BETTER_AUTH_SECRET="..."                  # Gleicher wie lokal
BETTER_AUTH_URL="https://eure-app.vercel.app"
NEXT_PUBLIC_APP_URL="https://eure-app.vercel.app"

RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM_ADDRESS=eure-app@euredomain.com
EMAIL_FROM_NAME="CAS Starter Kit"
EMAIL_DEBUG_MODE=false
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxx

UPLOADTHING_TOKEN=sk_live_xxxxxxxxxxxxxxxx
UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxxxxxx
```

---

## Wichtige Hinweise

- **`BETTER_AUTH_URL`** muss auf die Vercel-URL gesetzt werden (nicht `localhost`)
- **`EMAIL_DEBUG_MODE=false`** für echte E-Mails
- **Inbound E-Mail:** Resend-Webhook-URL auf `https://eure-app.vercel.app/api/webhooks/resend` setzen
- **Jeder `git push`** auf den `main`-Branch löst ein automatisches Deployment aus
