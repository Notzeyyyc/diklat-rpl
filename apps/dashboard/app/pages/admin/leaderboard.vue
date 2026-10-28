<script setup lang="ts">
import type { TeamOverview } from '@diklat/shared'

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Leaderboard - Admin Dashboard',
})

const { overview, liveEvents } = useOverview()
const searchQuery = ref('')

// Urutkan: progres terbanyak dulu, lalu total poin
const ranked = computed<TeamOverview[]>(() =>
  [...overview.value.teams].sort((a, b) =>
    b.completedPositions.length - a.completedPositions.length || b.total - a.total,
  ),
)

const podium = computed(() => {
  const top = ranked.value.slice(0, 3)
  // urutan visual: rank 2, 1, 3
  return [top[1], top[0], top[2]]
})

const posColors = ['bg-neo-primary text-white', 'bg-neo-success text-neo-ink', 'bg-neo-surface-container-highest text-neo-ink']

const filtered = computed(() => {
  if (!searchQuery.value) return ranked.value
  const q = searchQuery.value.toLowerCase()
  return ranked.value.filter(t => t.name.toLowerCase().includes(q))
})

const posDistribution = computed(() =>
  [1, 2, 3, 4, 5].map((posId) => {
    const scores = overview.value.teams
      .map(t => t.scores[posId]?.score)
      .filter((s): s is number => typeof s === 'number')
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    return { label: `POS 0${posId}`, value: avg }
  }),
)

function teamStatus(t: TeamOverview): { label: string; status: 'completed' | 'active' | 'standby' } {
  if (t.completedPositions.length === 5) return { label: 'completed', status: 'completed' }
  if (t.completedPositions.length > 0) return { label: 'active', status: 'active' }
  return { label: 'standby', status: 'standby' }
}

const csvEscape = (v: unknown) => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s
}

