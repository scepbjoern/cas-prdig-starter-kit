# Testing-Guide – Automatisierte Tests im Starter Kit

> **Für wen ist dieses Dokument?**
> Für Studierende ohne tiefes Testing-Vorwissen, die verstehen möchten, welche Tests im Projekt vorhanden sind, wer sie ausführt, und warum sie überhaupt existieren.

---

## Was ist automatisiertes Testen – und warum macht man es?

Beim manuellen Testen öffnet man die App im Browser und prüft selbst, ob alles funktioniert. Das reicht für eine kleine Änderung, wird aber schnell mühsam: Jedes Mal, wenn ihr Code ändert, müsst ihr alle Funktionen der App von Hand durchklicken – und riskiert, etwas zu übersehen.

**Automatisierte Tests** übernehmen diese Arbeit: Sie sind Programme, die eure App auf Herz und Nieren prüfen und euch in Sekunden sagen, ob etwas kaputtgegangen ist.

### Der PIV-Loop: Warum Tests zum Entwicklungsprozess gehören

In diesem Projekt arbeitet ihr nach dem **PIV-Loop**:

```
Plan  →  Implement  →  Validate  →  Commit
```

- **Plan**: Was soll gebaut werden? Akzeptanzkriterien definieren.
- **Implement**: Code schreiben – gemeinsam mit dem AI Agent.
- **Validate**: **Der AI Agent** führt `npm run test` aus, prüft das Ergebnis und behebt Fehler – automatisch, ohne dass ihr etwas tun müsst. Erst wenn alle Tests grün sind → Committen.

Tests sind also kein optionales Extra, sondern der «V»-Schritt, der euch absichert, bevor Änderungen festgeschrieben werden. Der AI Agent ist angewiesen, bei jedem neuen Feature automatisch einen passenden Test zu schreiben **und** danach die Tests auszuführen.

---

## Zwei Test-Arten im Starter Kit

| Test-Art | Tool | Was wird getestet | Befehl |
|---|---|---|---|
| **Unit Tests** | Vitest | Einzelne Funktionen und Validierungsregeln | `npm run test` |
| **E2E Tests** | Playwright | Komplette User-Flows im Browser | `npm run test:e2e` |

---

## Unit Tests mit Vitest

### Was sind Unit Tests?

Unit Tests prüfen kleine, isolierte Codeeinheiten – zum Beispiel: «Wird ein Formular korrekt abgelehnt, wenn das Titelfeld leer ist?» Sie brauchen keinen laufenden Server und sind in Millisekunden fertig.

Im Starter Kit testen Unit Tests hauptsächlich die **Zod-Validierungsschemas** (die Regeln, die bestimmen, welche Eingaben erlaubt sind) und die **Status-Übergänge** (z. B. dass ein Antrag von ENTWURF zu EINGEREICHT wechseln darf, aber nicht direkt zu GENEHMIGT).

### Unit Tests ausführen

Unit Tests laufen im PIV-Loop **automatisch durch den AI Agent**. Falls ihr sie selbst starten möchtet (z. B. zur Kontrolle):

```bash
# Einmalig ausführen
npm run test

# Im Watch-Modus: Tests laufen bei jeder Datei-Speicherung automatisch neu
npm run test:watch
```

**Erwartetes Ergebnis:** Eine Ausgabe wie `✓ 15 tests passed` – alle Tests grün.

### Wo liegen die Unit Tests?

```
__tests__/
└── unit/
    ├── schemas/
    │   ├── antrag.test.ts      ← Validierung Antrag-Formular
    │   ├── person.test.ts      ← Validierung Personen-Formular
    │   └── auth.test.ts        ← Validierung Login
    └── antrag-status.test.ts   ← Status-Übergänge
```

---

## E2E Tests mit Playwright

### Was sind E2E Tests?

E2E («End-to-End»)-Tests öffnen einen echten Browser, navigieren durch die App, füllen Formulare aus und prüfen, was auf dem Bildschirm erscheint – genau wie ein Mensch. Sie testen den **kompletten Weg** vom Login bis zum fertigen Resultat.

### Voraussetzung: Dev-Server muss laufen

E2E Tests brauchen eine laufende App. Startet den Dev-Server in einem eigenen Terminal-Fenster:

```bash
npm run dev
```

Erst dann in einem zweiten Terminal die Tests ausführen.

> **Warum nicht automatisch durch den AI Agent?** E2E Tests benötigen einen laufenden Dev-Server und sind deutlich langsamer als Unit Tests (mehrere Sekunden pro Test). Deshalb führt der AI Agent sie **nur auf explizite Anfrage** aus – zum Beispiel wenn ihr fragt: «Führe alle E2E Tests aus und zeig mir das Ergebnis.»

### E2E Tests ausführen

