'use server'

import {auth} from '@/auth'
import {prisma} from '@/lib/prisma'
import {revalidatePath} from 'next/cache'

export type AdvertiserInput = {
  name: string
}

async function getUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  return session.user.id
}

export async function createAdvertiser(
  data: AdvertiserInput,
  locale?: string
): Promise<{ok: boolean; error?: string}> {
  try {
    const userId = await getUserId()
    await prisma.advertiser.create({
      data: {
        userId,
        name: data.name.trim(),
      },
    })
    if (locale) revalidatePath(`/${locale}/adv/advertisers`)
    if (locale) revalidatePath(`/${locale}/adv/campaigns`)
    return {ok: true}
  } catch (e) {
    console.error('createAdvertiser', e)
    return {ok: false, error: e instanceof Error ? e.message : 'Failed to create advertiser'}
  }
}

export async function updateAdvertiser(
  id: string,
  data: AdvertiserInput,
  locale?: string
): Promise<{ok: boolean; error?: string}> {
  try {
    const userId = await getUserId()
    const existing = await prisma.advertiser.findFirst({
      where: {id, userId},
    })
    if (!existing) return {ok: false, error: 'Advertiser not found'}

    await prisma.advertiser.update({
      where: {id},
      data: {name: data.name.trim()},
    })
    if (locale) revalidatePath(`/${locale}/adv/advertisers`)
    if (locale) revalidatePath(`/${locale}/adv/campaigns`)
    return {ok: true}
  } catch (e) {
    console.error('updateAdvertiser', e)
    return {ok: false, error: e instanceof Error ? e.message : 'Failed to update advertiser'}
  }
}

export async function deleteAdvertiser(
  id: string,
  locale?: string
): Promise<{ok: boolean; error?: string}> {
  try {
    const userId = await getUserId()
    const existing = await prisma.advertiser.findFirst({
      where: {id, userId},
    })
    if (!existing) return {ok: false, error: 'Advertiser not found'}

    await prisma.advertiser.update({
      where: {id},
      data: {isActive: false},
    })
    if (locale) revalidatePath(`/${locale}/adv/advertisers`)
    if (locale) revalidatePath(`/${locale}/adv/campaigns`)
    return {ok: true}
  } catch (e) {
    console.error('deleteAdvertiser', e)
    return {ok: false, error: e instanceof Error ? e.message : 'Failed to delete advertiser'}
  }
}
