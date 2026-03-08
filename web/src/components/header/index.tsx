'use client'

import {useTranslations} from 'next-intl'
import {Link} from '@/i18n/navigation'
import {LanguageSwitcher} from '@/components/language-switcher'
import {Nav} from '@/components/nav'
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
          <nav className="flex items-center gap-4">
            <div className="relative group">
              <span
                className="flex cursor-default items-center gap-1 text-sm text-foreground/80 hover:text-foreground"
                aria-haspopup="true"
                aria-expanded="false">
                {t('navMore')}
                <svg
                  className="size-3.5 shrink-0 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <div className="absolute right-0 top-full z-50 -mt-1 pt-1 min-w-[10rem] rounded-md border border-foreground/10 bg-background py-1 opacity-0 shadow-lg transition-opacity duration-150 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto">
                <Link
                  href="/terms"
                  className="block px-3 py-2 text-sm text-foreground/80 underline-offset-4 hover:bg-foreground/5 hover:text-foreground">
                  {t('navTerms')}
                </Link>
                <Link
                  href="/privacy"
                  className="block px-3 py-2 text-sm text-foreground/80 underline-offset-4 hover:bg-foreground/5 hover:text-foreground">
                  {t('navPrivacy')}
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-sm text-foreground/80 underline-offset-4 hover:bg-foreground/5 hover:text-foreground">
                  {t('navAbout')}
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-2 text-sm text-foreground/80 underline-offset-4 hover:bg-foreground/5 hover:text-foreground">
                  {t('navContact')}
                </Link>
              </div>
            </div>
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
          </nav>
        </div>
      </div>
      {session?.user?.id != null && <Nav session={session} />}
    </header>
  )
}
