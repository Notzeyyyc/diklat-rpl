import type { H3Event } from 'h3'
import type { SessionUser } from '@diklat/shared'
import { useSession } from 'h3'

// ponytail: secure=false via NUXT_SESSION_SECURE=false utk preview HTTP lokal;
// produksi (tunnel/HTTPS) biarkan secure default.
const sessionConfig = {
  password: process.env.NUXT_SESSION_SECRET ?? 'dev-only-insecure-secret',
  name: 'diklat.sid',
  cookie: { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NUXT_SESSION_SECURE !== 'false', maxAge: 60 * 60 * 8 },
}

export const useStaffSession = (event: H3Event) => useSession<{ user?: SessionUser }>(event, sessionConfig)

/** Guard API: 401 tanpa login, 403 kalau role tidak sesuai. */
export const requireStaff = async (event: H3Event, roles?: SessionUser['role'][]): Promise<SessionUser> => {
  const session = await useStaffSession(event)
  const user = session.data.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Login diperlukan' })
  if (roles && !roles.includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Akses ditolak untuk role ini' })
  }
  return user
}
