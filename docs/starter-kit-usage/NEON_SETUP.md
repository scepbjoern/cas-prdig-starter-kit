# Neon Setup – SQLite → PostgreSQL (Cloud)

Optionale Umstellung auf [Neon](https://neon.tech) als Cloud-Datenbank für Deployment.

> **Tech-Stack-Entscheidung:** [`../starter-kit-erstellung/impl-00-tech-stack-decisions.md`](../starter-kit-erstellung/impl-00-tech-stack-decisions.md) → Abschnitt 1 (Option B: Neon)

---

## Wann Neon nutzen?

- Die App soll auf Vercel deployt werden (SQLite ist dort nicht persistierbar)
- Mehrere Personen sollen auf dieselbe Datenbank zugreifen
- PostgreSQL-spezifische Features benötigt

---

## Setup-Checkliste

1. Neon-Account erstellen: https://neon.tech
2. Neues Projekt anlegen (Region: Frankfurt für CH)
3. Connection String kopieren (aus dem Dashboard)
4. `.env.local` aktualisieren: `DATABASE_URL` auf Neon Connection String setzen
5. Prisma-Adapter anpassen: `@prisma/adapter-better-sqlite3` → `@prisma/adapter-neon`
6. `prisma/schema.prisma` – Provider auf `postgresql` ändern
7. `npm run db:reset` ausführen (Schema + Seed auf Neon)
8. `npm run dev` testen
9. Prisma Studio: `npm run db:studio` verbindet sich nun mit Neon

---

## ENV-Variablen

```env
# Statt SQLite:
# DATABASE_URL="file:./dev.db"

# Neon PostgreSQL:
DATABASE_URL="postgresql://neondb_owner:password@ep-xxx-xxx-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

---

## Hinweise

- **Free Tier:** 100 CU-Stunden/Monat, 0.5 GB Storage – ausreichend für Kursprojekte
- **Cold Start:** Nach Inaktivität kann der erste Query ~300–500 ms dauern
- **Kein Pausing-Problem:** Neon skaliert automatisch, kein manuelles Aufwecken nötig
- **Zurück zu SQLite:** Einfach `DATABASE_URL="file:./dev.db"` setzen und `npm run db:reset`
