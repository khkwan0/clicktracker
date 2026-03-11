import {getTranslations} from 'next-intl/server'
import {auth} from '@/auth'
import {redirect} from 'next/navigation'
import {hasAnyRole} from '@/lib/roles'
import Link from 'next/link'
import Image from 'next/image'
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
    <main className="min-h-[calc(100vh-4rem)] w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-foreground/5 via-background to-background px-4 pb-24 pt-16 sm:px-6 sm:pt-24 md:pb-32 md:pt-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              {t('welcomeTitle')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80 sm:text-xl md:text-2xl lg:mx-0">
              {t('welcomeSubtitle')}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Link href={`/${locale}/auth`}>
                <button
                  type="button"
                  className="inline-flex min-w-[12rem] items-center justify-center rounded-xl bg-foreground px-8 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background">
                  {t('signIn')}
                </button>
              </Link>
            </div>
          </div>
          <div className="relative order-1 aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl border border-foreground/10 shadow-xl lg:order-2 lg:max-w-none">
            <Image
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"
              alt="Team collaboration"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Value / Who it's for */}
      <section className="border-t border-foreground/10 bg-background px-4 py-20 sm:px-6 sm:py-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
            {t('whoItsForLabel')}
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            {t('whoItsForTitle')}
          </h2>
          <div className="mt-16 grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8 shadow-sm transition hover:border-foreground/20 hover:shadow-md dark:bg-foreground/5">
              <h3 className="text-lg font-semibold text-foreground">
                {t('joinAsAdvertiser')}
              </h3>
              <p className="mt-3 text-foreground/80">
                {t('joinAsAdvertiserDescription')}
              </p>
              <Link
                href={`/${locale}/auth`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline">
                {t('getStarted')}
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8 shadow-sm transition hover:border-foreground/20 hover:shadow-md dark:bg-foreground/5">
              <h3 className="text-lg font-semibold text-foreground">
                {t('joinAsAffiliate')}
              </h3>
              <p className="mt-3 text-foreground/80">
                {t('joinAsAffiliateDescription')}
              </p>
              <Link
                href={`/${locale}/auth`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline">
                {t('getStarted')}
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-foreground/10 bg-foreground/5 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t('readyTitle')}
          </h2>
          <p className="mt-3 text-foreground/80">
            {t('readySubtitle')}
          </p>
          <Link href={`/${locale}/auth`} className="mt-8 inline-block">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-8 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background">
              {t('signInWithGoogle')}
            </button>
          </Link>
        </div>
      </section>
    </main>
  )
}
