# Schema-Reset-Workflow

## Was ist das Prisma-Schema?

Das **Prisma-Schema** (`prisma/schema.prisma`) ist die zentrale Datenbankdefinition der Applikation. Es beschreibt, welche Tabellen (Models), Felder und Beziehungen in der Datenbank existieren. Prisma übersetzt dieses Schema in die eigentliche SQLite-Datenbank und stellt typsichere Datenbankzugriffe im TypeScript-Code bereit.

Die Datei `prisma/seed.ts` ergänzt das Schema: Sie befüllt die Datenbank nach einem Reset mit Testdaten (Benutzer, Beispieleinträge etc.), damit die Applikation sofort lauffähig ist.

Dieser Workflow wird benötigt, wenn das Prisma-Schema geändert wird.

> ⚠️ **Alle Daten in der lokalen Datenbank werden gelöscht!**
> Sicherstellen, dass alle wichtigen Daten in `prisma/seed.ts` gespeichert sind.

## Wann nötig?

- Neues Model hinzugefügt
- Feld zu bestehendem Model hinzugefügt oder entfernt
- Enum-Werte geändert
- Relation hinzugefügt oder geändert

## Schritte

1. **Schema anpassen** – Den AI Agent beauftragen, `prisma/schema.prisma` zu bearbeiten (z.B. neues Model, neues Feld, neue Relation).
2. **seed.ts prüfen** – Den AI Agent bitten, `prisma/seed.ts` zu ergänzen, damit neue Felder und Models mit sinnvollen Testdaten befüllt werden.
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

Wenn mehrere Personen am gleichen Projekt arbeiten: Jede Person betreibt die Applikation lokal auf ihrem eigenen Rechner und hat damit auch ihre eigene, unabhängige Datenbank. Schema-Änderungen müssen daher von allen Beteiligten lokal nachgezogen werden:

1. Schema-Änderung committen und pushen
2. Alle Team-Mitglieder pullen die Änderungen und führen `npm run db:reset` aus
