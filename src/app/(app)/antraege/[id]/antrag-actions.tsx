'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { submitAntrag, decideAntrag, deleteAntrag } from '../actions'
import type { AntragStatus } from '@/generated/prisma/enums'

export function SubmitButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" disabled={isPending}>Einreichen</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Antrag einreichen?</DialogTitle>
          <DialogDescription>Der Antrag wird zur Prüfung eingereicht und kann danach nicht mehr bearbeitet werden.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => startTransition(async () => {
              try { await submitAntrag(id); toast.success('Antrag eingereicht') }
              catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Fehler') }
            })}
            disabled={isPending}
          >
            {isPending ? 'Wird eingereicht...' : 'Ja, einreichen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function DecideButton({ id, newStatus, label, variant }: {
  id: string
  newStatus: AntragStatus
  label: string
  variant?: 'default' | 'destructive' | 'outline'
}) {
  const [isPending, startTransition] = useTransition()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant ?? 'default'} disabled={isPending}>{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}?</DialogTitle>
          <DialogDescription>Diese Aktion kann nicht rückgängig gemacht werden.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={variant ?? 'default'}
            onClick={() => startTransition(async () => {
              try { await decideAntrag(id, newStatus); toast.success(`Antrag ${label.toLowerCase()}`) }
              catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Fehler') }
            })}
            disabled={isPending}
          >
            {isPending ? '...' : 'Bestätigen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={isPending}>Löschen</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Antrag löschen?</DialogTitle>
          <DialogDescription>Der Antrag wird unwiderruflich gelöscht.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => startTransition(async () => {
              try { await deleteAntrag(id); toast.success('Antrag gelöscht') }
              catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Fehler') }
            })}
            disabled={isPending}
          >
            {isPending ? 'Löschen...' : 'Ja, löschen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
