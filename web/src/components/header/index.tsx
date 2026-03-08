'use client'

import {useTranslations} from 'next-intl'
import {Link} from '@/i18n/navigation'
import {LanguageSwitcher} from '@/components/language-switcher'
import {ThemeToggle} from '@/components/theme-toggle'
import type {Session} from 'next-auth'

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return '***@***'
  if (local.length <= 2) return `${local[0]}***@${domain}`
  return `${local[0]}***${local.slice(-1)}@${domain}`
}

type HeaderProps = {
  session: Session | null
}

export function Header({session}: HeaderProps) {
  const t = useTranslations('App')

  return (
    <header className="w-full border-b border-foreground/10 bg-background">
      <div className="mx-auto w-full max-w-[var(--header-max-width,80rem)] px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="min-w-0 truncate text-lg font-semibold text-foreground no-underline hover:opacity-80 sm:text-xl">
            {t('name')}
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            {session?.user?.email && (
              <div className="flex items-center gap-2 border-l border-foreground/20 pl-2">
                <span className="text-muted-foreground text-sm tabular-nums">
                  {maskEmail(session.user.email)}
                </span>
                <a
                  href="/api/auth/signout"
                  className="rounded-md px-2 py-1.5 text-sm text-foreground/80 underline-offset-4 hover:bg-foreground/10 hover:text-foreground hover:underline">
                  {t('logout')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
