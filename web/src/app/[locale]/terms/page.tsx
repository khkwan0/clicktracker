import {getTranslations} from 'next-intl/server'
import type {Metadata} from 'next'
import {Link} from '@/i18n/navigation'

type Props = {
  params: Promise<{locale: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const t = await getTranslations('TermsPage')
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function TermsPage({params}: Props) {
  const t = await getTranslations('TermsPage')
  const tApp = await getTranslations('App')

  return (
    <main className="mx-auto w-full max-w-[var(--header-max-width,80rem)] px-4 py-12 sm:px-6">
      <article className="mx-auto max-w-3xl">
        <p className="mb-6">
          <Link
            href="/"
            className="text-sm font-medium text-foreground/80 hover:text-foreground underline underline-offset-2"
          >
            {tApp('backToHome')}
          </Link>
        </p>
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-2 text-lg text-foreground/80">{t('subtitle')}</p>
          <p className="mt-1 text-sm text-foreground/60">
            {t('lastUpdated')}: March 8, 2025
          </p>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {t('section1Title')}
            </h2>
            <p>{t('section1Body')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {t('section2Title')}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('defAdvertiser')}</li>
              <li>{t('defAffiliate')}</li>
              <li>{t('defOffer')}</li>
              <li>{t('defConversion')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {t('section3Title')}
            </h2>
            <p>{t('section3Intro')}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('section3Item1')}</li>
              <li>{t('section3Item2')}</li>
              <li>{t('section3Item3')}</li>
              <li>{t('section3Item4')}</li>
              <li>{t('section3Item5')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {t('section4Title')}
            </h2>
            <p>{t('section4Body')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {t('section5Title')}
            </h2>
            <p>{t('section5Body')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {t('section6Title')}
            </h2>
            <p>{t('section6Intro')}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('section6Item1')}</li>
              <li>{t('section6Item2')}</li>
              <li>{t('section6Item3')}</li>
              <li>{t('section6Item4')}</li>
            </ul>
            <p>{t('section6Outro')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {t('section7Title')}
            </h2>
            <p>{t('section7Body')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {t('section8Title')}
            </h2>
            <p>{t('section8Body')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {t('section9Title')}
            </h2>
            <p>{t('section9Body')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {t('section10Title')}
            </h2>
            <p>{t('section10Body')}</p>
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
