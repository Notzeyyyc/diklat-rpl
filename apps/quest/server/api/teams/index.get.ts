import { db } from '../../utils/db'

export default defineEventHandler(async () => {
  const rows = await db`
    select t.id, t.name, t.created_at, coalesce(array_agg(tp.position_id order by tp.position_id) filter (where tp.position_id is not null), '{}') as completed
    from teams t left join team_progress tp on tp.team_id = t.id
    group by t.id order by t.name`
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    createdAt: r.created_at,
    completedPositions: r.completed,
  }))
})
