'use client'

import {usePathname as useNextPathname} from 'next/navigation'
import {Link, usePathname} from '@/i18n/navigation'
import {routing} from '@/i18n/routing'
import {defaultLocale, type Locale} from '@/i18n/config'
import {setUserLocale} from '@/services/locale'
import {useRef, useState, useCallback, useEffect} from 'react'

const localesList = routing.locales as readonly string[]

/** ISO 3166-1 alpha-2 country code per locale (for flag-icons). */
const localeCountryCode: Record<string, string> = {
  en: 'us',
  de: 'de',
  es: 'es',
  fr: 'fr',
  id: 'id',
  it: 'it',
  ja: 'jp',
  nl: 'nl',
  ru: 'ru',
  th: 'th',
  'zh-CN': 'cn',
  'zh-TW': 'tw',
}

function FlagIcon({locale}: {locale: string}) {
  const code = localeCountryCode[locale] ?? 'un'
  return (
    <span
      className={`fi fi-${code}`}
      style={{width: '1.25em', height: '0.9375em'}}
      aria-hidden
    />
  )
}

/** Pathname without locale segment so Link doesn't double-prefix. */
function pathnameWithoutLocale(pathname: string): string {
  const segment = pathname.slice(1).split('/')[0]
  if (segment && localesList.includes(segment)) {
    const rest = pathname.slice(segment.length + 1)
    return rest.startsWith('/') ? rest : rest ? `/${rest}` : '/'
  }
  return pathname || '/'
}

/** Current locale from the real URL (with locale prefix) so the switcher updates on navigation. */
function localeFromPathname(fullPathname: string | null): string {
  if (!fullPathname) return defaultLocale
  const segment = fullPathname.slice(1).split('/')[0]
  return segment && localesList.includes(segment) ? segment : defaultLocale
}

export function LanguageSwitcher() {
  const nextPathname = useNextPathname()
  const pathname = usePathname()
  const locale = localeFromPathname(nextPathname ?? null)
  const path = pathnameWithoutLocale(pathname || '/')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    document.addEventListener('click', handle)
    return () => document.removeEventListener('click', handle)
  }, [open, close])

  return (
    <div ref={ref} className="relative" aria-label="Language">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 rounded px-2 py-1.5 text-sm font-medium text-foreground/90 hover:bg-foreground/5 hover:text-foreground"
        aria-expanded={open}
        aria-haspopup="listbox">
        <FlagIcon locale={locale} />
        <span aria-hidden>{locale.toUpperCase()}</span>
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-10 mt-1 min-w-[4rem] rounded border border-foreground/10 bg-background py-1 shadow-lg"
          aria-label="Language options">
          {localesList.map(loc => (
            <li key={loc} role="option" aria-selected={locale === loc}>
              <Link
                href={path}
                locale={loc}
                onClick={() => {
                  setUserLocale(loc as Locale)
                  close()
                }}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm no-underline ${
                  locale === loc
                    ? 'bg-foreground/10 font-medium text-foreground'
                    : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
                }`}>
                <FlagIcon locale={loc} />
                <span>{loc.toUpperCase()}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
