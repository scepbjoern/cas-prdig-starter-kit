'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { deletePerson } from '../actions'

export function DeletePersonButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={isPending}>Löschen</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Person löschen?</DialogTitle>
          <DialogDescription>Diese Aktion kann nicht rückgängig gemacht werden.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => startTransition(async () => {
              try { await deletePerson(id); toast.success('Person gelöscht') }
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
