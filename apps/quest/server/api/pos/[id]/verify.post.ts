import bcrypt from 'bcryptjs'
import { isValidPos, isPosAvailable } from '@diklat/shared'
import { db } from '../../../utils/db'
import { publish } from '../../../utils/bus'
import { clientIp, rateLimit } from '../../../utils/ratelimit'

export default defineEventHandler(async (event) => {
  if (!rateLimit(clientIp(event))) throw createError({ statusCode: 429, statusMessage: 'Terlalu banyak permintaan' })

  const positionId = Number(getRouterParam(event, 'id'))
  if (!isValidPos(positionId)) throw createError({ statusCode: 404, statusMessage: 'Pos tidak ditemukan' })

  const body = await readBody<{ teamId?: string; password?: string }>(event)
  const teamId = body?.teamId ?? ''
  const password = (body?.password ?? '').trim()
  if (!/^[0-9a-fA-F-]{36}$/.test(teamId)) throw createError({ statusCode: 400, statusMessage: 'teamId tidak valid' })
  if (!password) throw createError({ statusCode: 400, statusMessage: 'Password wajib diisi' })

  const [team] = await db`select id from teams where id = ${teamId}`
  if (!team) throw createError({ statusCode: 404, statusMessage: 'Regu tidak ditemukan' })

  const [pos] = await db`select password_hash from positions where id = ${positionId}`
  if (!pos) throw createError({ statusCode: 404, statusMessage: 'Pos tidak ditemukan' })

  // guard sequential server-side: completedPos baca dari DB, bukan client
  const completed = await db`select position_id from team_progress where team_id = ${teamId}`
  const completedIds = completed.map((r) => r.position_id)
  if (!isPosAvailable(positionId, completedIds)) {
    throw createError({ statusCode: 403, statusMessage: 'Pos masih terkunci — selesaikan pos sebelumnya' })
  }

  if (!(await bcrypt.compare(password, pos.password_hash))) {
    throw createError({ statusCode: 401, statusMessage: 'Password salah. Konfirmasi ke panitia di Pos!' })
  }

  const [row] = await db`
    insert into team_progress (team_id, position_id) values (${teamId}, ${positionId})
    on conflict (team_id, position_id) do nothing
    returning completed_at`
  if (row) publish({ type: 'progress', teamId, positionId })

  return { ok: true, positionId }
})
