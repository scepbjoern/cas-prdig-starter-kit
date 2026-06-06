'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()

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
        credentials: 'same-origin',
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(data?.error || response.statusText || 'Upload fehlgeschlagen')
      }

      const { dateiPfad, dateiName } = data ?? {}
      if (!dateiPfad || !dateiName) {
        throw new Error('Ungültige Antwort vom Upload-Server')
      }

      await uploadAntragDokument(antragId, dateiPfad, dateiName)
      toast.success('Dokument erfolgreich hochgeladen')
      router.refresh()
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
