import { requireSession } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ANTRAG_STATUS_LABEL, ANTRAG_STATUS_VARIANT } from '@/lib/antrag-status'
import Link from 'next/link'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import type { Role } from '@/lib/auth-helpers'
import type { AntragStatus } from '@/generated/prisma/enums'

export default async function AntraegePage() {
  const session = await requireSession()
  const role = session.user.role as Role

  const antraege = await prisma.antrag.findMany({
    where: role === 'user_applicant' ? { erstellerId: session.user.id } : undefined,
    include: { ersteller: { select: { name: true } } },
    orderBy: { erstelltAm: 'desc' },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Anträge</h1>
        {(role === 'user_applicant' || role === 'admin') && (
          <Button asChild>
            <Link href="/antraege/neu">Neuer Antrag</Link>
          </Button>
        )}
      </div>

      {antraege.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          Noch keine Anträge vorhanden.
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ersteller</TableHead>
                <TableHead>Erstellt am</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {antraege.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.titel}</TableCell>
                  <TableCell>
                    <Badge variant={ANTRAG_STATUS_VARIANT[a.status as AntragStatus]}>
                      {ANTRAG_STATUS_LABEL[a.status as AntragStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell>{a.ersteller.name}</TableCell>
                  <TableCell>
                    {format(new Date(a.erstelltAm), 'dd.MM.yyyy', { locale: de })}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/antraege/${a.id}`}>Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
