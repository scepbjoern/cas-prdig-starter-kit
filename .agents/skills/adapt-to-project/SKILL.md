---
name: adapt-to-project
description: >
  Bereinigt den Starter-Kit-Workspace einmalig auf Basis des bestätigten PRDs: stubbt Demo-Seiten, entfernt irrelevante Prisma-Modelle und validiert den Build. Vor dem ersten plan-feature ausführen. ONLY activate when the user explicitly runs /adapt-to-project or directly requests this specific workflow by name. Do NOT activate during normal development, planning, or implementation conversations.
compatibility: Next.js 16, Prisma 7, Better Auth, SQLite
metadata:
  piv-phase: setup
  version: "1.2"
disable-model-invocation: true
argument-hint: "[path-to-prd]"
---

# Adapt to Project: Starter Kit bereinigen

## Input

Pfad zum bestätigten PRD: `$ARGUMENTS`

Beispiel:

```text
/adapt-to-project docs/project/prds/antragssystem-v002.md
```

## Zweck

Der Starter Kit enthält Demo-Seiten, Demo-Entitäten und Demo-Code, der für die meisten konkreten Projekte nicht relevant ist. Dieser Skill bereinigt den Workspace gezielt auf Basis des PRDs und hinterlässt eine lauffähige Applikation als saubere Ausgangslage für die Feature-Entwicklung.

Dieser Skill läuft **genau einmal pro Projekt**, nach PRD-Review, Review-Integration, fachlicher PRD-Bestätigung und vor dem ersten `/plan-feature`.

## Grundregeln

- Lösche keine Infrastruktur-Dateien (Auth, Prisma-Singleton, lib-Utilities, Middleware).
- **Ersetze** Demo-Seiten durch minimale Platzhalter-Komponenten – lösche sie nicht. Das verhindert TypeScript-Fehler durch fehlende Exports und hält die App kompilierbar.
- Entferne Demo-Prisma-Modelle aus `prisma/schema.prisma`. Auth-Modelle (User, Session, Account, Verification) werden nie angetastet.
- Der Build (`npm run build`) muss nach der Bereinigung **zwingend** erfolgreich sein. Repariere alle TypeScript-Fehler selbst, bevor du abschliesst.
- Ändere keine Dateien, die im PRD als genutzt markiert sind.

## Phase 1: PRD und Starter-Kit-Inventar lesen

Lies vollständig:

- Die PRD-Datei aus `$ARGUMENTS`
- `prisma/schema.prisma`
- `src/app/(app)/` – vorhandene Demo-Seiten und Layout-Dateien
- `src/app/api/` – vorhandene Demo-Route-Handler
- `prisma/seed.ts` – vorhandene Seed-Daten
- `__tests__/` und `e2e/` – Demo-Tests

Suche im PRD nach dem Abschnitt **"Starter Kit Nutzung"**:

- **Abschnitt vorhanden:** Nutze die dort dokumentierten Bausteine und Demo-Inhalte direkt als Grundlage für den Bereinigungsvorschlag.
- **Abschnitt fehlt:** Leite die Informationen selbst aus dem PRD ab. Analysiere Scope, Datenmodell, Rollen und Funktionen und bestimme, welche Starter-Kit-Bausteine benötigt werden und welche Demo-Inhalte irrelevant sind. Dokumentiere diese Ableitung transparent im Bereinigungsvorschlag. Ergänze den Abschnitt "Starter Kit Nutzung" danach im PRD, bevor du mit der Bereinigung beginnst.

## Phase 2: Bereinigungsvorschlag erstellen

Erstelle eine Vorschlagsliste mit folgenden Kategorien:

### A) Demo-Seiten → Inhalt durch Platzhalter ersetzen

Für jede Demo-Seite, die nicht in diesem Projekt gebraucht wird:

- Behalte die Datei, ersetze den Inhalt durch diesen minimalen Platzhalter:

  ```tsx
  // Diese Seite gehört nicht zum Projektumfang.
  export default function PlatzhalterPage() {
    return <p>Nicht implementiert.</p>;
  }
  ```

- Entferne die Verlinkung dieser Seite aus Navigation- oder Layout-Dateien (z.B. Sidebar, Header).

