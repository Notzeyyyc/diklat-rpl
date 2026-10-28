// Smoke test dashboard API (node --test). Jalankan server dulu, lalu:
// DASH_URL=http://localhost:3001 node --test tests/api.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'

const BASE = process.env.DASH_URL ?? 'http://localhost:3001'
const ADMIN = { username: 'admin', password: process.env.TEST_ADMIN_PASSWORD ?? 'Admin#2026' }
const KETUA = { username: 'ketua', password: process.env.TEST_KETUA_PASSWORD ?? 'Ketua#2026' }

const api = async (path, opts = {}) => {
  const res = await fetch(BASE + path, {
    ...opts,
    headers: { 'content-type': 'application/json', ...(opts.headers ?? {}) },
  })
  let body = null
  try { body = await res.json() } catch { /* empty */ }
  return { status: res.status, body, headers: res.headers }
}

const login = async (user) => {
  const res = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(user) })
  const cookie = (res.headers.getSetCookie?.() ?? []).map(c => c.split(';')[0]).join('; ')
  return { res, cookie }
}

test('login salah → 401', async () => {
  const { res } = await login({ username: ADMIN.username, password: 'ngasal' })
  assert.equal(res.status, 401)
})

test('login admin benar → cookie session; guard role: ketua tidak boleh /api/admin/*', async () => {
  const { res, cookie } = await login(KETUA)
  assert.equal(res.status, 200)
  assert.match(cookie, /diklat\.sid/)
  const denied = await api('/api/admin/overview', { headers: { cookie } })
  assert.equal(denied.status, 403)
})

test('tanpa login → /api/admin/overview & /api/scores 401', async () => {
  assert.equal((await api('/api/admin/overview')).status, 401)
  assert.equal((await api('/api/scores', { method: 'POST', body: JSON.stringify({}) })).status, 401)
})

test('happy path: admin overview + submit skor → SSE event', async (t) => {
  const { cookie } = await login(ADMIN)
  assert.ok(cookie)

  const overview = await api('/api/admin/overview', { headers: { cookie } })
  assert.equal(overview.status, 200)
  assert.ok(overview.body.teams.length > 0)
  assert.ok(overview.body.stats.totalTeams > 0)

  const team = overview.body.teams[0]
  const teamId = team.teamId
  const positionId = team.completedPositions.length < 5 ? team.completedPositions.length + 1 : 1

  // SSE subscribe sebelum submit
  const sse = await fetch(BASE + '/api/events', { headers: { accept: 'text/event-stream' } })
  assert.equal(sse.headers.get('content-type'), 'text/event-stream')

  const submit = await api('/api/scores', {
    method: 'POST',
    headers: { cookie },
    body: JSON.stringify({ teamId, positionId, score: 77, notes: 'test' }),
  })
  assert.equal(submit.status, 200)

  // baca event pertama dari stream (harus progress/scores yang kita publish)
  const reader = sse.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  let found = false
  for (let i = 0; i < 30 && !found; i++) {
    const { value, done } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    if (buf.includes('"type":"scores"')) {
      found = true
      assert.ok(buf.includes(`"positionId":${positionId}`))
    }
  }
  await reader.cancel()
  assert.ok(found, 'event scores harus muncul di SSE stream')

  // cleanup: nilai 0 biar dashboard bersih (delete+insert pattern: skor ditimpa)
  await api('/api/scores', { method: 'POST', headers: { cookie }, body: JSON.stringify({ teamId, positionId, score: 0 }) })
})

test('skor tidak valid → 400', async () => {
  const { cookie } = await login(ADMIN)
  const overview = await api('/api/admin/overview', { headers: { cookie } })
  const teamId = overview.body.teams[0].teamId
  const bad = await api('/api/scores', {
    method: 'POST',
    headers: { cookie },
    body: JSON.stringify({ teamId, positionId: 1, score: 150 }),
  })
  assert.equal(bad.status, 400)
})

test('logout clear session', async () => {
  const { cookie } = await login(ADMIN)
  const out = await api('/api/auth/logout', { method: 'POST', headers: { cookie } })
  assert.equal(out.status, 200)
  // stateless cookie session: server mengeluarkan cookie cleared — klien tidak lagi membawa sesi
  const clearedCookie = (out.headers.getSetCookie?.() ?? []).map(c => c.split(';')[0]).join('; ')
  const me = await api('/api/auth/me', { headers: { cookie: clearedCookie } })
  assert.equal(me.body, null)
})
