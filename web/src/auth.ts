import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Line from 'next-auth/providers/line'
import TikTok from 'next-auth/providers/tiktok'
import {PrismaAdapter} from '@auth/prisma-adapter'
import {prisma} from '@/lib/prisma'

const THIRTY_MINUTES = 30 * 60
const FIVE_MINUTES = 5 * 60
const ONE_MINUTE = 60

export const {handlers, auth, signIn, signOut} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Line,
    TikTok({
      profile(profile) {
        return {
          id: profile.data.user.open_id,
          name: profile.data.user.display_name,
          image: profile.data.user.avatar_url,
          // TikTok does not provide email; use placeholder so User record can be created
          email: `tiktok-${profile.data.user.open_id}@placeholder.local`,
        }
      },
    }),
  ],
  session: {
    maxAge: THIRTY_MINUTES,
    updateAge: ONE_MINUTE,
  },
  callbacks: {
    signIn: async ({user}): Promise<boolean> => {
      if (!user.email) {
        return false
      }
      const email = user.email.toLowerCase()
      const dbUser = await prisma.user.findUnique({
        where: {email: email},
      })
      if (!dbUser) {
        return true
      }
      if (!dbUser.isActive) {
        return false
      }
      return true
    },
    redirect({url, baseUrl}) {
      if (url.startsWith(baseUrl)) return url
      return baseUrl + '/'
    },
    session: async ({session, user}) => {
      session.user.id = user.id
      if (session.user.email) {
        const dbUser = await prisma.user.findUnique({
          where: {email: session.user.email},
        })
        session.user.isActive = dbUser?.isActive ?? false
        session.user.isAdmin = dbUser?.isAdmin ?? false
        session.user.role = dbUser?.role ?? null
      }
      return session
    },
  },
})
