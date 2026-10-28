// Smoke test quest API (node --test). Jalankan kedua server build dulu, lalu:
// QUEST_URL=http://localhost:3000 DASH_URL=http://localhost:3001 node --test tests/api.test.mjs
// Catatan: quest rate-limit 10 req/menit/IP in-memory — suite sengaja <=9 request;
// kalau 429 semua, restart server (reset counter) lalu jalankan SEKALI.
import { test } from 'node:test'
import assert from 'node:assert/strict'

const BASE = process.env.QUEST_URL ?? 'http://localhost:3000'
const DASH = process.env.DASH_URL ?? 'http://localhost:3001'
const KETUA = { username: 'ketua', password: process.env.TEST_KETUA_PASSWORD ?? 'Ketua#2026' }

const api = async (path, opts = {}) => {
  const res = await fetch(BASE + path, {
    ...opts,
    headers: { 'content-type': 'application/json', ...(opts.headers ?? {}) },
  })
  let body = null
  try { body = await res.json() } catch { /* SSE/empty */ }
  return { status: res.status, body }
}

const uniqueName = () => `TEST REGU ${Date.now()}${Math.floor(Math.random() * 1000)}`

/** Generate one-time code via dashboard (ketua login) — tidak kena rate-limit quest. */
const genCode = async (teamId, positionId) => {
  const login = await fetch(DASH + '/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(KETUA),
  })
  assert.equal(login.status, 200)
  const cookie = (login.headers.getSetCookie?.() ?? []).map(c => c.split(';')[0]).join('; ')
  const res = await fetch(DASH + '/api/admin/pos-codes', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ teamId, positionId }),
  })
  assert.equal(res.status, 200)
  return (await res.json()).code
}

test('registrasi sukses → team_id; nama tidak valid → 400', async () => {
  const reg = await api('/api/teams', { method: 'POST', body: JSON.stringify({ name: uniqueName() }) })
  assert.equal(reg.status, 200)
  assert.match(reg.body.id, /^[0-9a-f-]{36}$/)

  const bad = await api('/api/teams', { method: 'POST', body: JSON.stringify({ name: 'x' }) })
  assert.equal(bad.status, 400)
})

test('POS terbuka semua: pos 5 langsung dengan code → 200; code hangus → 401; pos tak dikenal → 404', async () => {
  const reg = await api('/api/teams', { method: 'POST', body: JSON.stringify({ name: uniqueName() }) })
  const code = await genCode(reg.body.id, 5)

  const v = await api('/api/pos/5/verify', {
    method: 'POST',
    body: JSON.stringify({ teamId: reg.body.id, code }),
  })
  assert.equal(v.status, 200)
  assert.equal(v.body.ok, true)

  const teams = await api('/api/teams')
  const me = teams.body.find((t) => t.id === reg.body.id)
  assert.deepEqual(me.completedPositions, [5])

  // code hangus: dipakai ulang → 401
  const again = await api('/api/pos/5/verify', {
    method: 'POST',
    body: JSON.stringify({ teamId: reg.body.id, code }),
  })
  assert.equal(again.status, 401)

  // pos tak dikenal → 404
  const nf = await api('/api/pos/99/verify', {
    method: 'POST',
    body: JSON.stringify({ teamId: reg.body.id, code: 'ABC123' }),
  })
  assert.equal(nf.status, 404)
})

test('code salah → 401; generate ulang → code lama hangus, code baru valid', async () => {
  const reg = await api('/api/teams', { method: 'POST', body: JSON.stringify({ name: uniqueName() }) })

  const wrong = await api('/api/pos/1/verify', {
    method: 'POST',
    body: JSON.stringify({ teamId: reg.body.id, code: 'NGASAL' }),
  })
  assert.equal(wrong.status, 401)

  const old = await genCode(reg.body.id, 3)
  const fresh = await genCode(reg.body.id, 3)
  assert.notEqual(old, fresh)

  const stale = await api('/api/pos/3/verify', {
    method: 'POST',
    body: JSON.stringify({ teamId: reg.body.id, code: old }),
  })
  assert.equal(stale.status, 401)

  const v = await api('/api/pos/3/verify', {
    method: 'POST',
    body: JSON.stringify({ teamId: reg.body.id, code: fresh }),
  })
  assert.equal(v.status, 200)
})

test('SSE: stream terbuka + heartbeat ping', async () => {
  const ctrl = new AbortController()
  const res = await fetch(BASE + '/api/events', { signal: ctrl.signal })
  assert.equal(res.status, 200)
  const reader = res.body.getReader()
  const { value } = await reader.read()
  const chunk = new TextDecoder().decode(value)
  assert.match(chunk, /data: \{"type":"ping"\}/)
  ctrl.abort()
})
