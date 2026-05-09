'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Sparkles } from 'lucide-react'

export default function AiDemoPage() {
  const [eingabe, setEingabe] = useState('')
  const [antwort, setAntwort] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleVerbessern() {
    if (!eingabe.trim()) return
    startTransition(async () => {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Verbessere den folgenden Antrag-Text sprachlich und inhaltlich.
Mache ihn klarer, professioneller und vollständiger.
Ursprünglicher Text:\n\n${eingabe}`
        }),
      })
      const data = await response.json()
      setAntwort(data.antwort ?? data.error ?? 'Unbekannter Fehler')
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">KI-Assistent</h1>
        <p className="text-muted-foreground">Antrag-Text mit KI verbessern lassen</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ihr Antrag-Text</CardTitle>
          <CardDescription>Geben Sie Ihren Text ein – die KI formuliert ihn professioneller.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Ich möchte einen Urlaubsantrag stellen weil ich müde bin und meine Familie besuchen will..."
            value={eingabe}
            onChange={(e) => setEingabe(e.target.value)}
            rows={6}
          />
          <Button onClick={handleVerbessern} disabled={isPending || !eingabe.trim()}>
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> KI denkt nach…</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> Text verbessern</>
            )}
          </Button>
        </CardContent>
      </Card>

      {antwort && (
        <Card>
          <CardHeader>
            <CardTitle>Verbesserter Text</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{antwort}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setEingabe(antwort)}
            >
              Übernehmen
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
