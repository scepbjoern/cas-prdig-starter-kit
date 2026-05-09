# Teil 5: Dateiupload und -anzeige (PDF)

> **Hauptdokument:** `impl-00-einstieg.md` → Stack-Entscheidung: `public/uploads/` + Node.js `fs`  
> **Tech-Stack-Entscheidungen:** `impl-00-tech-stack-decisions.md` → Abschnitt 5 (File Storage)  
> **Voraussetzungen:** Teil 1 (impl-01-basics.md) vollständig umgesetzt

---

## Übersicht

| Feature | Lösung | Dependencies |
|---|---|---|
| Upload | Route Handler + Node.js `fs` | – (kein Zusatzpaket lokal) |
| PDF-Anzeige | `react-pdf` + `pdfjs-dist` | `react-pdf`, `pdfjs-dist` |
| Cloud-Variante | UploadThing | `uploadthing` (auskommentiert) |

**Warum `react-pdf`?** Vollständige Kontrolle (Seiten, Zoom, Navigation), bereits im cas-crm-mock erprobt, bewährtes Community-Paket für Next.js.

**Warum nicht `<iframe>`?** Iframes für PDFs funktionieren nicht auf allen Mobilgeräten und bieten keine programmatische Kontrolle. Für Demo-Zwecke ist `react-pdf` besser geeignet.

---

## Schritt 5.0 – Prisma-Schema erweitern

> ⚠️ **Schema-Änderung! `db:reset` erforderlich** – alle bestehenden Daten gehen verloren.

`prisma/schema.prisma` – `Antrag`-Modell erweitern:
```prisma
model Antrag {
  id             String       @id @default(cuid())
  titel          String
  beschreibung   String?
  status         AntragStatus @default(ENTWURF)
  erstellerId    String
  ersteller      User         @relation(fields: [erstellerId], references: [id], onDelete: Cascade)
  erstelltAm     DateTime     @default(now())
  aktualisiertAm DateTime     @updatedAt

  // NEU: Hochgeladenes Dokument
  dateiPfad      String?      // Pfad: /uploads/dateiname.pdf
  dateiName      String?      // Originaldateiname für Anzeige

  @@map("antraege")
}
```

Auch `prisma/seed.ts` anpassen: Die vorhandenen `createMany`-Einträge bleiben unverändert (neue Felder sind optional).

```
Bitte befolge den Workflow in docs/SCHEMA_RESET_WORKFLOW.md:
npx prisma db push --force-reset
npx prisma db seed
```

---

## Schritt 5.1 – `public/uploads/` Verzeichnis anlegen

```bash
# Ordner anlegen
mkdir public/uploads

# Platzhalter-Datei damit Git den leeren Ordner trackt
echo "" > public/uploads/.gitkeep
```

`.gitignore` ergänzen (hochgeladene Dateien nicht committen):
```gitignore
# Hochgeladene Dateien (lokal, nicht committen)
public/uploads/*
!public/uploads/.gitkeep
```

---

## Schritt 5.2 – Upload Route Handler

**Datei:** `src/app/api/upload/route.ts` (neu erstellen)

```typescript
// Route Handler für Datei-Upload: Speichert PDFs in public/uploads/
// Nur eingeloggte Nutzer können Dateien hochladen
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { getSession } from '@/lib/auth-helpers'

// Maximale Dateigrösse: 10 MB
const MAX_SIZE_BYTES = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Keine Datei übermittelt' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Nur PDF-Dateien erlaubt' }, { status: 400 })
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Datei zu gross (max. 10 MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Eindeutiger Dateiname: timestamp-originalname.pdf
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}-${safeName}`

    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    return NextResponse.json({
      dateiPfad: `/uploads/${fileName}`,
      dateiName: file.name,
    })
  } catch (error) {
    console.error('Upload-Fehler:', error)
    return NextResponse.json({ error: 'Upload fehlgeschlagen' }, { status: 500 })
  }
}
```

Middleware: `/api/upload` ist bereits durch die bestehende Session-Prüfung im Handler abgesichert. Keine `PUBLIC_PATHS`-Änderung nötig.

---

## Schritt 5.3 – Zod-Schema + Server Action erweitern

**`src/lib/schemas/antrag.ts`** – Upload-Schema ergänzen:
```typescript
export const antragUploadSchema = z.object({
  dateiPfad: z.string().startsWith('/uploads/'),
  dateiName: z.string().min(1),
})
```

**`src/app/(app)/antraege/actions.ts`** – `uploadAntragDokument` Action hinzufügen:
```typescript
// Verknüpft hochgeladene Datei mit einem Antrag
export async function uploadAntragDokument(antragId: string, dateiPfad: string, dateiName: string) {
  const session = await requireSession()
  
  // Nur Eigentümer oder Admin dürfen Datei hochladen
  const antrag = await prisma.antrag.findUniqueOrThrow({ where: { id: antragId } })
  if (session.user.role !== 'admin' && antrag.erstellerId !== session.user.id) {
    throw new Error('Keine Berechtigung')
  }

  await prisma.antrag.update({
    where: { id: antragId },
    data: { dateiPfad, dateiName },
  })

  revalidatePath(`/antraege/${antragId}`)
}
```

---

## Schritt 5.4 – Upload-Komponente

**Datei:** `src/components/antraege/antrag-upload.tsx` (Client Component)

```typescript
'use client'
// Komponente zum Hochladen einer PDF-Datei für einen Antrag
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { uploadAntragDokument } from '@/app/(app)/antraege/actions'

