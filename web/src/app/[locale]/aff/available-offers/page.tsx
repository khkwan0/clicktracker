import React from 'react'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/prisma'

export default async function AvailableOffersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<React.ReactElement> {
  const { locale } = await params

  const offersRaw = await prisma.offer.findMany({
    where: {
      isActive: true,
      advertiser: { isActive: true },
    },
    include: {
      campaign: { select: { id: true, name: true } },
      advertiser: { select: { id: true, name: true } },
    },
    orderBy: { updated_at: 'desc' },
  })

  type OfferRow = (typeof offersRaw)[number]
  const offers = offersRaw.map((o: OfferRow) => ({
    id: o.id,
    clickUrl: o.clickUrl,
    requiresApproval: o.requiresApproval,
    campaign: o.campaign,
    advertiser: o.advertiser,
  }))

  const t = await getTranslations('AvailableOffersPage')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
        <p className="mt-1 text-foreground/80">{t('subtitle')}</p>
      </div>

      {offers.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-card-foreground shadow-sm">
          <p className="text-muted-foreground">{t('noOffers')}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 font-medium text-foreground">
                    {t('advertiser')}
                  </th>
                  <th className="px-4 py-3 font-medium text-foreground">
                    {t('campaign')}
                  </th>
                  <th className="px-4 py-3 font-medium text-foreground">
                    {t('clickUrl')}
                  </th>
                  <th className="px-4 py-3 font-medium text-foreground">
                    {t('requiresApproval')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr
                    key={offer.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {offer.advertiser.name}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {offer.campaign.name}
                    </td>
                    <td className="max-w-[240px] truncate px-4 py-3 font-mono text-xs text-muted-foreground">
                      <a
                        href={offer.clickUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                        title={offer.clickUrl}
                      >
                        {offer.clickUrl}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {offer.requiresApproval ? t('yes') : t('no')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
