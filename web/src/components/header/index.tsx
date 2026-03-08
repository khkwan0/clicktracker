'use client'

import {useTranslations} from 'next-intl'
import {Link} from '@/i18n/navigation'
import {LanguageSwitcher} from '@/components/language-switcher'
import {ThemeToggle} from '@/components/theme-toggle'

export function Header() {
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
          </div>
        </div>
      </div>
    </header>
  )
}
