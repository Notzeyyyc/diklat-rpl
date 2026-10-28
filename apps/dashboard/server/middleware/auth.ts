import { requireStaff } from '../utils/session'

// Guard API: /api/admin/* hanya admin, /api/scores staff (ketua/admin). Endpoint lain publik.
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  if (path.startsWith('/api/admin/')) await requireStaff(event, ['admin'])
  else if (path.startsWith('/api/scores') || path === '/api/auth/logout') await requireStaff(event)
})
