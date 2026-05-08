import { requireSession } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Role } from '@/lib/auth-helpers'

export default async function DashboardPage() {
  const session = await requireSession()
  const role = session.user.role as Role

  const isApplicant = role === 'user_applicant'

  const [antragCount, eingereichtCount, genehmigt, personCount] = await Promise.all([
    isApplicant
      ? prisma.antrag.count({ where: { erstellerId: session.user.id } })
      : prisma.antrag.count(),
    isApplicant
      ? prisma.antrag.count({ where: { erstellerId: session.user.id, status: 'EINGEREICHT' } })
      : prisma.antrag.count({ where: { status: 'EINGEREICHT' } }),
    isApplicant
      ? prisma.antrag.count({ where: { erstellerId: session.user.id, status: 'GENEHMIGT' } })
      : prisma.antrag.count({ where: { status: 'GENEHMIGT' } }),
    prisma.person.count(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Willkommen, {session.user.name}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {isApplicant ? 'Meine Anträge' : 'Alle Anträge'}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{antragCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Eingereicht</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eingereichtCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Genehmigt</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{genehmigt}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Personen</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button asChild>
          <Link href="/antraege">Anträge anzeigen</Link>
        </Button>
        {(role === 'user_applicant' || role === 'admin') && (
          <Button asChild variant="outline">
            <Link href="/antraege/neu">Neuer Antrag</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
