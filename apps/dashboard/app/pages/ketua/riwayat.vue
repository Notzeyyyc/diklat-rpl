<script setup lang="ts">
definePageMeta({
  layout: 'ketua',
})

useHead({
  title: 'Riwayat Penilaian - Ketua Post',
})

const searchQuery = ref('')
const statusFilter = ref<{ label: string; value: string }>({ label: 'ALL', value: 'all' })

const history = ref([
  { time: '14:32', group: 'ByteForce', level: 2, multiplier: 'x4', score: 85, status: 'completed', notes: 'Praktik hardware selesai' },
  { time: '14:15', group: 'Logic Squad', level: 1, multiplier: 'x2', score: 72, status: 'completed', notes: 'Soal logika dasar' },
  { time: '13:58', group: 'Pixel Warriors', level: 3, multiplier: 'x8', score: 91, status: 'completed', notes: 'Integrasi sistem sukses' },
  { time: '13:40', group: 'Cyber Eagle', level: 2, multiplier: 'x4', score: 88, status: 'completed', notes: 'Debugging selesai' },
  { time: '13:22', group: 'Byte Runner', level: 1, multiplier: 'x2', score: 65, status: 'completed', notes: 'Ketik speed test' },
  { time: '13:05', group: 'Nusantara', level: 3, multiplier: 'x8', score: 78, status: 'completed', notes: 'Jaringan kabel UTP' },
  { time: '12:48', group: 'Garuda', level: 2, multiplier: 'x4', score: 0, status: 'pending', notes: 'Menunggu verifikasi' },
  { time: '12:30', group: 'Rajawali', level: 1, multiplier: 'x2', score: 0, status: 'active', notes: 'Sedang mengerjakan' },
])

const statusOptions = [
  { label: 'ALL', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
]

const filteredHistory = computed(() => {
  return history.value.filter((h) => {
    const matchSearch = !searchQuery.value || h.group.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = statusFilter.value.value === 'all' || h.status === statusFilter.value.value
    return matchSearch && matchStatus
  })
})

const totalScore = computed(() => {
  return filteredHistory.value.reduce((sum, h) => sum + h.score, 0)
})

const avgScore = computed(() => {
  const completed = filteredHistory.value.filter(h => h.status === 'completed')
  if (completed.length === 0) return 0
  return Math.round(completed.reduce((sum, h) => sum + h.score, 0) / completed.length)
})

function exportCSV() {
  const headers = ['Waktu', 'Kelompok', 'Level', 'Multiplier', 'Skor', 'Status', 'Catatan']
  const rows = filteredHistory.value.map((h) => [h.time, h.group, h.level, h.multiplier, h.score, h.status, h.notes])
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
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
      description="Lihat semua catatan penilaian yang telah dilakukan di pos ini"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <StatCard label="Total Penilaian" :value="`${filteredHistory.length} Kelompok`" icon="i-lucide-clipboard-list" color="primary" />
      <StatCard label="Rata-rata Skor" :value="`${avgScore} PTS`" icon="i-lucide-bar-chart" color="secondary" />
      <StatCard label="Total Poin" :value="`${totalScore} PTS`" icon="i-lucide-trophy" color="warning" />
      <StatCard label="Selesai Hari Ini" value="6 Grup" icon="i-lucide-check-circle" color="success" />
    </div>

    <NeoCard>
      <div class="flex flex-wrap items-center gap-4">
        <UInput
          v-model="searchQuery"
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
          <UButton color="neutral" size="sm" icon="i-lucide-download" class="neo-hover" @click="exportCSV">
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
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Level</th>
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Multiplier</th>
              <th class="px-5 py-4 text-center font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Skor</th>
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Status</th>
              <th class="px-5 py-4 text-left font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Catatan</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(h, i) in filteredHistory"
              :key="i"
              class="border-b border-neo-outline-variant hover:bg-neo-surface-container transition-colors"
            >
              <td class="px-5 py-4 font-mono text-xs">{{ h.time }}</td>
              <td class="px-5 py-4 font-display font-semibold text-sm">{{ h.group }}</td>
              <td class="px-5 py-4 font-mono text-xs">Level {{ h.level }}</td>
              <td class="px-5 py-4 font-mono text-xs font-bold">{{ h.multiplier }}</td>
              <td class="px-5 py-4 text-center">
                <span
                  class="font-mono text-xs font-bold px-2.5 py-1 neo-border rounded-md"
                  :class="h.score >= 80 ? 'bg-neo-success text-neo-ink' : h.score >= 60 ? 'bg-neo-warning text-neo-ink' : h.score > 0 ? 'bg-neo-danger text-white' : 'bg-neo-surface-container-highest text-neo-on-surface-variant'"
                >
                  {{ h.score > 0 ? h.score : '-' }}
                </span>
              </td>
              <td class="px-5 py-4">
                <StatusBadge
                  :label="h.status"
                  :status="h.status === 'completed' ? 'completed' : h.status === 'active' ? 'active' : 'pending'"
                />
              </td>
              <td class="px-5 py-4 font-body text-xs text-neo-on-surface-variant">{{ h.notes }}</td>
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
