import { requireRole } from '@/lib/auth-helpers'
import { PersonForm } from '@/components/personen/person-form'
import { createPerson } from '../actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NeuPersonPage() {
  await requireRole(['admin', 'user_reviewer'])

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/personen"><ChevronLeft className="h-4 w-4" />Zurück</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Neue Person</h1>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <PersonForm mode="create" action={createPerson} />
      </div>
    </div>
  )
}
