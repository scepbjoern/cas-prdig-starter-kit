# TASKS.md – Feature-Tasks

> Aktuelle und abgeschlossene Feature-Tasks für dieses Projekt.
> Format: Jede Task mit Ziel, Akzeptanzkriterien und Status.

---

## Vorlage für neue Tasks

Kopiere diesen Block und fülle ihn aus:

```
## Task: [Feature-Name]

**Status:** [ ] Offen / [x] Abgeschlossen
**Erstellt:** [Datum]

**Ziel:** [Was soll nach Abschluss funktionieren? 1–2 Sätze]

**Akzeptanzkriterien:**
- [ ] Unit-Test in `__tests__/unit/[datei].test.ts` grün
- [ ] `npm run dev` startet fehlerfrei
- [ ] Manueller Test: [Schritt-für-Schritt]
- [ ] `npm run build` fehlerfrei

**Betroffene Dateien:**
- `src/app/(app)/...`
- `src/lib/...`
```

---

## Task: Demo-Setup (Starter-Kit Grundgerüst)

**Status:** [x] Abgeschlossen

**Ziel:** Funktionierende Next.js-App mit Auth, Prisma, shadcn/ui und 3 Testnutzern.

**Akzeptanzkriterien:**
- [x] `npm run db:reset` läuft fehlerfrei
- [x] Login mit allen 3 Rollen funktioniert
- [x] Dashboard zeigt rollenspezifische KPIs
- [x] Antrag-Workflow (ENTWURF → EINGEREICHT → GENEHMIGT/ABGELEHNT) funktioniert
- [x] `npm run build` fehlerfrei
```