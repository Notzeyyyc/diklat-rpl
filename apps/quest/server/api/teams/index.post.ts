import { isValidTeamName } from '@diklat/shared'
import { db } from '../../utils/db'
import { clientIp, rateLimit } from '../../utils/ratelimit'
import { issueTeamToken } from '../../utils/team-auth'
export default defineEventHandler(async (event) => {
  if (!rateLimit(clientIp(event))) throw createError({ statusCode: 429, statusMessage: 'Terlalu banyak permintaan' })
  const body = await readBody<{ name?: string }>(event)
  const name = (body?.name ?? '').trim().toUpperCase()
  if (!isValidTeamName(name)) throw createError({ statusCode: 400, statusMessage: 'Nama regu tidak valid (3-40 karakter, alfanumerik)' })
  const [team] = await db`insert into teams (name) values (${name}) on conflict (name) do nothing returning id, name`
  if (!team) throw createError({ statusCode: 409, statusMessage: 'Nama regu sudah terdaftar' })
  await issueTeamToken(event, team.id)
  return { id: team.id, name: team.name }
})
