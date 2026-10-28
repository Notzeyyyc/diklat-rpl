import { isValidPos } from '@diklat/shared'
import { requireStaff } from '../../utils/session'
import { db } from '../../utils/db'

// Ketua generate one-time code untuk (regu, pos). Code lama yang belum terpakai
// otomatis kegantikan lewat unique partial index idx_pos_codes_active.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // tanpa I/L/O/0/1 — bebas salah baca

export default defineEventHandler(async (event) => {
  await requireStaff(event, ['admin', 'ketua'])

  const body = await readBody<{ teamId?: string; positionId?: number }>(event)
  const teamId = body?.teamId ?? ''
  const positionId = Number(body?.positionId)
  if (!/^[0-9a-fA-F-]{36}$/.test(teamId)) throw createError({ statusCode: 400, statusMessage: 'teamId tidak valid' })
  if (!isValidPos(positionId)) throw createError({ statusCode: 400, statusMessage: 'Pos tidak valid' })

  const [team] = await db`select id from teams where id = ${teamId}`
  if (!team) throw createError({ statusCode: 404, statusMessage: 'Regu tidak ditemukan' })

  let code = ''
  for (let attempt = 0; attempt < 5; attempt++) {
    code = Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]!).join('')
    try {
      const [row] = await db`
        insert into pos_codes (team_id, position_id, code) values (${teamId}, ${positionId}, ${code})
        on conflict (team_id, position_id) where used_at is null
        do update set code = excluded.code, created_at = now()
        returning code`
      return { code: row!.code }
    } catch { /* raceunik unik (mis. 6-char bentrok) → coba lagi */ }
  }
  throw createError({ statusCode: 500, statusMessage: 'Gagal generate code — coba lagi' })
})