interface AntragUploadProps {
  antragId: string
}

export function AntragUpload({ antragId }: AntragUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleDateiAusgewaehlt(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload fehlgeschlagen')
      }

      const { dateiPfad, dateiName } = await response.json()
      await uploadAntragDokument(antragId, dateiPfad, dateiName)
      toast.success('Dokument erfolgreich hochgeladen')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload fehlgeschlagen')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleDateiAusgewaehlt}
      />
      <Button
        variant="outline"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Wird hochgeladen…</>
        ) : (
          <><Upload className="mr-2 h-4 w-4" /> Dokument hochladen</>
        )}
      </Button>
    </div>
  )
}
```

---

## Schritt 5.5 – PDF-Viewer-Komponente

### Dependencies installieren
```bash
npm install react-pdf pdfjs-dist
```

### Worker-Konfiguration in `next.config.ts`

```typescript
// next.config.ts – Worker-Datei für pdfjs-dist kopieren
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  webpack: (config) => {
    // PDF.js Worker als statische Datei bereitstellen
    config.resolve.alias['pdfjs-dist/build/pdf.worker.entry'] = path.join(
      __dirname,
      'node_modules/pdfjs-dist/build/pdf.worker.mjs'
    )
    return config
  },
}

export default nextConfig
```

### Komponente

**Datei:** `src/components/pdf-viewer.tsx` (Client Component)

```typescript
'use client'
// PDF-Viewer-Komponente: Zeigt ein PDF mit Seiten-Navigation an
// Nutzt react-pdf + pdfjs-dist
import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Worker-URL für PDF.js setzen
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

interface PdfViewerProps {
  url: string          // z.B. '/uploads/123-dokument.pdf'
  dateiName?: string   // Optionaler Anzeigename
}

export function PdfViewer({ url, dateiName }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {dateiName && (
        <p className="text-sm text-muted-foreground font-medium">{dateiName}</p>
      )}

      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div className="animate-pulse h-[600px] w-full bg-muted rounded" />}
        error={<p className="text-destructive">PDF konnte nicht geladen werden.</p>}
      >
        <Page
          pageNumber={pageNumber}
          width={600}
          renderTextLayer={true}
          renderAnnotationLayer={true}
        />
      </Document>

      {numPages > 1 && (
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Seite {pageNumber} von {numPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <a
        href={url}
        download={dateiName}
        className="text-sm text-primary hover:underline"
      >
        PDF herunterladen
      </a>
    </div>
  )
}
```

---

## Schritt 5.6 – Integration in Antrag-Detailseite

**`src/app/(app)/antraege/[id]/page.tsx`** – Abschnitt für Dokument ergänzen:

```typescript
// Im Server Component: Antrag-Daten laden (inkl. dateiPfad, dateiName)
// ...
{/* Dokument-Bereich */}
<Card>
  <CardHeader>
    <CardTitle>Begleitdokument</CardTitle>
  </CardHeader>
  <CardContent>
    {antrag.dateiPfad ? (
      // PdfViewer als Client Component einbinden
      <PdfViewer url={antrag.dateiPfad} dateiName={antrag.dateiName ?? undefined} />
    ) : (
      <div className="text-muted-foreground text-sm">Kein Dokument hochgeladen.</div>
    )}
    {/* Upload nur für Eigentümer oder Admin im Status ENTWURF */}
    {(session.user.role === 'admin' || antrag.erstellerId === session.user.id) && 
     antrag.status === 'ENTWURF' && (
      <AntragUpload antragId={antrag.id} />
    )}
  </CardContent>
</Card>
```

---

## Akzeptanzkriterien

- [ ] `npm run build` fehlerfrei nach `npm install react-pdf pdfjs-dist`
- [ ] PDF hochladen: Datei erscheint in `public/uploads/`
- [ ] PDF anzeigen: Seiten werden korrekt gerendert
- [ ] Nur Eigentümer/Admin können im Status ENTWURF hochladen
- [ ] Fehler bei zu grosser Datei oder falschem Dateityp werden angezeigt

---

## Cloud-Variante: UploadThing (auskommentiert)

> Für Deployment auf Vercel: `public/uploads/` ist ephemeral. UploadThing ersetzt den lokalen Upload.
>
> Für weitere Details: `docs/UPLOADTHING_SETUP.md`

```typescript
// Auskommentierte UploadThing-Alternative:
// import { generateUploadButton } from '@uploadthing/react'
// import type { OurFileRouter } from '@/app/api/uploadthing/core'
// const UploadButton = generateUploadButton<OurFileRouter>()
```

---

## Nächste Schritte

- **Teil 7** (AI): `docs/impl-07-ai.md` baut auf hochgeladenen PDFs auf (Dokumentenanalyse)
- **Teil 6** (E-Mail): `docs/impl-06-email.md`
