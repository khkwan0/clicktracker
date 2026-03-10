import React from 'react'
import {getTranslations} from 'next-intl/server'
import {auth} from '@/auth'
import {prisma} from '@/lib/prisma'
import {OffersCrud} from './offers-crud'

export default async function OffersPage({
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
        <h1 className="text-2xl font-semibold text-foreground">Offers</h1>
        <p className="mt-2 text-foreground/80">You must be signed in to manage offers.</p>
      </div>
    )
  }

  const [offersRaw, campaignsRaw, advertisersRaw] = await Promise.all([
    prisma.offer.findMany({
      where: {advertiser: {userId}},
      include: {
        campaign: {select: {id: true, name: true, advertiser: {select: {id: true, name: true}}}},
        advertiser: {select: {id: true, name: true}},
      },
      orderBy: {updated_at: 'desc'},
    }),
    prisma.campaign.findMany({
      where: {userId, isActive: true},
      include: {advertiser: {select: {id: true, name: true}}},
      orderBy: {name: 'asc'},
    }),
    prisma.advertiser.findMany({
      where: {userId, isActive: true},
      select: {id: true, name: true},
      orderBy: {name: 'asc'},
    }),
  ])

  type OfferRow = (typeof offersRaw)[number]
  const offers = offersRaw.map((o: OfferRow) => ({
    id: o.id,
    campaignId: o.campaignId,
    advertiserId: o.advertiserId,
    clickUrl: o.clickUrl,
    isActive: o.isActive,
    requiresApproval: o.requiresApproval,
    campaign: o.campaign,
    advertiser: o.advertiser,
  }))

  type CampaignRow = (typeof campaignsRaw)[number]
  const campaigns = campaignsRaw.map((c: CampaignRow) => ({
    id: c.id,
    name: c.name,
    advertiserId: c.advertiserId,
    advertiser: c.advertiser,
  }))

  type AdvertiserRow = (typeof advertisersRaw)[number]
  const advertisers = advertisersRaw.map((a: AdvertiserRow) => ({id: a.id, name: a.name}))

  const t = await getTranslations('OffersPage')

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
      <div className="mt-6">
        <OffersCrud
          offers={offers}
          campaigns={campaigns}
          advertisers={advertisers}
          locale={locale}
        />
      </div>
    </div>
  )
}
