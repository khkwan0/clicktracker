import {prisma} from '@/lib/prisma'

/**
 * Bitwise role flags for session.user.role.
 * 0 = no role yet.
 */
export const ROLE = {
  AFFILIATE: 1,
  ADVERTISER: 2,
  ADMIN: 4,
} as const

export type RoleFlag = (typeof ROLE)[keyof typeof ROLE]

export function hasRole(
  userRole: number | null | undefined,
  flag: RoleFlag,
): boolean {
  return ((userRole ?? 0) & flag) === flag
}

export function hasAnyRole(userRole: number | null | undefined): boolean {
  return (userRole ?? 0) > 0
}

export async function GetRoleByUserId(userId: string): Promise<number | null> {
  const user = await prisma.user.findUnique({
    where: {id: userId},
    select: {role: true},
  })
  return user?.role ?? 0
}
