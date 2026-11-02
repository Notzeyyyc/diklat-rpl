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

  // Staff: admin + penjaga pos (pos1..pos5, role ketua = akses panel). Password HANYA dari env
  // (SEED_ADMIN_PASSWORD, SEED_POS1_PASSWORD..SEED_POS5_PASSWORD); kalau kosong → random, dicetak sekali.
  const rand = () => {
    const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    return Array.from({ length: 10 }, () => abc[Math.floor(Math.random() * abc.length)]).join('')
  }
  const staffSeeds = [
    { username: 'admin', role: 'admin', password: process.env.SEED_ADMIN_PASSWORD ?? rand() },
    ...POSITIONS.map((p) => ({
      username: `pos${p.id}`,
      role: 'ketua' as const,
      password: process.env[`SEED_POS${p.id}_PASSWORD`] ?? rand(),
    })),
  ]
  for (const s of staffSeeds) {
    const hash = await bcrypt.hash(s.password, 10)
    await sql`
      insert into staff (username, password_hash, role) values (${s.username}, ${hash}, ${s.role})
      on conflict (username) do update set password_hash = excluded.password_hash, role = excluded.role
    `
    const fromEnv = s.username === 'admin' ? !!process.env.SEED_ADMIN_PASSWORD : !!process.env[`SEED_POS${s.username.slice(3)}_PASSWORD`]
    if (!process.env.SEED_STAFF_QUIET) console.log(`staff ${s.username} (${s.role}) ${fromEnv ? 'dari env' : 'PASSWORD GENERATE — bagikan ke panitia sekarang'}: ${s.password}`)
  }
  // Akun lama 'ketua' tunggal dihapus (ganti pakai pos1..pos5); skor lama di-reassign ke admin biar FK gak nolak
  await sql`update scores set judge_id = (select id from staff where username='admin')
            where judge_id in (select id from staff where username='ketua')`
  await sql`delete from staff where username = 'ketua'`

  const [{ count: teams }] = await sql`select count(*)::int as count from teams`
  const [{ count: positions }] = await sql`select count(*)::int as count from positions`
  console.log(`seed ok: ${teams} teams, ${positions} positions`)
  await sql.end()
}

main().catch((err) => { console.error(err); process.exit(1) })
