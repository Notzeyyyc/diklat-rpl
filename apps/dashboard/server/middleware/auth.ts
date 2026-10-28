import { requireStaff } from '../utils/session'

// Guard API: /api/admin/* staff — GET overview boleh ketua (panelnya fetch itu), sisanya admin.
// /api/scores & logout staff (ketua/admin). Endpoint lain publik.
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  if (path.startsWith('/api/admin/')) {
    // pos-codes: ketua generate one-time code (keputusan owner 28 Okt); overview GET juga boleh ketua.
    const ketuaAllowed =
      (path === '/api/admin/overview' && getMethod(event) === 'GET') ||
      (path === '/api/admin/pos-codes' && getMethod(event) === 'POST')
    await requireStaff(event, ketuaAllowed ? ['admin', 'ketua'] : ['admin'])
  }
  else if (path.startsWith('/api/scores') || path === '/api/auth/logout') await requireStaff(event)
})
