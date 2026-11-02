#!/usr/bin/env bash
# Init database: buat DB (opsional) + pasang schema.sql SAJA — tanpa seed data (teams/positions/staff kosong).
# Pakai: DATABASE_URL=postgres://user:pass@host/db ./init-db.sh
# Opsional POSTGRES_ADMIN_URL=postgres://user:pass@host/postgres → bikin database kalau belum ada.
set -euo pipefail
cd "$(dirname "$0")/.."

: "${DATABASE_URL:?DATABASE_URL wajib di env}"

if [ -n "${POSTGRES_ADMIN_URL:-}" ]; then
  dbname="$(echo "$DATABASE_URL" | sed -E 's#^postgres(ql)?://[^/]+/([^?]+).*#\2#')"
  exists="$(psql "$POSTGRES_ADMIN_URL" -tAc "select 1 from pg_database where datname='$dbname'")"
  if [ "$exists" != "1" ]; then
    psql "$POSTGRES_ADMIN_URL" -c "create database \"$dbname\""
    echo "database $dbname dibuat"
  fi
fi

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f schema.sql
echo "init ok: skema terpasang, tabel kosong (isi data: npx tsx scripts/seed.ts)"