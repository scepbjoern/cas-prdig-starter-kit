import { requireSession } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import type { Role } from '@/lib/auth-helpers'

export default async function PersonenPage() {
  const session = await requireSession()
  const role = session.user.role as Role
  const canWrite = role === 'admin' || role === 'user_reviewer'

  const personen = await prisma.person.findMany({ orderBy: { nachname: 'asc' } })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Personen</h1>
        {canWrite && (
          <Button asChild>
            <Link href="/personen/neu">Neue Person</Link>
          </Button>
        )}
      </div>

      {personen.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          Noch keine Personen vorhanden.
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {personen.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.vorname} {p.nachname}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.telefon ?? '–'}</TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/personen/${p.id}`}>Details</Link>
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
