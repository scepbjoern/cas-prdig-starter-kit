import { requireSession } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { ANTRAG_STATUS_LABEL, ANTRAG_STATUS_VARIANT } from '@/lib/antrag-status'
import { SubmitButton, DecideButton, DeleteButton } from './antrag-actions'
import { AntragUpload } from '@/components/antraege/antrag-upload'
import { AntragAnalyseButton } from '@/components/antraege/antrag-analyse-button'
import { AntragPdfExtractButton } from '@/components/antraege/antrag-pdf-extract-button'
import { PdfViewer } from '@/components/pdf-viewer'
import type { Role } from '@/lib/auth-helpers'
import type { AntragStatus } from '@/generated/prisma/enums'

export default async function AntragDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await requireSession()
  const role = session.user.role as Role

  const antrag = await prisma.antrag.findUnique({
    where: { id },
    include: { ersteller: { select: { name: true, email: true } } },
  })

  if (!antrag) notFound()

  const isOwner = antrag.erstellerId === session.user.id
  const isAdmin = role === 'admin'
  const isReviewer = role === 'user_reviewer'
  const status = antrag.status as AntragStatus

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/antraege">
            <ChevronLeft className="h-4 w-4" />
            Zurück
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{antrag.titel}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span>Details</span>
            <Badge variant={ANTRAG_STATUS_VARIANT[status]}>
              {ANTRAG_STATUS_LABEL[status]}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {antrag.beschreibung && (
            <p className="text-muted-foreground">{antrag.beschreibung}</p>
          )}
          <div className="grid grid-cols-2 gap-2 text-muted-foreground">
            <span>Ersteller</span>
            <span>{antrag.ersteller.name}</span>
            <span>Erstellt am</span>
            <span>{format(new Date(antrag.erstelltAm), 'dd.MM.yyyy HH:mm', { locale: de })}</span>
            <span>Aktualisiert</span>
            <span>{format(new Date(antrag.aktualisiertAm), 'dd.MM.yyyy HH:mm', { locale: de })}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Begleitdokument</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {antrag.dateiPfad ? (
            <PdfViewer url={antrag.dateiPfad} dateiName={antrag.dateiName ?? undefined} />
          ) : (
            <div className="text-muted-foreground text-sm">Kein Dokument hochgeladen.</div>
          )}
          {(isAdmin || isOwner) && status === 'ENTWURF' && (
            <AntragUpload antragId={antrag.id} />
          )}
        </CardContent>
      </Card>

      {(isAdmin || isReviewer || isOwner) && antrag.dateiPfad && (() => {
        const extractedData = antrag.kiAnalyse ? JSON.parse(antrag.kiAnalyse) : null
        const hasExtraction = extractedData?.verbeistandetePerson

        return (
          <Card>
            <CardHeader>
              <CardTitle>PDF-Auslesung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasExtraction ? (
                <div className="space-y-3 text-sm">
                  {extractedData.fehlendeAngaben?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Pflichtdokument erkannt und die strukturierten Angaben wurden erfasst.
                    </p>
                  ) : (
                    <div className="rounded border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                      <p className="font-medium">Unvollständiges Pflichtdokument</p>
                      <p>
                        Das Dokument wurde eingelesen, aber es fehlen noch wichtige Pflichtangaben.
                        Bitte prüfen Sie das hochgeladene PDF.
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div>
                      <p className="font-medium">Verbeiständete Person</p>
                      <p>{`${extractedData.verbeistandetePerson.vorname} ${extractedData.verbeistandetePerson.nachname}`.trim() || 'Keine Angabe'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p>{extractedData.adresse || 'Keine Angabe'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Domiziladresse</p>
                      <p>{extractedData.domiziladresse || 'Keine Angabe'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Beistand</p>
                      <p>{`${extractedData.beistand.vorname} ${extractedData.beistand.nachname}`.trim() || 'Keine Angabe'}</p>
                      <p className="text-muted-foreground">{extractedData.beistand.telefon || 'Keine Telefonnummer'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Verfügung vom</p>
                      <p>{extractedData.verfuegungsdatum || 'Keine Angabe'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Gesetzesartikel</p>
                      <p>{extractedData.gesetzesartikel || 'Keine Angabe'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Verfügung</p>
                    <pre className="whitespace-pre-wrap rounded border border-muted p-3 text-sm">{extractedData.verfuegung || 'Keine Angabe'}</pre>
                  </div>
                  <div>
                    <p className="font-medium">Anlageprofil</p>
                    <p>{extractedData.anlageprofil || 'Keine Angabe'}</p>
                  </div>
                  {extractedData.fehlendeAngaben?.length > 0 && (
                    <div className="rounded border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                      <p className="font-medium">Fehlende Angaben</p>
                      <ul className="list-disc pl-5">
                        {extractedData.fehlendeAngaben.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Noch keine PDF-Auslesung vorhanden.</p>
              )}
              <AntragPdfExtractButton antragId={antrag.id} />
            </CardContent>
          </Card>
        )
      })()}

      {antrag.notizen && (
        <Card>
          <CardHeader><CardTitle>Kommunikationsverlauf</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap font-mono bg-muted p-4 rounded">
              {antrag.notizen}
            </pre>
          </CardContent>
        </Card>
      )}

      {(isAdmin || isReviewer) && antrag.dateiPfad && (() => {
        const kiAnalyse = antrag.kiAnalyse ? JSON.parse(antrag.kiAnalyse) : null
        return (
          <Card>
            <CardHeader>
              <CardTitle>KI-Dokumentenanalyse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {kiAnalyse ? (
                <div className="space-y-3">
                  <p className="text-sm">{kiAnalyse.zusammenfassung}</p>
                  {kiAnalyse.kernpunkte?.length > 0 && (
                    <ul className="text-sm list-disc pl-4 space-y-1">
                      {kiAnalyse.kernpunkte.map((p: string, i: number) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  )}
                  {kiAnalyse.empfehlung && (
                    <p className="text-sm font-medium">Empfehlung: {kiAnalyse.empfehlung}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Noch keine Analyse vorhanden.</p>
              )}
              <AntragAnalyseButton antragId={antrag.id} />
            </CardContent>
          </Card>
        )
      })()}

      <div className="flex flex-wrap gap-2">
        {/* Einreichen – Ersteller bei ENTWURF */}
        {status === 'ENTWURF' && (isOwner || isAdmin) && (
          <SubmitButton id={antrag.id} />
        )}

        {/* Bearbeiten – Ersteller/Admin bei ENTWURF */}
        {status === 'ENTWURF' && (isOwner || isAdmin) && (
          <Button asChild variant="outline">
            <Link href={`/antraege/${antrag.id}/bearbeiten`}>Bearbeiten</Link>
          </Button>
        )}

        {/* Entscheiden – Reviewer/Admin bei EINGEREICHT */}
        {status === 'EINGEREICHT' && (isReviewer || isAdmin) && (
          <>
            <DecideButton id={antrag.id} newStatus="GENEHMIGT" label="Genehmigen" variant="default" />
            <DecideButton id={antrag.id} newStatus="ABGELEHNT" label="Ablehnen" variant="destructive" />
          </>
        )}

        {/* Löschen */}
        {(isAdmin || (isOwner && status === 'ENTWURF')) && (
          <DeleteButton id={antrag.id} />
        )}
      </div>
    </div>
  )
}
