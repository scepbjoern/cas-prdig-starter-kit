# Schema-Reset-Workflow

Dieser Workflow wird benötigt, wenn das Prisma-Schema geändert wird.

> ⚠️ **Alle Daten in der lokalen Datenbank werden gelöscht!**
> Sicherstellen, dass alle wichtigen Daten in `prisma/seed.ts` gespeichert sind.

## Wann nötig?

- Neues Model hinzugefügt
- Feld zu bestehendem Model hinzugefügt oder entfernt
- Enum-Werte geändert
- Relation hinzugefügt oder geändert

## Schritte

1. **Schema anpassen** – `prisma/schema.prisma` bearbeiten
2. **seed.ts prüfen** – Neue Testdaten für neue Felder/Models ergänzen
3. **Datenbank zurücksetzen:**
   ```bash
   npm run db:reset
   ```
   Dies führt aus:
   - `prisma db push --force-reset` (DB löschen + Schema einlesen)
   - `tsx prisma/seed.ts` (Testdaten laden)

4. **Verifikation:**
   ```bash
   npm run db:studio   # DB-Inhalte prüfen
   npm run dev         # App starten und testen
   ```

## Im Team

Wenn ihr in einer Gruppe arbeitet:
1. Schema-Änderung committen und pushen
2. Alle Team-Mitglieder führen `npm run db:reset` aus (jeder hat seine eigene lokale DB)
