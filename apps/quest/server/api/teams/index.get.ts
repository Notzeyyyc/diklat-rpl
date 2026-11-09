import { db } from '../../utils/db'
import { requireTeam } from '../../utils/team-auth'
export default defineEventHandler(async (event) => {
  const team = await requireTeam(event)
  const rows = await db`select position_id from team_progress where team_id = ${team.id} order by position_id`
  return [{ id: team.id, name: team.name, completedPositions: rows.map((r) => r.position_id) }]
})
