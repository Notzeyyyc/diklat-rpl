import bcrypt from 'bcryptjs'
import type { LoginRequest } from '@diklat/shared'
import { useStaffSession } from '../../utils/session'
import { clientIp, rateLimit } from '../../utils/ratelimit'

export default defineEventHandler(async (event) => {
  if (!rateLimit(clientIp(event))) throw createError({ statusCode: 429, statusMessage: 'Terlalu banyak permintaan' })

  const body = await readBody<LoginRequest>(event)
  const username = (body?.username ?? '').trim()
  const password = body?.password ?? ''
  if (!username || !password) throw createError({ statusCode: 400, statusMessage: 'Username dan password wajib diisi' })

  const [staff] = await db`select username, password_hash, role from staff where username = ${username}`
  // pesan error sama untuk user tak dikenal & password salah (jangan bocorkan keberadaan akun)
  if (!staff || !(await bcrypt.compare(password, staff.password_hash))) {
    throw createError({ statusCode: 401, statusMessage: 'ID atau Password salah.' })
  }

  const session = await useStaffSession(event)
  await session.update({ user: { username: staff.username, role: staff.role } })

  return { username: staff.username, role: staff.role }
})