```bash
# Headless (kein Browser-Fenster, nur Ergebnis im Terminal)
npm run test:e2e

# Mit UI-Modus (empfohlen zum Debuggen – siehe nächsten Abschnitt)
npm run test:e2e:ui
```

### Wo liegen die E2E Tests?

```
e2e/
├── login.spec.ts       ← Login-Flow, Fehlerbehandlung, Redirect-Schutz
├── antraege.spec.ts    ← Antrag erstellen, Reviewer sieht eingereichte Anträge
└── roles.spec.ts       ← Rollenbasierte Sichtbarkeit (Navigation, Buttons)
```

### Was decken die E2E Tests ab?

| Test-Datei | Was wird getestet |
|---|---|
| `login.spec.ts` | Login mit korrekten Credentials → Dashboard; Login mit falschem Passwort → Fehlermeldung; Nicht eingeloggte Nutzer werden auf `/login` umgeleitet |
| `antraege.spec.ts` | Applicant erstellt neuen Antrag → landet auf Detailseite; Reviewer sieht eingereichte Anträge in der Liste |
| `roles.spec.ts` | Admin sieht alle Navigations-Links; Applicant sieht keinen «Löschen»-Button bei Personen |

---

## Playwright im UI-Modus – Tests visuell ausführen

Der **UI-Modus** von Playwright ist ein interaktives Werkzeug, das euch genau zeigt, was während eines Tests passiert. Ideal zum Verstehen und Debuggen.

### Starten

```bash
npm run test:e2e:ui
```

Es öffnet sich ein Fenster mit einer Liste aller Tests auf der linken Seite.

### Tests einzeln ausführen

1. In der linken Sidebar auf einen Test klicken (z. B. `login.spec.ts > Login mit Admin-Credentials erfolgreich`)
2. Auf den grünen **Pfeil-Button** (▶) neben dem Test klicken
3. Im rechten Bereich seht ihr:
   - Jeden Schritt des Tests mit Zeitstempel
   - Screenshots des Browsers für jeden Schritt («Before» / «After»)
   - Ob der Test bestanden hat (✓) oder fehlgeschlagen ist (✗)

### Einen fehlgeschlagenen Test analysieren

Wenn ein Test rot markiert ist:
1. Auf den fehlgeschlagenen Test klicken
2. Den fehlgeschlagenen Schritt anklicken – ihr seht einen Screenshot genau im Moment des Fehlers
3. Die Fehlermeldung im unteren Bereich lesen (z. B. «Expected element to be visible, but it was not found»)

---

## Wann laufen Tests – und wer führt sie aus?

| Situation | Wer | Befehl |
|---|---|---|
| Nach jeder Feature-Implementierung | **AI Agent** (automatisch) | `npm run test` |
| Vor jedem Commit | **AI Agent** (automatisch) | `npm run test` |
| Vollständiger E2E-Flow testen | Ihr (oder AI Agent auf Anfrage) | `npm run test:e2e` |
| E2E Test einzeln debuggen | Ihr | `npm run test:e2e:ui` |
| Eigene Kontrolle nach manuellen Änderungen | Ihr | `npm run test` |
| Vor einer Präsentation / Abgabe | Ihr | `npm run test && npm run test:e2e` |

---

## Was können automatisierte Tests NICHT testen?

Manche Dinge müssen weiterhin **manuell** geprüft werden:

| Was prüfen | Wie prüfen |
|---|---|
| Visuelle Gestaltung (Farben, Abstände, Fonts) | Browser öffnen, Seiten durchklicken |
| Mobile-Ansicht (Sidebar als ausklappbares Menü) | Browser-DevTools → Mobile-Ansicht (iPhone 14) |
| Toast-Meldungen (Erfolgsmeldungen nach Aktionen) | Antrag erstellen/bearbeiten → Toast erscheint kurz |
| E-Mail-Benachrichtigungen | Im Test-Modus: `EMAIL_DEBUG_MODE=true` → Mails an eure Test-Adresse |
| Langsame Verbindungen | DevTools → Network → «Slow 3G» → Ladeanimationen testen |

---

## Häufige Probleme

**«E2E Tests schlagen alle fehl, obwohl die App funktioniert»**
→ Läuft der Dev-Server? E2E Tests brauchen `npm run dev` in einem separaten Terminal.

**«Unit Tests schlagen fehl nach Schema-Änderung»**
→ Unit Tests prüfen eure Zod-Schemas. Wenn ihr das Datenmodell ändert, müssen die Tests angepasst werden – bittet den AI Agent darum.

**«Playwright findet keine Browser-Installation»**
→ Browser einmalig installieren:
```bash
npx playwright install chromium
```

**«Test schlägt fehl: Element not found»**
→ Öffnet `npm run test:e2e:ui`, klickt den Test an und schaut den Screenshot beim fehlgeschlagenen Schritt an. Oft ist der UI-Text oder eine CSS-Klasse leicht anders als erwartet.
