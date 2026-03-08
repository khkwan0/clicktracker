import {prisma} from '@/lib/prisma'
import {ROLE, hasRole, hasAnyRole} from '@/lib/role-utils'

export {ROLE, hasRole, hasAnyRole}
export type {RoleFlag} from '@/lib/role-utils'

export async function GetRoleByUserId(userId: string): Promise<number | null> {
  const user = await prisma.user.findUnique({
    where: {id: userId},
    select: {role: true},
  })
  return user?.role ?? 0
}
