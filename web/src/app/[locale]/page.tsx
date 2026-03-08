import {getTranslations} from 'next-intl/server'
import {auth} from '@/auth'
import {redirect} from 'next/navigation'
import {hasAnyRole} from '@/lib/roles'
import Link from 'next/link'
import {ROLE} from '@/lib/roles'

type Props = {
  params: Promise<{locale: string}>
}

export default async function HomePage({params}: Props) {
  const t = await getTranslations('HomePage')
  const session = await auth()
  const {locale} = await params

  if (session?.user && !hasAnyRole(session.user.role)) {
    redirect(`/${locale}/onboarding`)
  }

  if (session?.user && hasAnyRole(session.user.role) && session.user?.id) {
    const role = session.user.role
    if (role === ROLE.ADVERTISER) {
      redirect(`/${locale}/adv/dashboard`)
    }
    if (role === ROLE.AFFILIATE) {
      redirect(`/${locale}/aff/dashboard`)
    }
    if (role === ROLE.ADMIN) {
      redirect(`/${locale}/admin/dashboard`)
    }
  }

  return (
    <main className="mx-auto w-full max-w-[var(--header-max-width,80rem)] px-4 py-12 sm:px-6">
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {t('welcomeTitle')}
        </h1>
        <p className="mt-4 text-lg text-foreground/80 sm:text-xl">
          {t('welcomeSubtitle')}
        </p>
      </section>

      <section
        className="mx-auto mt-16 flex justify-center"
        aria-label={t('title')}>
        <Link href={`/${locale}/auth`}>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-8 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background">
            {t('signIn')}
          </button>
        </Link>
      </section>
    </main>
  )
}
