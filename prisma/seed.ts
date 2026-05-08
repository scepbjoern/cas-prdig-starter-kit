// Seed-Datei: Erstellt Demo-Nutzer und Testdaten
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { auth } from '../src/lib/auth'
 
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Lösche bestehende Daten...')
  await prisma.antrag.deleteMany()
  await prisma.person.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  console.log('Erstelle Benutzer...')
  // Admin-Benutzer
  await auth.api.signUpEmail({
    body: { email: 'admin@example.com', password: 'admin123', name: 'Admin Benutzer' }
  })
  await prisma.user.update({
    where: { email: 'admin@example.com' },
    data: { role: 'admin' }
  })

  // Antragsteller
  await auth.api.signUpEmail({
    body: { email: 'applicant@example.com', password: 'applicant123', name: 'Test Antragsteller' }
  })
  // role bleibt 'user_applicant' (Default)

  // Prüfer
  await auth.api.signUpEmail({
    body: { email: 'reviewer@example.com', password: 'reviewer123', name: 'Test Prüfer' }
  })
  await prisma.user.update({
    where: { email: 'reviewer@example.com' },
    data: { role: 'user_reviewer' }
  })

  const applicant = await prisma.user.findUniqueOrThrow({ where: { email: 'applicant@example.com' } })
  const admin = await prisma.user.findUniqueOrThrow({ where: { email: 'admin@example.com' } })

  console.log('Erstelle Demo-Anträge...')
  await prisma.antrag.createMany({
    data: [
      { titel: 'Urlaubsantrag Juli', beschreibung: 'Urlaub vom 1.–14. Juli', status: 'EINGEREICHT', erstellerId: applicant.id },
      { titel: 'Weiterbildungsantrag', beschreibung: 'CAS Kurs ZHAW', status: 'GENEHMIGT', erstellerId: applicant.id },
      { titel: 'Materialbestellung', status: 'ENTWURF', erstellerId: applicant.id },
    ]
  })

  console.log('Erstelle Demo-Personen...')
  await prisma.person.createMany({
    data: [
      { vorname: 'Maria', nachname: 'Muster', email: 'maria.muster@example.com', telefon: '+41 79 123 45 67' },
      { vorname: 'Hans', nachname: 'Beispiel', email: 'hans.beispiel@example.com' },
      { vorname: 'Anna', nachname: 'Test', email: 'anna.test@example.com', adresse: 'Musterstrasse 1, 8000 Zürich' },
    ]
  })

  console.log('✓ Seed abgeschlossen')
  console.log('  Admin:      admin@example.com / admin123')
  console.log('  Applicant:  applicant@example.com / applicant123')
  console.log('  Reviewer:   reviewer@example.com / reviewer123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())