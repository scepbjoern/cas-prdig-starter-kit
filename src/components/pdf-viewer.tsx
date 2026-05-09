'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

interface PdfViewerProps {
  url: string
  dateiName?: string
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
