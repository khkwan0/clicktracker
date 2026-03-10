'use client'

import {useTranslations} from 'next-intl'
import {Link, usePathname} from '@/i18n/navigation'
import {hasAnyRole, hasRole, ROLE} from '@/lib/role-utils'
import type {Session} from 'next-auth'

type NavProps = {
  session: Session | null
}

function dashboardHref(role: number | null | undefined): string {
  if (hasRole(role, ROLE.ADMIN)) return '/admin/dashboard'
  if (hasRole(role, ROLE.ADVERTISER)) return '/adv/dashboard'
  if (hasRole(role, ROLE.AFFILIATE)) return '/aff/dashboard'
  return '/'
}

export function Nav({session}: NavProps) {
  const t = useTranslations('App')
  const pathname = usePathname()
  const role = session?.user?.role

  if (!session?.user?.id || !hasAnyRole(role)) return null

  const dashboardPath = dashboardHref(role)
  const showCampaigns = hasRole(role, ROLE.ADVERTISER)
  const showAffiliateOffers = hasRole(role, ROLE.AFFILIATE)

  const linkClass = (path: string) =>
    `rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors ${
      pathname === path || pathname.startsWith(path + '/')
        ? 'bg-foreground/10 text-foreground'
        : 'text-foreground/80 hover:bg-foreground/5 hover:text-foreground'
    }`

  return (
    <div className="border-t border-foreground/10 bg-background/50">
      <nav
        className="mx-auto flex w-full max-w-[var(--header-max-width,80rem)] flex-wrap items-center gap-1 px-4 py-2 sm:px-6"
        aria-label={t('navLabel')}>
        <Link href={dashboardPath} className={linkClass(dashboardPath)}>
          {t('navDashboard')}
        </Link>
        {showCampaigns && (
          <>
            <Link href="/adv/advertisers" className={linkClass('/adv/advertisers')}>
              {t('navAdvertisers')}
            </Link>
            <Link href="/adv/campaigns" className={linkClass('/adv/campaigns')}>
              {t('navCampaigns')}
            </Link>
            <Link href="/adv/offers" className={linkClass('/adv/offers')}>
              {t('navOffers')}
            </Link>
          </>
        )}
        {showAffiliateOffers && (
          <>
            <Link href="/aff/active-offers" className={linkClass('/aff/active-offers')}>
              {t('navActiveOffers')}
            </Link>
            <Link href="/aff/available-offers" className={linkClass('/aff/available-offers')}>
              {t('navAvailableOffers')}
            </Link>
            <Link href="/aff/pending-offers" className={linkClass('/aff/pending-offers')}>
              {t('navPendingOffers')}
            </Link>
          </>
        )}
      </nav>
    </div>
  )
}
