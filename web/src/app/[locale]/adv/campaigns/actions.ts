'use server'

import {auth} from '@/auth'
import {prisma} from '@/lib/prisma'
import {revalidatePath} from 'next/cache'

export type CampaignInput = {
  name: string
  advertiserId: string
  clickUrl?: string | null
  clickTag?: string | null
}

async function getUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  return session.user.id
}

export async function createCampaign(
  data: CampaignInput,
  locale?: string
): Promise<{ok: boolean; error?: string}> {
  try {
    const userId = await getUserId()
    const advertiser = await prisma.advertiser.findFirst({
      where: {id: data.advertiserId, userId, isActive: true},
    })
    if (!advertiser) return {ok: false, error: 'Advertiser not found'}

    await prisma.campaign.create({
      data: {
        name: data.name.trim(),
        userId,
        advertiserId: data.advertiserId,
        clickUrl: data.clickUrl?.trim() || null,
        clickTag: data.clickTag?.trim() || null,
      },
    })
    if (locale) revalidatePath(`/${locale}/adv/campaigns`)
    return {ok: true}
  } catch (e) {
    console.error('createCampaign', e)
    return {ok: false, error: e instanceof Error ? e.message : 'Failed to create campaign'}
  }
}

export async function updateCampaign(
  id: string,
  data: CampaignInput,
  locale?: string
): Promise<{ok: boolean; error?: string}> {
  try {
    const userId = await getUserId()
    const existing = await prisma.campaign.findFirst({
      where: {id, userId},
    })
    if (!existing) return {ok: false, error: 'Campaign not found'}

    const advertiser = await prisma.advertiser.findFirst({
      where: {id: data.advertiserId, userId, isActive: true},
    })
    if (!advertiser) return {ok: false, error: 'Advertiser not found'}

    await prisma.campaign.update({
      where: {id},
      data: {
        name: data.name.trim(),
        advertiserId: data.advertiserId,
        clickUrl: data.clickUrl?.trim() || null,
        clickTag: data.clickTag?.trim() || null,
      },
    })
    if (locale) revalidatePath(`/${locale}/adv/campaigns`)
    return {ok: true}
  } catch (e) {
    console.error('updateCampaign', e)
    return {ok: false, error: e instanceof Error ? e.message : 'Failed to update campaign'}
  }
}

export async function deleteCampaign(
  id: string,
  locale?: string
): Promise<{ok: boolean; error?: string}> {
  try {
    const userId = await getUserId()
    const existing = await prisma.campaign.findFirst({
      where: {id, userId},
    })
    if (!existing) return {ok: false, error: 'Campaign not found'}

    await prisma.campaign.update({
      where: {id},
      data: {isActive: false},
    })
    if (locale) revalidatePath(`/${locale}/adv/campaigns`)
    return {ok: true}
  } catch (e) {
    console.error('deleteCampaign', e)
    return {ok: false, error: e instanceof Error ? e.message : 'Failed to delete campaign'}
  }
}
