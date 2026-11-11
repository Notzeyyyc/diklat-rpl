// Seed schema + 5 posisi tanpa team atau akun demo.
// DATABASE_URL wajib di env. Password pos statis dihapus: verifikasi memakai one-time code.
import { readFileSync } from 'node:fs'
import postgres from 'postgres'
import { POSITIONS } from '../src/positions.ts'

const sql = postgres(process.env.DATABASE_URL!, { max: 1 })

const SEED_DEMO_DATA = process.env.SEED_DEMO_DATA === 'true'

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

  if (SEED_DEMO_DATA) {
    for (const name of TEAM_SEEDS) {
      await sql`insert into teams (name) values (${name}) on conflict (name) do nothing`
    }
  }

  const [{ count: teams }] = await sql`select count(*)::int as count from teams`
  const [{ count: positions }] = await sql`select count(*)::int as count from positions`
  console.log(`seed ok: ${teams} teams, ${positions} positions; demo data: ${SEED_DEMO_DATA ? 'enabled' : 'disabled'}`)
  await sql.end()
}

main().catch((err) => { console.error(err); process.exit(1) })
