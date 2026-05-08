import { AntragStatus } from '@/generated/prisma/enums'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

export const ANTRAG_STATUS_LABEL: Record<AntragStatus, string> = {
  ENTWURF: 'Entwurf',
  EINGEREICHT: 'Eingereicht',
  GENEHMIGT: 'Genehmigt',
  ABGELEHNT: 'Abgelehnt',
}

export const ANTRAG_STATUS_VARIANT: Record<AntragStatus, BadgeVariant> = {
  ENTWURF: 'secondary',
  EINGEREICHT: 'default',
  GENEHMIGT: 'outline',
  ABGELEHNT: 'destructive',
}

export const ANTRAG_STATUS_TRANSITIONS: Record<AntragStatus, AntragStatus[]> = {
  ENTWURF: ['EINGEREICHT'],
  EINGEREICHT: ['GENEHMIGT', 'ABGELEHNT'],
  GENEHMIGT: [],
  ABGELEHNT: [],
}
