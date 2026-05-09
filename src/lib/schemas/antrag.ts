import { z } from 'zod'

export const antragCreateSchema = z.object({
  titel: z.string().min(1, 'Titel ist erforderlich').max(200),
  beschreibung: z.string().optional(),
})

export const antragUpdateSchema = antragCreateSchema

export const antragIdSchema = z.string().cuid()

export const antragStatusSchema = z.object({
  status: z.enum(['ENTWURF', 'EINGEREICHT', 'GENEHMIGT', 'ABGELEHNT']),
})

export const antragUploadSchema = z.object({
  dateiPfad: z.string().startsWith('/uploads/'),
  dateiName: z.string().min(1),
})

export type AntragCreateValues = z.infer<typeof antragCreateSchema>
export type AntragUpdateValues = z.infer<typeof antragUpdateSchema>