### B) Demo-Prisma-Modelle → aus schema.prisma entfernen

Für jedes Modell, das nicht im PRD-Datenmodell vorgesehen ist:

- Modellname und Begründung (nicht im PRD)
- Alle Referenzen auf dieses Modell in anderen Modellen ebenfalls entfernen

Nie entfernen: `User`, `Session`, `Account`, `Verification` – diese gehören zu Better Auth.

### C) Demo-Seed-Daten → aus prisma/seed.ts entfernen

Seed-Blöcke, die zu entfernten Modellen gehören oder ausschliesslich Demo-Entitäten befüllen.

### D) Demo-Tests → entfernen oder überspringen

Unit-Tests und E2E-Tests, die ausschliesslich Demo-Entitäten oder Demo-Seiten testen. Bei Unsicherheit `.skip` statt löschen verwenden.

### E) Nicht angetastet

Liste explizit auf, was bewusst nicht verändert wird:

- `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/lib/auth-helpers.ts`
- `src/lib/prisma.ts`
- `src/lib/ai.ts`, `src/lib/services/emailService.ts`
- `middleware.ts`
- `src/app/login/`, `src/app/api/auth/`
- Auth-Modelle in `prisma/schema.prisma`
- Alle Dateien, die laut PRD genutzt werden

## Phase 3: Bestätigung einholen

Zeige den vollständigen Bereinigungsvorschlag übersichtlich strukturiert. Warte auf explizite Bestätigung, bevor du Änderungen vornimmst.

Beispielformulieurng:

```text
Bereinigungsvorschlag für [Projektname] auf Basis von [PRD-Datei]:

A) Demo-Seiten stubben: ...
B) Prisma-Modelle entfernen: ...
C) Seed-Daten entfernen: ...
D) Tests entfernen/überspringen: ...
E) Nicht angetastet: ...

Soll ich diese Bereinigung so durchführen?
```

## Phase 4: Bereinigung durchführen

Nach Bestätigung in dieser Reihenfolge:

1. **Demo-Seiten:** Inhalt durch Platzhalter ersetzen.
2. **Navigation/Layout:** Links zu gestubbten Seiten entfernen.
3. **`prisma/schema.prisma`:** Irrelevante Modelle entfernen, Referenzen in verbleibenden Modellen bereinigen.
4. **`prisma/seed.ts`:** Seed-Blöcke zu entfernten Modellen entfernen.
5. **Tests:** Demo-Tests entfernen oder mit `.skip` markieren.
6. **Imports prüfen:** Alle verbleibenden Dateien auf Imports zu entfernten Entitäten oder Seiten scannen. Kaputte Imports entfernen oder ersetzen.

Prüfe nach jeder Gruppe auf TypeScript-Fehler, bevor du zur nächsten Gruppe wechselst.

## Phase 5: Build-Validierung

Nach der Bereinigung zwingend ausführen:

```bash
npm run build
```

Wenn der Build fehlschlägt:

- Fehler analysieren.
- Kaputte Imports, fehlende Typen oder Referenzen auf entfernte Entitäten reparieren.
- `npm run build` erneut ausführen.
- Wiederholen, bis der Build erfolgreich ist.

Überspringe diesen Schritt nicht und erkläre dem Nutzer nicht, dass er Fehler selbst beheben soll. Repariere selbst.

Nach erfolgreichem Build:

```bash
npm run test
```

Schlagen Tests fehl, weil sie sich auf entfernte Demo-Entitäten beziehen: Tests entfernen oder überspringen.

## Abschluss

Nach erfolgreichem Build und Tests:

1. Zusammenfassung der durchgeführten Bereinigung ausgeben.
2. Liste der veränderten Dateien ausgeben.
3. Darauf hinweisen, dass der Nutzer kurz `npm run dev` starten und prüfen soll, ob die App läuft.
4. Falls Prisma-Schema verändert wurde: Darauf hinweisen, dass `npm run db:reset` nötig ist.
5. Hinweis auf den nächsten Schritt:

```text
Nächster Schritt: Neue Agent-Session starten, /prime ausführen und mit /plan-feature das erste Feature aus dem PRD planen.
```
