import { headers } from 'next/headers'
import { auth } from './auth'
import { redirect } from 'next/navigation'

export type Role = 'admin' | 'user_reviewer' | 'user_applicant'

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function requireSession() {
  const session = await getSession()
  if (!session) redirect('/login')
  return session
}

export async function requireRole(roles: Role[]) {
  const session = await requireSession()
  if (!roles.includes(session.user.role as Role)) {
    redirect('/')
  }
  return session
}
