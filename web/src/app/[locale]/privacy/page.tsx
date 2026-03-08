import {getTranslations} from 'next-intl/server'
import type {Metadata} from 'next'
import {Link} from '@/i18n/navigation'

type Props = {
  params: Promise<{locale: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const t = await getTranslations('PrivacyPage')
  return {
    title: t('title'),
    description: t('lastUpdated'),
  }
}

export default async function PrivacyPage({params}: Props) {
  const t = await getTranslations('PrivacyPage')
  await params
  return (
    <main className="mx-auto w-full max-w-[var(--header-max-width,80rem)] px-4 py-12 sm:px-6">
      <article className="mx-auto max-w-3xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            {t('lastUpdated')}: March 2025
          </p>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground mt-0 mb-3">
              {t('section1Title')}
            </h2>
            <p>{t('section1Body')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-0 mb-3">
              {t('section2Title')}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('section2Item1')}</li>
              <li>{t('section2Item2')}</li>
              <li>{t('section2Item3')}</li>
              <li>{t('section2Item4')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-0 mb-3">
              {t('section3Title')}
            </h2>
            <p className="mb-3">{t('section3Intro')}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('section3Item1')}</li>
              <li>{t('section3Item2')}</li>
              <li>{t('section3Item3')}</li>
              <li>{t('section3Item4')}</li>
              <li>{t('section3Item5')}</li>
              <li>{t('section3Item6')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-0 mb-3">
              {t('section4Title')}
            </h2>
            <p className="mb-3">{t('section4Intro')}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('section4Item1')}</li>
              <li>{t('section4Item2')}</li>
              <li>{t('section4Item3')}</li>
            </ul>
            <p className="mt-3">{t('section4Outro')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-0 mb-3">
              {t('section5Title')}
            </h2>
            <p>{t('section5Body')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-0 mb-3">
              {t('section6Title')}
            </h2>
            <p className="mb-3">{t('section6Intro')}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('section6Item1')}</li>
              <li>{t('section6Item2')}</li>
              <li>{t('section6Item3')}</li>
              <li>{t('section6Item4')}</li>
              <li>{t('section6Item5')}</li>
            </ul>
            <p className="mt-3">{t('section6Outro')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-0 mb-3">
              {t('section7Title')}
            </h2>
            <p className="mb-3">{t('section7Intro')}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('section7Item1')}</li>
              <li>{t('section7Item2')}</li>
              <li>{t('section7Item3')}</li>
              <li>{t('section7Item4')}</li>
            </ul>
            <p className="mt-3">{t('section7Outro')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-0 mb-3">
              {t('section8Title')}
            </h2>
            <p>{t('section8Body')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-0 mb-3">
              {t('section9Title')}
            </h2>
            <p className="mb-3">{t('section9Intro')}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('section9Item1')}</li>
              <li>{t('section9Item2')}</li>
              <li>{t('section9Item3')}</li>
              <li>{t('section9Item4')}</li>
              <li>{t('section9Item5')}</li>
              <li>{t('section9Item6')}</li>
              <li>{t('section9Item7')}</li>
            </ul>
            <p className="mt-3">{t('section9Outro')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-0 mb-3">
              {t('section10Title')}
            </h2>
            <p>{t('section10Body')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-0 mb-3">
              {t('section11Title')}
            </h2>
            <p>{t('section11Body')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-0 mb-3">
              {t('section12Title')}
            </h2>
            <p>{t('section12Body')}</p>
          </section>
        </div>

        <footer className="mt-12 pt-8 border-t border-foreground/10">
          <Link
            href="/"
            className="text-sm font-medium text-foreground/80 hover:text-foreground underline underline-offset-2"
          >
            {t('backToHome')}
          </Link>
        </footer>
      </article>
    </main>
  )
}
