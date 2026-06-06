'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, FileSearch } from 'lucide-react'
import { toast } from 'sonner'

interface AntragPdfExtractButtonProps {
  antragId: string
  onExtractComplete?: () => void
}

export function AntragPdfExtractButton({ antragId, onExtractComplete }: AntragPdfExtractButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleExtract() {
    startTransition(async () => {
      try {
        const response = await fetch('/api/pdf/extract-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ antragId }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'PDF-Auslesung fehlgeschlagen')
        }

        toast.success('PDF erfolgreich ausgelesen')
        onExtractComplete?.()
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'PDF-Auslesung fehlgeschlagen')
      }
    })
  }

  return (
    <Button variant="outline" onClick={handleExtract} disabled={isPending}>
      {isPending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Auslesen läuft…</>
      ) : (
        <><FileSearch className="mr-2 h-4 w-4" /> PDF auslesen</>
      )}
    </Button>
  )
}
