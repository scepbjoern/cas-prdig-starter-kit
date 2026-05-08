import { z } from 'zod'

export const personSchema = z.object({
  vorname: z.string().min(1, 'Vorname ist erforderlich').max(100),
  nachname: z.string().min(1, 'Nachname ist erforderlich').max(100),
  email: z.string().email('Bitte eine gültige E-Mail-Adresse eingeben'),
  telefon: z.string().optional(),
  adresse: z.string().optional(),
})

export type PersonFormValues = z.infer<typeof personSchema>
