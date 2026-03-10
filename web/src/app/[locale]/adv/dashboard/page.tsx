import React from 'react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export default async function AdvertiserDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<React.ReactElement> {
  const session = await auth()
  const { locale } = await params
  const userId = session?.user?.id

  if (!userId) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-2 text-foreground/80">
          You must be signed in to view the dashboard.
        </p>
      </div>
    )
  }

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const [
    campaignsTotal,
    campaignsActive,
    offersTotal,
    offersActive,
    totalClicks,
    clicksLast24h,
    topCampaignsRaw,
    offerClickCountsRaw,
  ] = await Promise.all([
    prisma.campaign.count({ where: { userId } }),
    prisma.campaign.count({ where: { userId, isActive: true } }),
    prisma.offer.count({ where: { advertiser: { userId } } }),
    prisma.offer.count({ where: { advertiser: { userId }, isActive: true } }),
    prisma.click.count({ where: { campaign: { userId } } }),
    prisma.click.count({
      where: { campaign: { userId }, created_at: { gte: since24h } },
    }),
    prisma.campaign.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        _count: { select: { clicks: true } },
      },
      orderBy: { clicks: { _count: 'desc' } },
      take: 10,
    }),
    prisma.$queryRaw<Array<{ offer_id: string; count: number }>>`
      SELECT c."offerId" AS offer_id, COUNT(*)::int AS count
      FROM "Click" c
      INNER JOIN "Campaign" camp ON camp.id = c."campaignId"
      WHERE camp."userId" = ${userId}
      GROUP BY c."offerId"
    `,
  ])

  const offerClickCounts = offerClickCountsRaw.map((row) => ({
    offerId: row.offer_id,
    count: Number(row.count),
  }))
  const sortedOfferCounts = [...offerClickCounts].sort((a, b) => b.count - a.count)
  const topOfferIds = sortedOfferCounts.slice(0, 10).map((r) => r.offerId)
  type OfferWithCampaign = {
    id: string
    clickUrl: string
    campaign: { name: string }
  }
  const offersWithCampaign: OfferWithCampaign[] =
    topOfferIds.length > 0
      ? (await prisma.offer.findMany({
          where: { id: { in: topOfferIds } },
          select: {
            id: true,
            clickUrl: true,
            campaign: { select: { name: true } },
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Offer.id is string in schema; client types may be stale
        } as any)) as unknown as OfferWithCampaign[]
      : []
  const offerClickMap = new Map(offerClickCounts.map((r) => [r.offerId, r.count]))
  const topOffers = offersWithCampaign
    .map((o) => ({
      id: o.id,
      label: o.campaign.name,
      clickUrl: o.clickUrl,
      clicks: offerClickMap.get(o.id) ?? 0,
    }))
    .sort((a, b) => b.clicks - a.clicks)

  const t = await getTranslations('DashboardPage')

  const statCards = [
    { label: t('totalCampaigns'), value: campaignsTotal },
    { label: t('activeCampaigns'), value: campaignsActive },
    { label: t('totalOffers'), value: offersTotal },
    { label: t('activeOffers'), value: offersActive },
    { label: t('totalClicks'), value: totalClicks },
    { label: t('clicksLast24h'), value: clicksLast24h },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
        <p className="mt-1 text-foreground/80">{t('subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {card.label}
            </p>
            <p className="mt-1 text-2xl font-semibold">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            {t('topCampaignsByClicks')}
          </h2>
          {topCampaignsRaw.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">{t('noData')}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {topCampaignsRaw.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
                >
                  <Link
                    href={`/${locale}/adv/campaigns`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {c.name}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {c._count.clicks.toLocaleString()} {t('clicks')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            {t('topOffersByClicks')}
          </h2>
          {topOffers.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">{t('noData')}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {topOffers.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
                >
                  <Link
                    href={`/${locale}/adv/offers`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {o.label}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {o.clicks.toLocaleString()} {t('clicks')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
