<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Tracking Murid - Admin Dashboard',
})

const searchQuery = ref('')
const posFilter = ref<{ label: string; value: string }>({ label: 'ALL', value: 'all' })
const statusFilter = ref<{ label: string; value: string }>({ label: 'ALL', value: 'all' })

const teams = ref([
  { name: 'Garuda', level: 2, multiplier: 'x4', pos: 'POS-03', status: 'active' },
  { name: 'Rajawali', level: 1, multiplier: 'x2', pos: 'POS-01', status: 'answering' },
  { name: 'Nusantara', level: 3, multiplier: 'x8', pos: 'POS-03', status: 'active' },
  { name: 'Cyber Eagle', level: 2, multiplier: 'x4', pos: 'POS-05', status: 'completed' },
  { name: 'Pixel Warriors', level: 1, multiplier: 'x2', pos: 'BASECAMP', status: 'standby' },
  { name: 'Algo Titans', level: 3, multiplier: 'x8', pos: 'POS-02', status: 'answering' },
  { name: 'Byte Runner', level: 2, multiplier: 'x4', pos: 'POS-04', status: 'active' },
  { name: 'Data Guardians', level: 2, multiplier: 'x4', pos: 'POS-03', status: 'completed' },
  { name: 'Syntax Squad', level: 1, multiplier: 'x2', pos: 'POS-01', status: 'answering' },
  { name: 'Bit Runners', level: 3, multiplier: 'x8', pos: 'BASECAMP', status: 'standby' },
])

const posOptions = [
  { label: 'ALL', value: 'all' },
  { label: 'POS-01', value: 'POS-01' },
  { label: 'POS-02', value: 'POS-02' },
  { label: 'POS-03', value: 'POS-03' },
  { label: 'POS-04', value: 'POS-04' },
  { label: 'POS-05', value: 'POS-05' },
  { label: 'BASECAMP', value: 'BASECAMP' },
]

const statusOptions = [
  { label: 'ALL', value: 'all' },
  { label: 'Answering', value: 'answering' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Standby', value: 'standby' },
]

const statusBadgeMap: Record<string, 'success' | 'warning' | 'active' | 'standby' | 'pending' | 'completed' | 'busy' | 'info' | 'danger'> = {
  answering: 'warning',
  active: 'active',
  completed: 'completed',
  standby: 'standby',
}

const filteredTeams = computed(() => {
  return teams.value.filter((t) => {
    const matchSearch = !searchQuery.value || t.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchPos = posFilter.value.value === 'all' || t.pos === posFilter.value.value
    const matchStatus = statusFilter.value.value === 'all' || t.status === statusFilter.value.value
    return matchSearch && matchPos && matchStatus
  })
})

function callGroup(name: string) {
  useToast().add({
    title: `Memanggil ${name}`,
    description: `Sedang mengirim sinyal panggilan ke ${name}...`,
    color: 'primary',
  })
}

function exportCSV() {
  const headers = ['Nama Kelompok', 'Level', 'Multiplier', 'Pos Saat Ini', 'Status']
  const rows = filteredTeams.value.map((t) => [t.name, t.level, t.multiplier, t.pos, t.status])
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
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
          <UButton color="neutral" size="sm" icon="i-lucide-refresh-cw" class="neo-hover" @click="() => {}">
            Refresh Data
          </UButton>
        </div>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <StatCard label="Total Registered" value="15 Tim" subtext="100% Peserta siap berpartisipasi" icon="i-lucide-users" color="primary" />
      <StatCard label="Sedang Aktif di Pos" value="8 Tim" subtext="Tersebar di Pos 01 s/d Pos 05" icon="i-lucide-activity" color="success" />
      <StatCard label="Selesai Semua Pos" value="5 Tim" subtext="Memenuhi standar evaluasi" icon="i-lucide-check-circle" color="secondary" />
      <StatCard label="Standby / Basecamp" value="2 Tim" subtext="Menunggu giliran routing" icon="i-lucide-pause-circle" color="warning" />
    </div>

    <NeoCard>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div class="md:col-span-6 relative">
          <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neo-on-surface-variant" />
          <UInput
            v-model="searchQuery"
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
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Level</th>
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Multiplier</th>
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Pos Saat Ini</th>
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Status</th>
              <th class="px-5 py-4 text-right font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Aksi</th>
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
                    {{ teams.indexOf(team) + 1 }}
                  </div>
                  <div>
                    <span class="font-display font-semibold text-sm block">{{ team.name }}</span>
                    <span class="font-mono text-[10px] text-neo-on-surface-variant">ID: TIM-{{ team.name.slice(0, 3).toUpperCase() }}-26</span>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4">
                <span class="font-mono text-xs neo-border rounded px-2 py-0.5 bg-neo-primary-container/10 font-bold">Level {{ team.level }}</span>
              </td>
              <td class="px-5 py-4">
                <span class="font-mono text-xs font-bold neo-border rounded px-2 py-0.5 bg-neo-tertiary-container/10">{{ team.multiplier }}</span>
              </td>
              <td class="px-5 py-4 font-display font-semibold text-sm">{{ team.pos }}</td>
              <td class="px-5 py-4">
                <StatusBadge :label="team.status" :status="statusBadgeMap[team.status] || 'active'" />
              </td>
              <td class="px-5 py-4 text-right">
                <UButton
                  color="neutral"
                  size="sm"
                  icon="i-lucide-bell"
                  class="neo-hover"
                  @click="callGroup(team.name)"
                >
                  Panggil
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="border-t-2 border-neo-ink px-5 py-4 flex items-center justify-between bg-neo-surface-container">
        <span class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest">
          Menampilkan {{ filteredTeams.length }} dari {{ teams.length }} Kelompok
        </span>
        <div class="flex items-center gap-3">
          <UButton color="neutral" size="sm" icon="i-lucide-download" class="neo-hover" @click="exportCSV">
            Ekspor Data CSV
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
