'use server'

import {auth} from '@/auth'
import {prisma} from '@/lib/prisma'
import {revalidatePath} from 'next/cache'

export type OfferInput = {
  campaignId: string
  advertiserId: string
  clickUrl: string
  requiresApproval?: boolean
}

async function getUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  return session.user.id
}

export async function createOffer(
  data: OfferInput,
  locale?: string
): Promise<{ok: boolean; error?: string}> {
  try {
    const userId = await getUserId()
    const campaign = await prisma.campaign.findFirst({
      where: {id: data.campaignId, userId, isActive: true},
      include: {advertiser: true},
    })
    if (!campaign?.advertiser?.isActive) return {ok: false, error: 'Campaign not found'}
    if (campaign.advertiserId !== data.advertiserId) return {ok: false, error: 'Advertiser does not match campaign'}

    await prisma.offer.create({
      data: {
        campaignId: data.campaignId,
        advertiserId: data.advertiserId,
        clickUrl: data.clickUrl.trim(),
        requiresApproval: data.requiresApproval ?? false,
      },
    })
    if (locale) revalidatePath(`/${locale}/adv/offers`)
    return {ok: true}
  } catch (e) {
    console.error('createOffer', e)
    return {ok: false, error: e instanceof Error ? e.message : 'Failed to create offer'}
  }
}

export async function updateOffer(
  id: string,
  data: OfferInput,
  locale?: string
): Promise<{ok: boolean; error?: string}> {
  try {
    const userId = await getUserId()
    const existing = await prisma.offer.findFirst({
      where: {id, advertiser: {userId}},
    })
    if (!existing) return {ok: false, error: 'Offer not found'}

    const campaign = await prisma.campaign.findFirst({
      where: {id: data.campaignId, userId, isActive: true},
    })
    if (!campaign) return {ok: false, error: 'Campaign not found'}
    if (campaign.advertiserId !== data.advertiserId) return {ok: false, error: 'Advertiser does not match campaign'}

    await prisma.offer.update({
      where: {id},
      data: {
        campaignId: data.campaignId,
        advertiserId: data.advertiserId,
        clickUrl: data.clickUrl.trim(),
        requiresApproval: data.requiresApproval ?? false,
      },
    })
    if (locale) revalidatePath(`/${locale}/adv/offers`)
    return {ok: true}
  } catch (e) {
    console.error('updateOffer', e)
    return {ok: false, error: e instanceof Error ? e.message : 'Failed to update offer'}
  }
}

/** Deactivate offer (set isActive false); does not delete from database. */
export async function deactivateOffer(
  id: string,
  locale?: string
): Promise<{ok: boolean; error?: string}> {
  try {
    const userId = await getUserId()
    const existing = await prisma.offer.findFirst({
      where: {id, advertiser: {userId}},
    })
    if (!existing) return {ok: false, error: 'Offer not found'}

    await prisma.offer.update({
      where: {id},
      data: {isActive: false},
    })
    if (locale) revalidatePath(`/${locale}/adv/offers`)
    return {ok: true}
  } catch (e) {
    console.error('deactivateOffer', e)
    return {ok: false, error: e instanceof Error ? e.message : 'Failed to deactivate offer'}
  }
}
