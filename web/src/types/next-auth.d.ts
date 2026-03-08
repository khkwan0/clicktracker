import 'next-auth'
import {UserPreferences} from '@/context/global-state'

/** String role for onboarding flow (e.g. query params). Session role is bitwise number. */
export type UserRole = 'ADVERTISER' | 'AFFILIATE'

declare module 'next-auth' {
  interface User {
    id?: string
    isActive?: boolean
    isAdmin?: boolean
    /** Bitwise: 4=ADMIN, 2=ADVERTISER, 1=AFFILIATE, 0=no role */
    role?: number | null
    preferences?: UserPreferences
  }

  interface Session {
    user: User
  }
}
