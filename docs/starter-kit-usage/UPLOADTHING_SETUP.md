# UploadThing Setup – Lokaler Upload → Cloud

Optionale Umstellung auf [UploadThing](https://uploadthing.com) für Cloud-Dateiupload.

> **Tech-Stack-Entscheidung:** [`../starter-kit-erstellung/impl-00-tech-stack-decisions.md`](../starter-kit-erstellung/impl-00-tech-stack-decisions.md) → Abschnitt 5 (Cloud-Variante)
> **Implementierungsanleitung:** [`../starter-kit-erstellung/impl-05-file-upload.md`](../starter-kit-erstellung/impl-05-file-upload.md)

---

## Wann UploadThing nutzen?

- Die App soll auf Vercel deployt werden (lokales Dateisystem ist dort ephemeral)
- Dateien sollen dauerhaft gespeichert werden
- Grössere Dateien oder höhere Upload-Limits benötigt

---

## Setup-Checkliste

1. UploadThing-Account erstellen: https://uploadthing.com
2. API-Key generieren (Dashboard → API Keys)
3. `npm install uploadthing` (falls noch nicht installiert)
4. `.env.local` mit UploadThing-Keys befüllen (siehe unten)
5. Upload-Route erstellen: `src/app/api/uploadthing/core.ts`
6. Komponente anpassen: Lokalen Upload → UploadThing-Komponente
7. `npm run dev` testen
8. Datei hochladen → in UploadThing Dashboard prüfen

---

## ENV-Variablen

```env
UPLOADTHING_TOKEN=sk_live_xxxxxxxxxxxxxxxx
UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxxxxxx
```

---

## Vergleich: Lokal vs. UploadThing

| | Lokal (`public/uploads/`) | UploadThing |
|---|---|---|
| Kosten | Kostenlos | Free Tier: 2 GB, 500 Uploads/Monat |
| Persistence | Nur lokal | Cloud, persistent |
| Vercel-kompatibel | Nein (ephemeral FS) | Ja |
| Setup-Aufwand | Keiner | Account + Integration |

> **Empfehlung:** Für lokale Entwicklung reicht der lokale Upload. Erst bei Vercel-Deployment auf UploadThing wechseln.
