import React from 'react'
import { getTranslations } from 'next-intl/server'

export default async function ActiveOffersPage(): Promise<React.ReactElement> {
  const t = await getTranslations('ActiveOffersPage')
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
        <p className="mt-1 text-foreground/80">{t('subtitle')}</p>
      </div>
      <div className="rounded-lg border border-border bg-card p-8 text-center text-card-foreground shadow-sm">
        <p className="text-muted-foreground">{t('noOffers')}</p>
      </div>
    </div>
  )
}
