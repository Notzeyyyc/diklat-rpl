import type { SubmitScoreRequest } from '@diklat/shared'
import { isValidPos } from '@diklat/shared'
import { requireStaff } from '../../utils/session'
import { publish } from '../../utils/bus'

export default defineEventHandler(async (event) => {
  const judge = await requireStaff(event)

  const body = await readBody<SubmitScoreRequest>(event)
  const teamId = body?.teamId ?? ''
  const positionId = Number(body?.positionId)
  const score = Number(body?.score)
  const notes = body?.notes?.slice(0, 500) // ponytail: batas notes cukup 500 char utk catatan lapangan

  if (!/^[0-9a-fA-F-]{36}$/.test(teamId)) throw createError({ statusCode: 400, statusMessage: 'teamId tidak valid' })
  if (!isValidPos(positionId)) throw createError({ statusCode: 400, statusMessage: 'Pos tidak valid' })
  if (!Number.isInteger(score) || score < 0 || score > 100) {
    throw createError({ statusCode: 400, statusMessage: 'Skor harus angka bulat 0-100' })
  }

  const [team] = await db`select id from teams where id = ${teamId}`
  if (!team) throw createError({ statusCode: 404, statusMessage: 'Regu tidak ditemukan' })

  const inserted = await db.begin(async (sql) => {
    await sql`delete from scores where team_id = ${teamId} and position_id = ${positionId}`
    const [row] = await sql`
      insert into scores (team_id, position_id, score, notes, judge_id)
      values (${teamId}, ${positionId}, ${score}, ${notes ?? null}, (select id from staff where username = ${judge.username}))
      returning id, created_at`
    return row
  })

  publish({ type: 'scores', teamId, positionId, score })
  return { ok: true, id: inserted.id }
})
