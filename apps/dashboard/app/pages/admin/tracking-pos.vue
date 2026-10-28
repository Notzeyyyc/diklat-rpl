<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Tracking Pos - Admin Dashboard',
})

const posData = [
  {
    id: 'POS 01',
    name: 'Logika Dasar & Algoritma',
    status: 'active',
    groupCount: 2,
    groups: ['Garuda', 'Nusantara'],
    description: 'Pemahaman logika program dan algoritma dasar',
  },
  {
    id: 'POS 02',
    name: 'Adrenalin & Jaringan Kabel',
    status: 'active',
    groupCount: 1,
    groups: ['Syntax Error'],
    description: 'Konfigurasi jaringan kabel UTP dan troubleshooting',
  },
  {
    id: 'POS 03',
    name: 'Hardware & Troubleshooting',
    status: 'busy',
    groupCount: 3,
    groups: ['ByteForce', 'Logic', 'Pixel'],
    description: 'Diagnosa dan perbaikan hardware komputer',
  },
  {
    id: 'POS 04',
    name: 'Kecepatan Ketik & Debugging',
    status: 'active',
    groupCount: 1,
    groups: ['CyberKnights'],
    description: 'Typing speed test dan debugging kode',
  },
  {
    id: 'POS 05',
    name: 'Final System Integration',
    status: 'active',
    groupCount: 1,
    groups: ['StackOverlords'],
    description: 'Integrasi sistem akhir dan testing menyeluruh',
  },
]

const activityLog = [
  { time: '14:32', pos: 'POS 03', group: 'ByteForce', activity: 'Memulai sesi evaluasi hardware', status: 'active' },
  { time: '14:28', pos: 'POS 01', group: 'Garuda', activity: 'Mengirim jawaban soal logika', status: 'pending' },
  { time: '14:25', pos: 'POS 04', group: 'CyberKnights', activity: 'Menyelesaikan debugging level 2', status: 'completed' },
  { time: '14:20', pos: 'POS 02', group: 'Syntax Error', activity: 'Memulai konfigurasi jaringan', status: 'active' },
  { time: '14:15', pos: 'POS 05', group: 'StackOverlords', activity: 'Menunggu giliran integrasi', status: 'standby' },
]

function getStatusBadge(status: string): { label: string; status: 'success' | 'warning' | 'active' | 'standby' | 'busy' | 'completed' | 'pending' | 'info' | 'danger' } {
  const map: Record<string, { label: string; status: 'success' | 'warning' | 'active' | 'standby' | 'busy' | 'completed' | 'pending' | 'info' | 'danger' }> = {
    active: { label: 'ACTIVE', status: 'active' },
    busy: { label: 'BUSY', status: 'busy' },
    completed: { label: 'COMPLETED', status: 'completed' },
    pending: { label: 'PENDING', status: 'pending' },
    standby: { label: 'STANDBY', status: 'standby' },
  }
  return map[status] || { label: status.toUpperCase(), status: 'active' }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      badge="MONITORING ENGINE // DIKLAT 2026"
      badge-color="primary"
      title="TRACKING POS // PEMANTAUAN TIAP POS"
      description="Pantau status operasional setiap pos evaluasi secara real-time"
    >
      <template #actions>
        <div class="flex items-center gap-3">
          <span class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-neo-success opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-neo-success"></span>
            </span>
            LIVE
          </span>
          <UButton color="neutral" size="sm" icon="i-lucide-refresh-cw" class="neo-hover" @click="() => {}">
            Refresh
          </UButton>
        </div>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <StatCard label="Total Pos Aktif" value="5/5 (100%)" icon="i-lucide-map-pin" color="primary" />
      <StatCard label="Kelompok di Pos" value="8 Kelompok" subtext="48 Peserta" icon="i-lucide-users" color="secondary" />
      <StatCard label="Status Jalur" value="Terkendali" subtext="Zero Bottleneck" icon="i-lucide-check-circle" color="success" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div
        v-for="pos in posData"
        :key="pos.id"
        class="neo-border-thick neo-shadow-lg bg-white rounded-xl overflow-hidden"
      >
        <div class="px-5 py-4 border-b-2 border-neo-ink flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-bold neo-border rounded px-1.5 py-0.5 bg-neo-surface-container">{{ pos.id }}</span>
            <StatusBadge :label="pos.status === 'busy' ? 'BUSY' : 'ACTIVE'" :status="pos.status === 'busy' ? 'busy' : 'active'" />
          </div>
          <span class="font-mono text-[10px] text-neo-on-surface-variant">{{ pos.groupCount }} grp</span>
        </div>
        <div class="p-5">
          <h3 class="font-display font-bold text-sm mb-1">{{ pos.name }}</h3>
          <p class="font-mono text-[10px] text-neo-on-surface-variant mb-3">{{ pos.description }}</p>
          <div class="space-y-2">
            <div
              v-for="g in pos.groups"
              :key="g"
              class="flex items-center gap-2 text-xs font-display font-semibold"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-neo-primary shrink-0" />
              {{ g }}
            </div>
          </div>
        </div>
        <div class="border-t-2 border-neo-ink px-5 py-3">
          <UButton color="primary" size="sm" variant="ghost" icon="i-lucide-arrow-right" block class="neo-hover">
            Lihat di Pos Hub
          </UButton>
        </div>
      </div>
    </div>

    <NeoCard title="ACTIVITY LOG" icon="i-lucide-clock" badge="5 EVENTS">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-neo-ink">
              <th class="px-4 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-widest">Waktu</th>
              <th class="px-4 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-widest">Pos</th>
              <th class="px-4 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-widest">Kelompok</th>
              <th class="px-4 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-widest">Aktivitas</th>
              <th class="px-4 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(log, i) in activityLog"
              :key="i"
              class="border-b border-neo-outline-variant hover:bg-neo-surface-container transition-colors"
            >
              <td class="px-4 py-3 font-mono text-xs">{{ log.time }}</td>
              <td class="px-4 py-3">
                <span class="font-mono text-[10px] neo-border rounded px-1.5 py-0.5 bg-neo-surface-container">{{ log.pos }}</span>
              </td>
              <td class="px-4 py-3 font-display font-semibold text-sm">{{ log.group }}</td>
              <td class="px-4 py-3 font-body text-xs">{{ log.activity }}</td>
              <td class="px-4 py-3">
                <StatusBadge :label="log.status" :status="getStatusBadge(log.status).status" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </NeoCard>
  </div>
</template>
