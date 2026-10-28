// Smoke test quest API (node --test). Jalankan server build dulu, lalu:
// QUEST_URL=http://localhost:3000 node --test tests/api.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'

const BASE = process.env.QUEST_URL ?? 'http://localhost:3000'

const api = async (path, opts = {}) => {
  const res = await fetch(BASE + path, {
    ...opts,
    headers: { 'content-type': 'application/json', ...(opts.headers ?? {}) },
  })
  let body = null
  try { body = await res.json() } catch { /* SSE/empty */ }
  return { status: res.status, body }
}

const uniqueName = () => `TEST REGU ${Date.now()}`

test('happy path: register → verify pos 1 (password benar)', async () => {
  const reg = await api('/api/teams', { method: 'POST', body: JSON.stringify({ name: uniqueName() }) })
  assert.equal(reg.status, 200)
  assert.match(reg.body.id, /^[0-9a-f-]{36}$/)

  const v = await api('/api/pos/1/verify', {
    method: 'POST',
    body: JSON.stringify({ teamId: reg.body.id, password: 'RPLJUARA1' }),
  })
  assert.equal(v.status, 200)
  assert.equal(v.body.ok, true)

  const teams = await api('/api/teams')
  const me = teams.body.find((t) => t.id === reg.body.id)
  assert.deepEqual(me.completedPositions, [1])
})

test('password salah → 401', async () => {
  const reg = await api('/api/teams', { method: 'POST', body: JSON.stringify({ name: uniqueName() }) })
  const v = await api('/api/pos/1/verify', {
    method: 'POST',
    body: JSON.stringify({ teamId: reg.body.id, password: 'NGASAL' }),
  })
  assert.equal(v.status, 401)
})

test('bypass guard: pos 2 tanpa selesaikan pos 1 → 403', async () => {
  const reg = await api('/api/teams', { method: 'POST', body: JSON.stringify({ name: uniqueName() }) })
  const v = await api('/api/pos/2/verify', {
    method: 'POST',
    body: JSON.stringify({ teamId: reg.body.id, password: 'RPLJUARA2' }),
  })
  assert.equal(v.status, 403)
})

test('nama tidak valid → 400; pos tak dikenal → 404', async () => {
  const bad = await api('/api/teams', { method: 'POST', body: JSON.stringify({ name: 'x' }) })
  assert.equal(bad.status, 400)
  const reg = await api('/api/teams', { method: 'POST', body: JSON.stringify({ name: uniqueName() }) })
  const nf = await api('/api/pos/99/verify', {
    method: 'POST',
    body: JSON.stringify({ teamId: reg.body.id, password: 'apapun' }),
  })
  assert.equal(nf.status, 404)
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
