import {auth} from '@/auth'
import {prisma} from '@/lib/prisma'
import {ROLE} from '@/lib/roles'
import {getTranslations} from 'next-intl/server'
import {redirect} from 'next/navigation'

type Props = {
  params: Promise<{locale: string}>
}

const VALID_ROLES: number[] = [ROLE.ADVERTISER, ROLE.AFFILIATE]

async function setOnboardingRole(formData: FormData) {
  'use server'
  const roleValue = Number(formData.get('role'))
  const locale = String(formData.get('locale') ?? 'en')
  const session = await auth()
  if (!session?.user?.id) redirect(`/${locale}/auth`)
  if (!VALID_ROLES.includes(roleValue)) return
  await prisma.user.update({
    where: {id: session.user.id},
    data: {role: roleValue},
  })
  redirect(`/${locale}/dashboard`)
}

export default async function OnboardingPage({params}: Props) {
  const session = await auth()
  const {locale} = await params
  const t = await getTranslations('OnboardingPage')

  if (!session?.user?.id) {
    redirect(`/${locale}/auth`)
  }

  return (
    <main className="mx-auto w-full max-w-[var(--header-max-width,80rem)] px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
      <p className="mt-2 text-foreground/80">{t('question')}</p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
        <form action={setOnboardingRole} className="flex-1">
          <input type="hidden" name="role" value={ROLE.ADVERTISER} />
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="flex w-full flex-col items-start rounded-xl border border-foreground/15 bg-background p-6 text-left shadow-sm transition hover:border-foreground/25 hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <span className="font-medium text-foreground">{t('advertiser')}</span>
            <span className="mt-1 text-sm text-foreground/70">
              {t('advertiserDescription')}
            </span>
          </button>
        </form>
        <form action={setOnboardingRole} className="flex-1">
          <input type="hidden" name="role" value={ROLE.AFFILIATE} />
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="flex w-full flex-col items-start rounded-xl border border-foreground/15 bg-background p-6 text-left shadow-sm transition hover:border-foreground/25 hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <span className="font-medium text-foreground">{t('affiliate')}</span>
            <span className="mt-1 text-sm text-foreground/70">
              {t('affiliateDescription')}
            </span>
          </button>
        </form>
      </div>
    </main>
  )
}
