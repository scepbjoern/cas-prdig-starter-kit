import { LayoutDashboard, FileText, Users, Sparkles, type LucideIcon } from 'lucide-react'
import type { Role } from './auth-helpers'

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  roles: Role[]
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'user_reviewer', 'user_applicant'],
  },
  {
    href: '/antraege',
    label: 'Anträge',
    icon: FileText,
    roles: ['admin', 'user_reviewer', 'user_applicant'],
  },
  {
    href: '/personen',
    label: 'Personen',
    icon: Users,
    roles: ['admin', 'user_reviewer', 'user_applicant'],
  },
  {
    href: '/ai-demo',
    label: 'KI-Assistent',
    icon: Sparkles,
    roles: ['admin', 'user_applicant', 'user_reviewer'],
  },
]
