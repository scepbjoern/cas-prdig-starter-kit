import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) redirect('/login')

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
        <form
          action={async () => {
            'use server'
            const { signOut } = await import('@/lib/auth-client')
            await signOut()
            redirect('/login')
          }}
        >
          <button className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
            Abmelden
          </button>
        </form>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Willkommen, {session.user.name}
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {session.user.email} &middot; Rolle: {session.user.role}
          </p>

          <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-50">Übersicht</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Du bist erfolgreich angemeldet. Das Dashboard wird hier erweitert.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
