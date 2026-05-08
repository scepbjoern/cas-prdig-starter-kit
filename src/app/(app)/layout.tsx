import { requireSession } from '@/lib/auth-helpers'
import { Sidebar, MobileSidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import type { Role } from '@/lib/auth-helpers'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireSession()
  const role = session.user.role as Role

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center md:hidden">
          <MobileSidebar role={role} />
        </div>
        <Topbar
          name={session.user.name}
          email={session.user.email}
          role={role}
        />
        <main className="flex-1 overflow-y-auto bg-muted/40 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
