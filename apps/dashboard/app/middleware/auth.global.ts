import type { SessionUser } from '@diklat/shared'

// Guard halaman: /admin/* hanya admin, /ketua/* hanya ketua. Sesi dicek via /api/auth/me (cookie httpOnly).
export default defineNuxtRouteMiddleware(async (to) => {
  // /api/auth/me tidak lewat guard server — aman dipanggil di semua halaman
  const user = await useRequestFetch()<SessionUser | null>('/api/auth/me').catch(() => null)

  if (to.path === '/login') {
    if (user) return navigateTo(user.role === 'admin' ? '/admin/tracking-murid' : '/ketua/panel')
    return
  }

  if (!user) return navigateTo('/login')

  const need = to.path.startsWith('/admin') ? 'admin' : 'ketua'
  if (user.role !== need) {
    return navigateTo(user.role === 'admin' ? '/admin/tracking-murid' : '/ketua/panel')
  }
})
