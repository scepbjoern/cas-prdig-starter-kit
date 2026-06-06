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

export const pdfExtractionSchema = z.object({
  verbeistandetePerson: z
    .object({ vorname: z.string().optional().default(''), nachname: z.string().optional().default('') })
    .default({ vorname: '', nachname: '' }),
  adresse: z.string().optional().default(''),
  domiziladresse: z.string().optional().default(''),
  verfuegung: z.string().optional().default(''),
  gesetzesartikel: z.string().optional().default(''),
  beistand: z
    .object({ vorname: z.string().optional().default(''), nachname: z.string().optional().default(''), telefon: z.string().optional().default('') })
    .default({ vorname: '', nachname: '', telefon: '' }),
  anlageprofil: z.string().optional().default(''),
  verfuegungsdatum: z.string().optional().default(''),
  fehlendeAngaben: z.array(z.string()).optional().default([]),
})

export type PdfExtractionResult = z.infer<typeof pdfExtractionSchema>
