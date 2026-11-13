#!/usr/bin/env bash
# Verifikasi UI sebelum build production. Exit 0 hanya kalau semua cek hijau.
# Butuh: dashboard dev server di :3001 (DATABASE_URL & NUXT_SESSION_SECRET sudah diset), Camoufox di /root/.cache/camoufox.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHECK_JS="$ROOT/scripts/verify-ui.check.js"
fail=0

step() { echo; echo "== $1"; }

step "1/3 typecheck (baseline 31 error pre-existing; gagal kalau bertambah)"
baseline=31
count=$(cd "$ROOT/apps/dashboard" && npx nuxi typecheck 2>&1 | grep -c "error TS" || true)
echo "error TS: $count (baseline $baseline)"
if [ "$count" -gt "$baseline" ]; then echo "FAIL: ada error TS baru"; fail=1; fi

step "2/3 UI check (chevron, dropdown width, mobile overflow)"
(cd /root/camofox && node "$CHECK_JS") || fail=1

step "3/3 hasil"
if [ "$fail" -eq 0 ]; then echo "SEMUA HIJAU"; exit 0; else echo "ADA YANG MERAH — build dibatalkan"; exit 1; fi
