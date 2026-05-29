import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'sqlite' }),
  emailAndPassword: { enabled: true, minPasswordLength: 1 },
  user: {
    additionalFields: {
      role: { type: 'string', defaultValue: 'user_applicant' }
    }
  }
})
