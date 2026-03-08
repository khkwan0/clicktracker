import {getTranslations} from 'next-intl/server'
import type {Metadata} from 'next'
import {Link} from '@/i18n/navigation'

type Props = {
  params: Promise<{locale: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const t = await getTranslations('AboutPage')
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function AboutPage({params}: Props) {
  const t = await getTranslations('AboutPage')
  const tApp = await getTranslations('App')
  await params

  return (
    <main className="mx-auto w-full max-w-[var(--header-max-width,80rem)] px-4 py-12 sm:px-6">
      <article className="mx-auto max-w-3xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-2 text-lg text-foreground/80">{t('subtitle')}</p>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {t('missionTitle')}
            </h2>
            <p>{t('missionBody')}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {t('whatWeDoTitle')}
            </h2>
            <p>{t('whatWeDoBody')}</p>
          </section>
        </div>

        <footer className="mt-12 pt-8 border-t border-foreground/10">
          <Link
            href="/"
            className="text-sm font-medium text-foreground/80 hover:text-foreground underline underline-offset-2"
          >
            {tApp('backToHome')}
          </Link>
        </footer>
      </article>
    </main>
  )
}
