// Seed: 5 pos + 10 tim. Jalankan: pnpm --filter @diklat/shared seed
// DATABASE_URL wajib di env. Password pos statis dihapus (28 Okt): verifikasi pakai one-time code.
import { readFileSync } from 'node:fs'
import postgres from 'postgres'
import bcrypt from 'bcryptjs'
import { POSITIONS } from '../src/positions.ts'

const sql = postgres(process.env.DATABASE_URL!, { max: 1 })

const TEAM_SEEDS = [
  'CYBER EAGLE 07', 'NULL POINTER', 'SQL SLASHERS', 'BIT WIZARDS', 'KERNEL PANIC',
  'HTML HEROES', 'STACK SMASHERS', 'LOOP LEGENDS', 'PIXEL PIONEERS', 'CACHE KINGS',
]

async function main() {
  const schema = readFileSync(new URL('../schema.sql', import.meta.url), 'utf8')
  await sql.unsafe(schema)

  for (const pos of POSITIONS) {
    await sql`
      insert into positions (id, title) values (${pos.id}, ${pos.title})
      on conflict (id) do update set title = excluded.title
    `
  }

  for (const name of TEAM_SEEDS) {
    await sql`insert into teams (name) values (${name}) on conflict (name) do nothing`
  }

  // Password staff dari env (JANGAN hardcode di repo): SEED_ADMIN_PASSWORD & SEED_KETUA_PASSWORD.
  const staffSeeds = [
    { username: 'admin', role: 'admin', password: process.env.SEED_ADMIN_PASSWORD },
    { username: 'ketua', role: 'ketua', password: process.env.SEED_KETUA_PASSWORD },
  ]
  for (const s of staffSeeds) {
    if (!s.password) throw new Error(`Set ${s.username === 'admin' ? 'SEED_ADMIN' : 'SEED_KETUA'}_PASSWORD di env`)
    const hash = await bcrypt.hash(s.password, 10)
    await sql`
      insert into staff (username, password_hash, role) values (${s.username}, ${hash}, ${s.role})
      on conflict (username) do update set password_hash = excluded.password_hash, role = excluded.role
    `
  }

  const [{ count: teams }] = await sql`select count(*)::int as count from teams`
  const [{ count: positions }] = await sql`select count(*)::int as count from positions`
  console.log(`seed ok: ${teams} teams, ${positions} positions`)
  await sql.end()
}

main().catch((err) => { console.error(err); process.exit(1) })
