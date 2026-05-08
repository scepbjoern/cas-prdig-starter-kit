'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { NAV_ITEMS } from '@/lib/navigation'
import type { Role } from '@/lib/auth-helpers'
import { cn } from '@/lib/utils'

interface SidebarProps {
  role: Role
}

function NavLinks({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname()
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => {
        const Icon = item.icon
        const isActive =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function Sidebar({ role }: SidebarProps) {
  return (
    <aside className="hidden w-56 shrink-0 border-r bg-background md:flex md:flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <span className="font-semibold text-sm">CAS PRDIG</span>
      </div>
      <NavLinks role={role} />
    </aside>
  )
}

export function MobileSidebar({ role }: SidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menü öffnen</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-56 p-0">
        <div className="flex h-14 items-center border-b px-4">
          <span className="font-semibold text-sm">CAS PRDIG</span>
        </div>
        <NavLinks role={role} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
