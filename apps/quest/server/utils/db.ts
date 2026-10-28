import postgres from 'postgres'

// ponytail: singleton di globalThis supaya HMR/dev gak buka koneksi baru tiap reload.
// Upgrade: pindah ke LISTEN/NOTIFY kalau nanti multi-instance.
declare const globalThis: Record<string, unknown> & { __diklatSql?: postgres.Sql }

export const db: postgres.Sql =
  globalThis.__diklatSql ??
  (globalThis.__diklatSql = postgres(process.env.DATABASE_URL!, { max: 10 }))
