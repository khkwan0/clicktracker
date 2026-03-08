'use client'

import {useTheme} from '@/contexts/theme'
import {useTranslations} from 'next-intl'

export function ThemeToggle() {
  const {theme, toggleTheme} = useTheme()
  const t = useTranslations('App')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-foreground/10 bg-background text-foreground transition-colors hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-foreground/20"
      aria-label={theme === 'dark' ? t('themeSwitchToLight') : t('themeSwitchToDark')}
      title={theme === 'dark' ? t('themeSwitchToLight') : t('themeSwitchToDark')}>
      <span className="relative inline-flex h-5 w-5 items-center justify-center">
        <SunIcon className="absolute h-5 w-5 hidden dark:block" aria-hidden />
        <MoonIcon className="absolute h-5 w-5 block dark:hidden" aria-hidden />
      </span>
    </button>
  )
}

function SunIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>
  )
}

function MoonIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  )
}