function exportCSV() {
  const headers = ['Rank', 'Kelompok', 'P1', 'P2', 'P3', 'P4', 'P5', 'Total', 'Status']
  const rows = filtered.value.map((t, i) => [
    i + 1,
    t.name,
    ...[1, 2, 3, 4, 5].map(p => t.scores[p]?.score ?? 0),
    t.total,
    teamStatus(t).label,
  ])
  const csv = [headers, ...rows].map(r => r.map(csvEscape).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'leaderboard-diklat.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      badge="KLASEMEN AKHIR & POIN REAL-TIME"
      badge-color="primary"
      title="LEADERBOARD DIKLAT 2026"
      description="Kompilasi penilaian 5 Pos Rintangan, evaluasi ketahanan mental, kerja tim, dan ketepatan algoritma lapangan bagi seluruh kontingen angkatan 2026."
    >
      <template #actions>
        <div class="flex items-center gap-3">
          <span class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-neo-success opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-neo-success"></span>
            </span>
            LIVE RANKING
          </span>
          <UButton color="neutral" size="sm" icon="i-lucide-printer" class="neo-hover" @click="() => window.print()">Print</UButton>
          <UButton color="primary" size="sm" icon="i-lucide-download" class="neo-hover" @click="exportCSV">Export CSV</UButton>
        </div>
      </template>
    </PageHeader>

    <!-- Podium 3 Besar -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
      <template v-for="(p, i) in podium" :key="p?.teamId ?? i">
        <div
          class="lg:col-span-4 flex flex-col justify-between neo-border-thick neo-shadow-lg rounded-xl p-6 relative overflow-hidden neo-hover"
          :class="[posColors[i], i === 1 ? 'lg:-translate-y-4 p-7 neo-shadow-xl' : '']"
        >
          <template v-if="p">
            <div class="absolute -right-6 -bottom-6 text-white/10 font-display text-[130px] font-bold select-none leading-none pointer-events-none">{{ i === 1 ? 1 : i === 0 ? 2 : 3 }}</div>
            <div class="flex items-start justify-between gap-2 relative z-10">
              <span class="px-3 py-1 bg-white/90 text-neo-ink neo-border rounded font-mono text-[10px] font-bold uppercase tracking-wider">Rank {{ i === 1 ? 1 : i === 0 ? 2 : 3 }}</span>
              <span class="px-2.5 py-0.5 bg-white/80 text-neo-ink neo-border rounded font-mono text-[10px] font-bold uppercase">Pos {{ p.completedPositions.length }}/5</span>
            </div>
            <div class="my-6 relative z-10">
              <h2 class="font-display font-bold text-xl uppercase mt-1">{{ p.name }}</h2>
            </div>
            <div class="pt-4 border-t-2 border-white/30 flex items-end justify-between relative z-10">
              <div>
                <span class="font-mono text-[10px] uppercase tracking-wider opacity-70">Total Poin</span>
                <div class="font-display font-bold text-3xl leading-none mt-1">{{ p.total }} <span class="text-sm font-normal opacity-70">pts</span></div>
              </div>
              <div class="text-right">
                <span class="font-mono text-xs font-bold">{{ p.completedPositions.length }}/5 POS</span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="font-mono text-[10px] uppercase tracking-wider opacity-60">Belum ada data</div>
          </template>
        </div>
      </template>
    </div>

    <!-- Metric Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard label="Rata-rata Skor" :value="`${overview.stats.avgScore} PTS`" icon="i-lucide-bar-chart-3" color="primary" />
      <StatCard label="Tim Lulus Sempurna" :value="`${overview.stats.completedTeams} / ${overview.stats.totalTeams}`" icon="i-lucide-trophy" color="success" />
      <StatCard label="Sedang di Lapangan" :value="`${overview.stats.activeTeams} Kelompok`" icon="i-lucide-activity" color="secondary" />
      <StatCard label="Skor Tercatat" :value="`${overview.stats.scoresCount}`" icon="i-lucide-clock" color="warning" />
    </div>

    <!-- Tabel Lengkap -->
    <NeoCard title="KLASEMEN LENGKAP" icon="i-lucide-list" :badge="`${overview.stats.totalTeams} KELOMPOK`">
      <template #header>
        <div class="flex items-center gap-3">
          <UInput
            v-model="searchQuery"
            placeholder="Cari kelompok..."
            icon="i-lucide-search"
            size="sm"
            class="w-48"
          />
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-neo-ink">
              <th class="px-4 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-widest w-16">#</th>
              <th class="px-4 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-widest min-w-[240px]">Kelompok</th>
              <th class="px-4 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-widest min-w-[290px]">Detail Poin Tiap Pos</th>
              <th class="px-4 py-3 text-right font-mono text-[10px] font-bold uppercase tracking-widest">Total Poin</th>
              <th class="px-4 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-widest">Progres</th>
              <th class="px-4 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(t, i) in filtered"
              :key="t.teamId"
              class="border-b border-neo-outline-variant hover:bg-neo-surface-container transition-colors"
            >
              <td class="px-4 py-4 text-center">
                <span
                  class="inline-flex items-center justify-center w-8 h-8 rounded-full neo-border neo-shadow-sm font-mono text-xs font-bold"
                  :class="i === 0 ? 'bg-neo-success text-neo-ink' : i === 1 ? 'bg-neo-primary-container text-white' : i === 2 ? 'bg-neo-surface-container-highest' : 'bg-white'"
                >
                  #{{ i + 1 }}
                </span>
              </td>
              <td class="px-4 py-4">
                <div class="font-display font-semibold text-sm uppercase">
                  {{ t.name }}
                </div>
                <div class="font-mono text-[10px] text-neo-on-surface-variant mt-0.5">
                  {{ t.completedPositions.length }}/5 pos selesai
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center justify-center gap-1.5 font-mono text-[10px]">
                  <span
                    v-for="pos in 5"
                    :key="pos"
                    class="px-2 py-1 bg-neo-surface-container-high neo-border rounded font-bold"
                    :class="t.scores[pos]?.score !== undefined ? '' : 'opacity-40'"
                  >P{{ pos }}: {{ t.scores[pos]?.score ?? '-' }}</span>
                </div>
              </td>
              <td class="px-4 py-4 text-right">
                <span class="font-display font-bold text-lg leading-none">{{ t.total }}</span>
                <span class="font-mono text-[10px] text-neo-on-surface-variant block">PTS</span>
              </td>
              <td class="px-4 py-4 text-center font-mono text-xs font-bold">{{ t.completedPositions.length }}/5</td>
              <td class="px-4 py-4 text-center">
                <StatusBadge :label="teamStatus(t).label" :status="teamStatus(t).status" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </NeoCard>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <NeoCard title="DISTRIBUSI SKOR PER POS" icon="i-lucide-bar-chart-2">
        <div class="space-y-4">
          <div v-for="pos in posDistribution" :key="pos.label" class="flex items-center gap-3">
            <span class="font-mono text-[10px] font-bold uppercase tracking-widest w-16 shrink-0">{{ pos.label }}</span>
            <div class="flex-1 h-7 bg-neo-surface-container rounded-lg neo-border overflow-hidden">
              <div
                class="h-full bg-neo-primary transition-all duration-500"
                :style="{ width: `${pos.value}%` }"
              />
            </div>
            <span class="font-mono text-xs font-bold w-10 text-right">{{ pos.value }}%</span>
          </div>
        </div>
      </NeoCard>

      <NeoCard title="FEED LIVE" icon="i-lucide-activity" :badge="`${liveEvents.length} EVENTS`">
        <div class="space-y-4">
          <p v-if="liveEvents.length === 0" class="font-mono text-[10px] text-neo-on-surface-variant uppercase">
            Menunggu aktivitas realtime...
          </p>
          <div
            v-for="(e, i) in liveEvents"
            :key="`${e.at}-${i}`"
            class="flex items-start gap-3 pb-4 border-b border-neo-outline-variant last:border-0 last:pb-0"
          >
            <span class="font-mono text-[10px] text-neo-on-surface-variant shrink-0 mt-0.5">{{ e.at.slice(11, 16) }}</span>
            <div>
              <span class="font-mono text-[10px] neo-border rounded px-1.5 py-0.5 bg-neo-surface-container uppercase">{{ e.type === 'progress' ? 'Progress' : 'Skor' }} Pos {{ e.positionId }}</span>
              <p class="font-body text-xs mt-1.5">
                {{ e.type === 'progress' ? `Regu menyelesaikan Pos ${e.positionId}` : `Skor ${e.score} dicatat untuk Pos ${e.positionId}` }}
              </p>
            </div>
          </div>
        </div>
      </NeoCard>
    </div>
  </div>
</template>
