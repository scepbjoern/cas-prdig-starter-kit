# Datei-Upload, Anzeige und Download

Das Starter Kit enthält ein vollständiges Dateiupload-Feature für PDF-Dokumente. Antragsteller können Begleitdokumente zu ihren Anträgen hochladen; Reviewer und Admins sehen diese direkt im Browser und können sie herunterladen.

---

## Übersicht

| Feature | Lösung | Einschränkung |
|---|---|---|
| Upload | `POST /api/upload` + Node.js `fs` | Nur PDF, max. 10 MB |
| Anzeige | `react-pdf` (Client Component) | Seiten-Navigation enthalten |
| Download | Direkter `<a download>`-Link | Datei wird im Original-Format heruntergeladen |
| Speicherort (lokal) | `public/uploads/` | Nicht persistent auf Vercel |
| Speicherort (Cloud) | UploadThing | Für Vercel-Deployment nötig |

---

## Rollen und Berechtigungen

| Aktion | Antragsteller | Reviewer | Admin |
|---|---|---|---|
| Datei hochladen | Nur eigene Anträge im Status `ENTWURF` | – | Alle Anträge im Status `ENTWURF` |
| Datei anzeigen | Nur eigene Anträge | Alle Anträge | Alle Anträge |
| Datei herunterladen | Nur eigene Anträge | Alle Anträge | Alle Anträge |

---

## Datei hochladen

1. Als `applicant@example.com` (oder `admin@example.com`) anmelden
2. Einen Antrag im Status **«Entwurf»** öffnen
3. In der Karte **«Begleitdokument»** auf **«Dokument hochladen»** klicken
4. Eine PDF-Datei auswählen (max. 10 MB)
5. Der Upload läuft im Hintergrund – ein Spinner zeigt den Fortschritt an
6. Nach Abschluss erscheint das PDF sofort im Viewer unterhalb des Buttons

> Nur PDF-Dateien werden akzeptiert. Bei falschen Dateitypen oder zu grosser Datei erscheint eine Fehlermeldung (Toast-Notification unten rechts).

---

## PDF anzeigen

Sobald ein Dokument hochgeladen wurde, erscheint es in der Karte **«Begleitdokument»** auf der Antrag-Detailseite:

- Das PDF wird direkt im Browser gerendert (keine externe Anwendung nötig)
- Bei mehrseitigen Dokumenten stehen Pfeiltasten zur Seitennavigation bereit («Seite X von N»)
- Der Dateiname des Originals wird als Beschriftung angezeigt

**Wer sieht den Viewer?**
- Antragsteller: nur bei eigenen Anträgen
- Reviewer und Admin: bei allen Anträgen, sobald ein Dokument vorhanden ist

---

## Datei herunterladen

Unterhalb des PDF-Viewers befindet sich ein Link **«PDF herunterladen»**. Ein Klick lädt die Datei mit dem originalen Dateinamen herunter.

Der Direktlink zur Datei hat das Format:
```
/uploads/<timestamp>-<dateiname>.pdf
```

---

## Architektur

```
public/uploads/              # Speicherort der hochgeladenen Dateien (lokal)

src/app/api/upload/
  route.ts                   # POST-Endpunkt: Datei prüfen, speichern, Pfad zurückgeben

src/app/(app)/antraege/
  actions.ts                 # Server Action: Pfad in Antrag.dateiPfad speichern

src/components/antraege/
  antrag-upload.tsx          # Client Component: Upload-Button + fetch() an /api/upload

src/components/
  pdf-viewer.tsx             # Client Component: react-pdf mit Seiten-Navigation + Download-Link
```

**Datenfluss beim Upload:**

```
Browser → fetch POST /api/upload (multipart/form-data)
  → route.ts: Typ und Grösse prüfen, Datei in public/uploads/ schreiben
    → JSON { dateiPfad, dateiName } zurückgeben
      → uploadAntragDokument() Server Action: prisma.antrag.update({ dateiPfad, dateiName })
        → revalidatePath() → Seite neu laden → PdfViewer erscheint
```

---

## Prisma-Schema

Die Upload-Felder im `Antrag`-Modell (`prisma/schema.prisma`):

```prisma
dateiPfad  String?  // Pfad: /uploads/timestamp-dateiname.pdf
dateiName  String?  // Originaldateiname für Anzeige und Download
```

Beide Felder sind optional – Anträge ohne Dokument sind gültig.

---

## Fehlerbehebung

| Problem | Mögliche Ursache | Lösung |
|---|---|---|
| Upload-Button erscheint nicht | Antrag ist nicht im Status `ENTWURF` oder fremder Antrag | Status prüfen; als Admin oder Eigentümer einloggen |
| «Nur PDF-Dateien erlaubt» | Falscher Dateityp gewählt | Eine `.pdf`-Datei auswählen |
| «Datei zu gross» | Datei überschreitet 10 MB | Datei komprimieren oder kleineres Dokument wählen |
| PDF lädt nicht | Worker-Konfiguration fehlt | `next.config.ts` prüfen: pdfjs-dist Worker-Alias muss eingetragen sein |
| Datei nach Neustart weg | Vercel löscht `public/uploads/` | Auf UploadThing wechseln (siehe unten) |
| `public/uploads/` nicht vorhanden | Ordner fehlt im Repository | `mkdir public/uploads && echo "" > public/uploads/.gitkeep` ausführen |

---

## Cloud-Deployment: UploadThing

Auf Vercel ist das lokale Dateisystem ephemeral – hochgeladene Dateien gehen bei jedem Deployment verloren. Für persistente Dateiablage im Cloud-Deployment: **UploadThing** verwenden.

> Detaillierte Anleitung: [`UPLOADTHING_SETUP.md`](UPLOADTHING_SETUP.md)

---

## Weiterführende Dokumente

- [`../starter-kit-erstellung/impl-05-file-upload.md`](../starter-kit-erstellung/impl-05-file-upload.md) – Implementierungsanleitung mit vollständigem Code
- [`UPLOADTHING_SETUP.md`](UPLOADTHING_SETUP.md) – Umstieg auf Cloud-Dateiablage
- [`LLM_INTEGRATION.md`](LLM_INTEGRATION.md) – KI-Dokumentenanalyse baut auf hochgeladenen PDFs auf
