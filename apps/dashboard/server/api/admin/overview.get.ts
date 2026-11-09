import type { OverviewResponse } from '@diklat/shared'
import { requireStaff } from '../../utils/session'
import { db } from '../../utils/db'

export default defineEventHandler(async (event): Promise<OverviewResponse> => {
  await requireStaff(event, ['admin', 'ketua'])

  const teams = await db`select id, name, created_at from teams order by name`
  const progress = await db`select team_id, position_id from team_progress`
  const scoreRows = await db`
    select s.team_id, s.position_id, s.score, s.notes, s.created_at, st.username as judge
    from scores s left join staff st on st.id = s.judge_id`

  const completedByTeam = new Map<string, number[]>()
  for (const p of progress) {
    const list = completedByTeam.get(p.team_id) ?? []
    list.push(p.position_id)
    completedByTeam.set(p.team_id, list)
  }
  const scoresByTeam = new Map<string, Record<number, { score: number; notes?: string; judge?: string; at: string }>>()
  for (const s of scoreRows) {
    const m = scoresByTeam.get(s.team_id) ?? {}
    m[s.position_id] = { score: s.score, notes: s.notes ?? undefined, judge: s.judge ?? undefined, at: s.created_at }
    scoresByTeam.set(s.team_id, m)
  }

  const rows = teams.map((t) => {
    const scores = scoresByTeam.get(t.id) ?? {}
    const total = Object.values(scores).reduce((sum, s) => sum + s.score, 0)
    return {
      teamId: t.id,
      name: t.name,
      completedPositions: (completedByTeam.get(t.id) ?? []).sort((a, b) => a - b),
      scores,
      total,
    }
  })

  const completedTeams = rows.filter((r) => r.completedPositions.length === 5).length
  const activeTeams = rows.filter((r) => r.completedPositions.length > 0 && r.completedPositions.length < 5).length
  const allScores = rows.flatMap((r) => Object.values(r.scores))
  const avgScore = allScores.length
    ? Math.round(allScores.reduce((sum, s) => sum + s.score, 0) / allScores.length)
    : 0

  return {
    teams: rows,
    stats: {
      totalTeams: rows.length,
      activeTeams,
      completedTeams,
      avgScore,
      scoresCount: allScores.length,
    },
  }
})
