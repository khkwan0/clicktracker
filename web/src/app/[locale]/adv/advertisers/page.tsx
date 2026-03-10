import React from 'react'
import {getTranslations} from 'next-intl/server'
import {auth} from '@/auth'
import {prisma} from '@/lib/prisma'
import {AdvertisersCrud} from './advertisers-crud'

export default async function AdvertisersPage({
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
        <h1 className="text-2xl font-semibold text-foreground">Advertisers</h1>
        <p className="mt-2 text-foreground/80">You must be signed in to manage advertisers.</p>
      </div>
    )
  }

  const advertisersRaw = await prisma.advertiser.findMany({
    where: {userId, isActive: true},
    include: {_count: {select: {campaigns: true}}},
    orderBy: {name: 'asc'},
  })

  type AdvertiserRow = (typeof advertisersRaw)[number]
  const advertisers = advertisersRaw.map((a: AdvertiserRow) => ({
    id: a.id,
    name: a.name,
    campaignCount: a._count.campaigns,
  }))

  const t = await getTranslations('AdvertisersPage')

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
      <div className="mt-6">
        <AdvertisersCrud advertisers={advertisers} locale={locale} />
      </div>
    </div>
  )
}
