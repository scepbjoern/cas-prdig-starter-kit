'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Brain } from 'lucide-react'
import { toast } from 'sonner'

interface AntragAnalyseButtonProps {
  antragId: string
  onAnalyseComplete?: () => void
}

export function AntragAnalyseButton({ antragId, onAnalyseComplete }: AntragAnalyseButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleAnalyse() {
    startTransition(async () => {
      const response = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ antragId }),
      })

      if (response.ok) {
        toast.success('Dokument erfolgreich analysiert')
        onAnalyseComplete?.()
      } else {
        const data = await response.json()
        toast.error(data.error ?? 'Analyse fehlgeschlagen')
      }
    })
  }

  return (
    <Button variant="outline" onClick={handleAnalyse} disabled={isPending}>
      {isPending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyse läuft…</>
      ) : (
        <><Brain className="mr-2 h-4 w-4" /> Dokument analysieren</>
      )}
    </Button>
  )
}
