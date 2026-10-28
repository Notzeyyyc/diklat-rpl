import bcrypt from 'bcryptjs'
import { isValidTeamName } from '@diklat/shared'
import { db } from '../../utils/db'
import { clientIp, rateLimit } from '../../utils/ratelimit'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  if (!rateLimit(clientIp(event))) throw createError({ statusCode: 429, statusMessage: 'Terlalu banyak permintaan' })

  const body = await readBody<{ name?: string }>(event)
  const name = (body?.name ?? '').trim().toUpperCase()
  if (!isValidTeamName(name)) throw createError({ statusCode: 400, statusMessage: 'Nama regu tidak valid (3-40 karakter, alfanumerik)' })

  // tag template = parameterized, aman SQL injection
  const [team] = await db`insert into teams (name) values (${name}) on conflict (name) do nothing returning id, name`
  if (!team) throw createError({ statusCode: 409, statusMessage: 'Nama regu sudah terdaftar' })
  return { id: team.id, name: team.name }
})
