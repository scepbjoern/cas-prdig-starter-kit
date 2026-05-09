# SpecKit Initialisierung

Das Starter-Kit enthält bereits eine vorbereitete `AGENTS.md`.
SpecKit-Befehle können trotzdem genutzt werden, um den Kontext zu erweitern.

## Vorgefertigte AGENTS.md anpassen (empfohlen)

1. `AGENTS.md` öffnen
2. Alle `[TODO]`-Einträge mit eurem Projektinhalt ersetzen:
   - Projektbeschreibung (2–3 Sätze)
   - Rollen-Tabelle anpassen
   - Scope definieren
   - Team-Info ergänzen
3. Commit: `git commit -m "docs: AGENTS.md für [Projektname] angepasst"`

## Optional: SpecKit CLI nutzen

```bash
npx spec-kit init   # Erweitert AGENTS.md interaktiv
npx spec-kit plan   # Erstellt PLAN.md
npx spec-kit tasks  # Erstellt TASKS.md
```

## TASKS.md Vorlage

Neue Tasks im Format:
```markdown
## Task: [Feature-Name]

**Ziel:** [Was soll nach Abschluss funktionieren?]

**Akzeptanzkriterien:**
- [ ] Unit-Test in `__tests__/unit/` grün
- [ ] `npm run dev` fehlerfrei
- [ ] Manueller Test: [Schritt-für-Schritt Beschreibung]

**Betroffene Dateien:**
- `src/...`
```