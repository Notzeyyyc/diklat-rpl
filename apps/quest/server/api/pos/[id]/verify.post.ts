import { isValidPos } from '@diklat/shared'
import { db } from '../../../utils/db'
import { publish } from '../../../utils/bus'
import { clientIp, rateLimit } from '../../../utils/ratelimit'
import { requireTeam } from '../../../utils/team-auth'
export default defineEventHandler(async (event) => {
  if (!rateLimit(clientIp(event))) throw createError({ statusCode: 429, statusMessage: 'Terlalu banyak permintaan' })
  const positionId = Number(getRouterParam(event, 'id'))
  if (!isValidPos(positionId)) throw createError({ statusCode: 404, statusMessage: 'Pos tidak ditemukan' })
  const team = await requireTeam(event)
  const body = await readBody<{ code?: string }>(event)
  const code = (body?.code ?? '').trim().toUpperCase()
  if (!code) throw createError({ statusCode: 400, statusMessage: 'Code wajib diisi' })
  const rows = await db`update pos_codes set used_at = now() where team_id = ${team.id} and position_id = ${positionId} and code = ${code} and used_at is null returning id`
  if (rows.length === 0) throw createError({ statusCode: 401, statusMessage: 'Code salah atau sudah hangus — minta code baru dari ketua di pos' })
  const [row] = await db`insert into team_progress (team_id, position_id) values (${team.id}, ${positionId}) on conflict (team_id, position_id) do nothing returning completed_at`
  if (row) publish({ type: 'progress', teamId: team.id, positionId })
  return { ok: true, positionId }
})
