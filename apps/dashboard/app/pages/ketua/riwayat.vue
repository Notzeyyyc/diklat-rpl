<script setup lang="ts">
import type { TeamOverview } from '@diklat/shared'

definePageMeta({
  layout: 'ketua',
})

useHead({
  title: 'Riwayat Penilaian - Ketua Post',
})

const { overview } = useOverview()
const searchQuery = ref('')
const statusFilter = ref<{ label: string; value: string }>({ label: 'ALL', value: 'all' })

interface HistoryRow {
  teamName: string
  positionId: number
  score: number
  notes?: string
  judge?: string
  at: string
}

// Flatten semua skor dari overview (ketua melihat seluruh penilaian event)
const history = computed<HistoryRow[]>(() =>
  overview.value.teams
    .flatMap((t: TeamOverview) =>
      Object.entries(t.scores).map(([posId, s]) => ({
        teamName: t.name,
        positionId: Number(posId),
        score: s.score,
        notes: s.notes,
        judge: s.judge,
        at: s.at,
      })),
    )
    .sort((a, b) => b.at.localeCompare(a.at)),
)

const statusOptions = [
  { label: 'ALL', value: 'all' },
  { label: 'Lulus (≥60)', value: 'lulus' },
  { label: 'Remedial (<60)', value: 'remedial' },
]

const rowStatus = (h: HistoryRow) => (h.score >= 60 ? 'lulus' : 'remedial')

const filteredHistory = computed(() => {
  return history.value.filter((h) => {
    const matchSearch = !searchQuery.value || h.teamName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = statusFilter.value.value === 'all' || rowStatus(h) === statusFilter.value.value
    return matchSearch && matchStatus
  })
})

const totalScore = computed(() => filteredHistory.value.reduce((sum, h) => sum + h.score, 0))

const avgScore = computed(() => {
  if (filteredHistory.value.length === 0) return 0
  return Math.round(totalScore.value / filteredHistory.value.length)
})

const csvEscape = (v: unknown) => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s
}

function exportCSV() {
  const headers = ['Waktu', 'Kelompok', 'Pos', 'Skor', 'Status', 'Ketua', 'Catatan']
  const rows = filteredHistory.value.map(h => [h.at, h.teamName, `POS-0${h.positionId}`, h.score, rowStatus(h), h.judge, h.notes])
  const csv = [headers, ...rows].map(r => r.map(csvEscape).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'riwayat-penilaian.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      badge="RIWAYAT PENILAIAN"
      badge-color="secondary"
      title="RIWAYAT // LOG PENILAIAN POS"
      description="Lihat semua catatan penilaian yang telah dilakukan di event ini"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <StatCard label="Total Penilaian" :value="`${filteredHistory.length} Record`" icon="i-lucide-clipboard-list" color="primary" />
      <StatCard label="Rata-rata Skor" :value="`${avgScore} PTS`" icon="i-lucide-bar-chart" color="secondary" />
      <StatCard label="Total Poin" :value="`${totalScore} PTS`" icon="i-lucide-trophy" color="warning" />
      <StatCard label="Regu Dinilai" :value="`${history.length > 0 ? new Set(history.map(h => h.teamName)).size : 0} Regu`" icon="i-lucide-check-circle" color="success" />
    </div>

    <NeoCard>
      <div class="flex flex-wrap items-center gap-4">
        <UInput
          v-model="searchQuery"
          maxlength="100"
          placeholder="Cari nama kelompok..."
          icon="i-lucide-search"
          class="w-64"
        />
        <USelectMenu
          v-model="statusFilter"
          :items="statusOptions"
          placeholder="Filter Status"
          class="w-40"
        />
        <div class="ml-auto flex items-center gap-3">
          <UButton color="neutral" size="md" icon="i-lucide-download" class="neo-hover" @click="exportCSV">
            Export CSV
          </UButton>
        </div>
      </div>
    </NeoCard>

    <div class="neo-border-thick neo-shadow-xl bg-white rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-neo-surface-container border-b-2 border-neo-ink">
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Waktu</th>
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Kelompok</th>
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Pos</th>
              <th class="px-5 py-4 text-center font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Skor</th>
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Status</th>
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Ketua</th>
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Catatan</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(h, i) in filteredHistory"
              :key="i"
              class="border-b border-neo-outline-variant hover:bg-neo-surface-container transition-colors"
            >
              <td class="px-5 py-4 font-mono text-xs">{{ h.at.slice(11, 16) }}</td>
              <td class="px-5 py-4 font-display font-semibold text-sm">{{ h.teamName }}</td>
              <td class="px-5 py-4 font-mono text-xs font-bold">POS-0{{ h.positionId }}</td>
              <td class="px-5 py-4 text-center">
                <span
                  class="font-mono text-xs font-bold px-2.5 py-1 neo-border rounded-md"
                  :class="h.score >= 80 ? 'bg-neo-success text-neo-ink' : h.score >= 60 ? 'bg-neo-warning text-neo-ink' : 'bg-neo-danger text-white'"
                >
                  {{ h.score }}
                </span>
              </td>
              <td class="px-5 py-4">
                <StatusBadge
                  :label="rowStatus(h)"
                  :status="rowStatus(h) === 'lulus' ? 'completed' : 'pending'"
                />
              </td>
              <td class="px-5 py-4 font-body text-xs capitalize">{{ h.judge ?? '-' }}</td>
              <td class="px-5 py-4 font-body text-xs text-neo-on-surface-variant">{{ h.notes ?? '-' }}</td>
            </tr>
            <tr v-if="filteredHistory.length === 0">
              <td colspan="7" class="px-5 py-4 font-mono text-[10px] text-neo-on-surface-variant uppercase text-center">
                Belum ada penilaian tercatat
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="border-t-2 border-neo-ink px-5 py-4 flex items-center justify-between bg-neo-surface-container">
        <span class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest">
          Menampilkan {{ filteredHistory.length }} dari {{ history.length }} Record
        </span>
      </div>
    </div>
  </div>
</template>
