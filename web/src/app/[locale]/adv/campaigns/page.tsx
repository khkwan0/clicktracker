import React from 'react'
import {getTranslations} from 'next-intl/server'
import {auth} from '@/auth'
import {prisma} from '@/lib/prisma'
import {CampaignsCrud} from './campaigns-crud'

export default async function AdvertiserCampaignsPage({
  params,
}: {
  params: Promise<{locale: string}>
}): Promise<React.ReactElement> {
  const session = await auth()
  const {locale} = await params
  const userId = session?.user?.id
  if (!userId) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Campaigns</h1>
        <p className="mt-2 text-foreground/80">You must be signed in to manage campaigns.</p>
      </div>
    )
  }

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const [campaignsRaw, advertisers, clicksLast24hRows] = await Promise.all([
    prisma.campaign.findMany({
      where: {userId, isActive: true},
      include: {
        advertiser: {select: {id: true, name: true}},
        _count: {select: {clicks: true}},
      },
      orderBy: {updated_at: 'desc'},
    }),
    prisma.advertiser.findMany({
      where: {userId, isActive: true},
      select: {id: true, name: true},
      orderBy: {name: 'asc'},
    }),
    prisma.click.groupBy({
      by: ['campaignId'],
      where: {
        created_at: {gte: since24h},
        campaign: {userId, isActive: true},
      },
      _count: {id: true},
    }),
  ])

  const clicksLast24hByCampaign = new Map(
    clicksLast24hRows.map((r: {campaignId: string; _count: {id: number}}) => [
      r.campaignId,
      r._count.id,
    ])
  )

  const campaigns = campaignsRaw.map(
    (c: (typeof campaignsRaw)[number]) => ({
    id: c.id,
    name: c.name,
    clickUrl: c.clickUrl,
    clickTag: c.clickTag,
    advertiserId: c.advertiserId,
    advertiser: c.advertiser,
    totalClicks: c._count.clicks,
    clicksLast24h: clicksLast24hByCampaign.get(c.id) ?? 0,
  })
  )

  const t = await getTranslations('CampaignsPage')

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
      <div className="mt-6">
        <CampaignsCrud
          campaigns={campaigns}
          advertisers={advertisers}
          locale={locale}
        />
      </div>
    </div>
  )
}
