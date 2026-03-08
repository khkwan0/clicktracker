import {auth} from '@/auth'
import {notFound} from 'next/navigation'
import {hasRole, ROLE, GetRoleByUserId} from '@/lib/roles'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (
    !session?.user ||
    !hasRole(session.user.role, ROLE.AFFILIATE) ||
    !session.user.id
  ) {
    return notFound()
  }

  // check this from source of truth rather that from session
  // extra layer of security
  const role = await GetRoleByUserId(session.user.id)
  if (!role || role !== ROLE.AFFILIATE) {
    return notFound()
  }

  return (
    <main className="mx-auto w-full max-w-[var(--header-max-width,80rem)] px-4 py-12 sm:px-6">
      {children}
    </main>
  )
}
