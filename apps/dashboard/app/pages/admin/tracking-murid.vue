<script setup lang="ts">
import type { TeamOverview } from '@diklat/shared'

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Tracking Murid - Admin Dashboard',
})

const { overview, refresh } = useOverview()
const searchQuery = ref('')
const posFilter = ref<{ label: string; value: string }>({ label: 'ALL', value: 'all' })
const statusFilter = ref<{ label: string; value: string }>({ label: 'ALL', value: 'all' })

const posOptions = [
  { label: 'ALL', value: 'all' },
  { label: 'BASECAMP', value: '0' },
  ...[1, 2, 3, 4, 5].map(p => ({ label: `POS-0${p}`, value: String(p) })),
]

const statusOptions = [
  { label: 'ALL', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Standby', value: 'standby' },
]

const statusBadgeMap: Record<string, 'success' | 'warning' | 'active' | 'standby' | 'pending' | 'completed' | 'busy' | 'info' | 'danger'> = {
  active: 'active',
  completed: 'completed',
  standby: 'standby',
}

// Pos saat ini: BASECAMP (belum mulai) atau pos berikutnya yang belum selesai
const currentPos = (t: TeamOverview) =>
  t.completedPositions.length === 0 ? 'BASECAMP' : `POS-0${Math.min(...t.completedPositions) + 1}`

const teamStatus = (t: TeamOverview) =>
  t.completedPositions.length === 5 ? 'completed' : t.completedPositions.length > 0 ? 'active' : 'standby'

const filteredTeams = computed(() => {
  return overview.value.teams.filter((t) => {
    const matchSearch = !searchQuery.value || t.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchPos = posFilter.value.value === 'all' || currentPos(t) === posFilter.value.label
    const matchStatus = statusFilter.value.value === 'all' || teamStatus(t) === statusFilter.value.value
    return matchSearch && matchPos && matchStatus
  })
})

const csvEscape = (v: unknown) => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s
}

function exportCSV() {
  const headers = ['Nama Kelompok', 'Progres', 'Pos Saat Ini', 'Status']
  const rows = filteredTeams.value.map(t => [t.name, `${t.completedPositions.length}/5`, currentPos(t), teamStatus(t)])
  const csv = [headers, ...rows].map(r => r.map(csvEscape).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'tracking-murid.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      badge="LIVE TELEMETRY"
      badge-color="primary"
      title="TRACKING MURID // MONITORING KELOMPOK"
      description="Pantau posisi kelompok, tingkat level, pengali skor, dan status secara real-time. Kelompok bebas memilih pos tanpa urutan linier."
    >
      <template #actions>
        <div class="flex items-center gap-3">
          <div class="hidden xl:flex flex-col items-end">
            <span class="font-mono text-[10px] text-neo-on-surface-variant uppercase font-bold">Automatic Refresh</span>
            <span class="font-mono text-xs text-neo-on-surface font-bold">Interval: 5 Detik</span>
          </div>
          <UButton color="neutral" size="md" icon="i-lucide-refresh-cw" class="neo-hover" @click="refresh">
            Refresh Data
          </UButton>
        </div>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <StatCard label="Total Registered" :value="`${overview.stats.totalTeams} Tim`" subtext="Peserta terdaftar di sistem" icon="i-lucide-users" color="primary" />
      <StatCard label="Sedang di Lapangan" :value="`${overview.stats.activeTeams} Tim`" subtext="Sudah mulai, belum selesai" icon="i-lucide-activity" color="success" />
      <StatCard label="Selesai Semua Pos" :value="`${overview.stats.completedTeams} Tim`" subtext="5/5 pos tuntas" icon="i-lucide-check-circle" color="secondary" />
      <StatCard label="Standby / Basecamp" :value="`${overview.stats.totalTeams - overview.stats.activeTeams - overview.stats.completedTeams} Tim`" subtext="Belum mulai" icon="i-lucide-pause-circle" color="warning" />
    </div>

    <NeoCard>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div class="md:col-span-6 relative">
          <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neo-on-surface-variant" />
          <UInput
            v-model="searchQuery"
            maxlength="100"
            placeholder="Cari nama kelompok..."
            class="w-full pl-10"
          />
        </div>
        <div class="md:col-span-3">
          <USelectMenu
            v-model="posFilter"
            :items="posOptions"
            placeholder="Filter Pos"
            class="w-full"
          />
        </div>
        <div class="md:col-span-3">
          <USelectMenu
            v-model="statusFilter"
            :items="statusOptions"
            placeholder="Filter Status"
            class="w-full"
          />
        </div>
      </div>
    </NeoCard>

    <div class="neo-border-thick neo-shadow-xl bg-white rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-neo-surface-container border-b-2 border-neo-ink">
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Nama Kelompok</th>
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Progres</th>
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Pos Saat Ini</th>
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="team in filteredTeams"
              :key="team.name"
              class="border-b border-neo-outline-variant hover:bg-neo-surface-container transition-colors"
            >
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded bg-neo-primary neo-border neo-shadow-sm flex items-center justify-center font-mono text-xs font-bold text-white">
                    {{ filteredTeams.indexOf(team) + 1 }}
                  </div>
                  <div>
                    <span class="font-display font-semibold text-sm block">{{ team.name }}</span>
                    <span class="font-mono text-[10px] text-neo-on-surface-variant">Progres: {{ team.completedPositions.length }}/5 pos</span>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4">
                <span class="font-mono text-xs neo-border rounded px-2 py-0.5 bg-neo-primary-container/10 font-bold">{{ team.completedPositions.length }}/5</span>
              </td>
              <td class="px-5 py-4 font-display font-semibold text-sm">{{ currentPos(team) }}</td>
              <td class="px-5 py-4">
                <StatusBadge :label="teamStatus(team)" :status="statusBadgeMap[teamStatus(team)] || 'active'" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="border-t-2 border-neo-ink px-5 py-4 flex items-center justify-between bg-neo-surface-container">
        <span class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest">
          Menampilkan {{ filteredTeams.length }} dari {{ overview.stats.totalTeams }} Kelompok
        </span>
        <div class="flex items-center gap-3">
          <UButton color="neutral" size="md" icon="i-lucide-download" class="neo-hover" @click="exportCSV">
            Ekspor Data CSV
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
