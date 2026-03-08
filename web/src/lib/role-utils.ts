/**
 * Client-safe role helpers. No Prisma/Node deps.
 * Bitwise role flags: 0 = no role, 1 = AFFILIATE, 2 = ADVERTISER, 4 = ADMIN.
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
