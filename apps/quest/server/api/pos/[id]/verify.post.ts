import { isValidPos } from '@diklat/shared'
import { db } from '../../../utils/db'
import { publish } from '../../../utils/bus'
import { clientIp, rateLimit } from '../../../utils/ratelimit'

export default defineEventHandler(async (event) => {
  if (!rateLimit(clientIp(event))) throw createError({ statusCode: 429, statusMessage: 'Terlalu banyak permintaan' })

  const positionId = Number(getRouterParam(event, 'id'))
  if (!isValidPos(positionId)) throw createError({ statusCode: 404, statusMessage: 'Pos tidak ditemukan' })

  const body = await readBody<{ teamId?: string; code?: string }>(event)
  const teamId = body?.teamId ?? ''
  const code = (body?.code ?? '').trim().toUpperCase()
  if (!/^[0-9a-fA-F-]{36}$/.test(teamId)) throw createError({ statusCode: 400, statusMessage: 'teamId tidak valid' })
  if (!code) throw createError({ statusCode: 400, statusMessage: 'Code wajib diisi' })

  const [team] = await db`select id from teams where id = ${teamId}`
  if (!team) throw createError({ statusCode: 404, statusMessage: 'Regu tidak ditemukan' })

  // One-time code per regu dari ketua: cocokkan code aktif (used_at is null), lalu hanguskan atomis.
  const rows = await db`
    update pos_codes set used_at = now()
    where team_id = ${teamId} and position_id = ${positionId}
      and code = ${code} and used_at is null
    returning id`
  if (rows.length === 0) {
    throw createError({ statusCode: 401, statusMessage: 'Code salah atau sudah hangus — minta code baru dari ketua di pos' })
  }

  const [row] = await db`
    insert into team_progress (team_id, position_id) values (${teamId}, ${positionId})
    on conflict (team_id, position_id) do nothing
    returning completed_at`
  if (row) publish({ type: 'progress', teamId, positionId })

  return { ok: true, positionId }
})
