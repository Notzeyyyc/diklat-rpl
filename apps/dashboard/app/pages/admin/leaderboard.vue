<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Leaderboard - Admin Dashboard',
})

const searchQuery = ref('')

const podium = [
  { rank: 2, name: 'BYTE RUNNER', score: 390, pos: '4/5', time: '11m 45s', color: 'bg-neo-primary text-white' },
  { rank: 1, name: 'CYBER EAGLE', score: 485, pos: '5/5 (100%)', time: '09m 10s avg', color: 'bg-neo-success text-neo-ink' },
  { rank: 3, name: 'NIGHT CODERS', score: 310, pos: '3/5', time: '13m 22s', color: 'bg-neo-surface-container-highest text-neo-ink' },
] as const

const podiumRank2 = podium[0]!
const podiumRank1 = podium[1]!
const podiumRank3 = podium[2]!

const leaderboard = ref([
  { rank: 1, name: 'Cyber Eagle', ketua: 'Andi Pratama', p1: 95, p2: 88, p3: 92, p4: 100, p5: 110, total: 485, time: '09:10', status: 'completed' },
  { rank: 2, name: 'Byte Runner', ketua: 'Rina Sari', p1: 82, p2: 95, p3: 78, p4: 85, p5: 50, total: 390, time: '11:45', status: 'completed' },
  { rank: 3, name: 'Night Coders', ketua: 'Dimas Putra', p1: 70, p2: 88, p3: 65, p4: 52, p5: 35, total: 310, time: '13:22', status: 'active' },
  { rank: 4, name: 'Algo Titans', ketua: 'Siti Nurhaliza', p1: 78, p2: 65, p3: 80, p4: 42, p5: 0, total: 265, time: '14:30', status: 'active' },
  { rank: 5, name: 'Data Guardians', ketua: 'Budi Santoso', p1: 65, p2: 72, p3: 55, p4: 38, p5: 20, total: 250, time: '12:15', status: 'active' },
  { rank: 6, name: 'Syntax Squad', ketua: 'Citra Dewi', p1: 60, p2: 58, p3: 45, p4: 40, p5: 30, total: 233, time: '15:00', status: 'active' },
  { rank: 7, name: 'Garuda', ketua: 'Rizki Ramadhan', p1: 55, p2: 50, p3: 48, p4: 35, p5: 25, total: 213, time: '13:45', status: 'active' },
  { rank: 8, name: 'Rajawali', ketua: 'Dewi Lestari', p1: 48, p2: 42, p3: 55, p4: 30, p5: 15, total: 190, time: '16:20', status: 'active' },
  { rank: 9, name: 'Nusantara', ketua: 'Ahmad Fauzi', p1: 42, p2: 38, p3: 40, p4: 28, p5: 10, total: 158, time: '14:50', status: 'active' },
  { rank: 10, name: 'Pixel Warriors', ketua: 'Luna Maya', p1: 35, p2: 30, p3: 32, p4: 22, p5: 8, total: 127, time: '17:10', status: 'standby' },
])

const posDistribution = [
  { label: 'POS 01', value: 82 },
  { label: 'POS 02', value: 78 },
  { label: 'POS 03', value: 64 },
  { label: 'POS 04', value: 88 },
  { label: 'POS 05', value: 45 },
]

const auditLogs = [
  { time: '14:32', pos: 'POS 5', message: 'KORLAP POS 5 memverifikasi checkpoint Bit Runners' },
  { time: '14:28', pos: 'POS 4', message: 'KORLAP POS 4 mengkonfirmasi selesai Byte Runner' },
  { time: '14:25', pos: 'POS 3', message: 'KORLAP POS 3 memulai sesi Nusantara' },
]

const filteredLeaderboard = computed(() => {
  if (!searchQuery.value) return leaderboard.value
  const q = searchQuery.value.toLowerCase()
  return leaderboard.value.filter(
    (t) => t.name.toLowerCase().includes(q) || t.ketua.toLowerCase().includes(q)
  )
})
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
          <UButton color="neutral" size="sm" icon="i-lucide-printer" class="neo-hover">Print</UButton>
          <UButton color="primary" size="sm" icon="i-lucide-download" class="neo-hover">Export CSV</UButton>
        </div>
      </template>
    </PageHeader>

    <!-- Podium 3 Besar -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
      <!-- Rank 2 -->
      <div class="lg:col-span-4 flex flex-col justify-between neo-border-thick neo-shadow-lg rounded-xl p-6 bg-neo-primary text-white relative overflow-hidden neo-hover">
        <div class="absolute -right-6 -bottom-6 text-white/10 font-display text-[130px] font-bold select-none leading-none pointer-events-none">2</div>
        <div class="flex items-start justify-between gap-2 relative z-10">
          <span class="px-3 py-1 bg-white text-neo-primary neo-border rounded font-mono text-[10px] font-bold uppercase tracking-wider">Rank 2</span>
          <span class="px-2.5 py-0.5 bg-neo-tertiary-container text-neo-ink neo-border rounded font-mono text-[10px] font-bold uppercase">Pos 4/5</span>
        </div>
        <div class="my-6 relative z-10">
          <div class="font-mono text-[10px] text-white/60 uppercase tracking-wider">TIM-04 // RPL-A</div>
          <h2 class="font-display font-bold text-xl uppercase mt-1">{{ podiumRank2.name }}</h2>
        </div>
        <div class="pt-4 border-t-2 border-white/30 flex items-end justify-between relative z-10">
          <div>
            <span class="font-mono text-[10px] uppercase tracking-wider text-white/60">Total Poin</span>
            <div class="font-display font-bold text-3xl leading-none mt-1">{{ podiumRank2.score }} <span class="text-sm font-normal text-white/60">pts</span></div>
          </div>
          <div class="text-right">
            <span class="font-mono text-[10px] text-white/60 block">Waktu</span>
            <span class="font-mono text-xs font-bold">{{ podiumRank2.time }}</span>
          </div>
        </div>
      </div>

      <!-- Rank 1 -->
      <div class="lg:col-span-4 flex flex-col justify-between neo-border-thick neo-shadow-xl rounded-xl p-7 bg-neo-success text-neo-ink relative lg:-translate-y-4 neo-hover">
        <div class="absolute -right-6 -bottom-6 text-neo-ink/10 font-display text-[160px] font-bold select-none leading-none pointer-events-none">1</div>
        <div class="flex items-start justify-between gap-2 relative z-10">
          <span class="px-3.5 py-1.5 bg-neo-tertiary-container neo-border-thick rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span class="text-sm">Crown</span> JUARA 1 SEMENTARA
          </span>
          <span class="px-3 py-1 bg-white neo-border rounded font-mono text-[10px] font-bold uppercase tracking-wider text-neo-success">
            LULUS SEMUA POS
          </span>
        </div>
        <div class="my-6 relative z-10">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 bg-neo-ink text-white font-mono text-[10px] font-bold uppercase rounded">TIM-01</span>
            <span class="font-mono text-[10px] text-neo-ink/60 font-bold uppercase tracking-wider">Kontingen Unggulan</span>
          </div>
          <h2 class="font-display font-bold text-3xl uppercase mt-2 tracking-tight">{{ podiumRank1.name }}</h2>
        </div>
        <div class="bg-white/80 neo-border-thick p-5 rounded-lg neo-shadow-sm flex items-center justify-between relative z-10">
          <div>
            <span class="font-mono text-[10px] uppercase tracking-wider text-neo-on-surface-variant font-bold">Total Akumulasi</span>
            <div class="font-display font-bold text-3xl text-neo-ink leading-none mt-1">{{ podiumRank1.score }} <span class="text-sm font-bold text-neo-primary">PTS</span></div>
          </div>
          <div class="text-right border-l-2 border-neo-ink pl-5">
            <span class="font-mono text-[10px] uppercase tracking-wider text-neo-on-surface-variant font-bold">Progres Pos</span>
            <div class="font-display font-bold text-lg text-neo-ink mt-1">{{ podiumRank1.pos }}</div>
            <span class="font-mono text-[10px] text-neo-success font-bold uppercase mt-1 block">5/5 POS SELESAI (100%)</span>
          </div>
        </div>
      </div>

      <!-- Rank 3 -->
      <div class="lg:col-span-4 flex flex-col justify-between neo-border-thick neo-shadow-lg rounded-xl p-6 bg-white text-neo-ink relative overflow-hidden neo-hover">
        <div class="absolute -right-6 -bottom-6 text-neo-outline-variant/30 font-display text-[130px] font-bold select-none leading-none pointer-events-none">3</div>
        <div class="flex items-start justify-between gap-2 relative z-10">
          <span class="px-3 py-1 bg-neo-surface-container-highest neo-border rounded font-mono text-[10px] font-bold uppercase tracking-wider">Rank 3</span>
          <span class="px-2.5 py-0.5 bg-neo-warning text-neo-ink neo-border rounded font-mono text-[10px] font-bold uppercase">Pos 3/5</span>
        </div>
        <div class="my-6 relative z-10">
          <div class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-wider">TIM-07 // RPL-C</div>
          <h2 class="font-display font-bold text-xl uppercase mt-1">{{ podiumRank3.name }}</h2>
        </div>
        <div class="pt-4 border-t-2 border-neo-ink flex items-end justify-between relative z-10">
          <div>
            <span class="font-mono text-[10px] uppercase tracking-wider text-neo-on-surface-variant font-bold">Total Poin</span>
            <div class="font-display font-bold text-3xl leading-none mt-1">{{ podiumRank3.score }} <span class="text-sm font-normal text-neo-on-surface-variant">pts</span></div>
          </div>
          <div class="text-right">
            <span class="font-mono text-[10px] text-neo-on-surface-variant font-bold block">Waktu</span>
            <span class="font-mono text-xs font-bold">{{ podiumRank3.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Metric Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard label="Rata-rata Skor Tim" value="232.4 PTS" icon="i-lucide-bar-chart-3" color="primary" />
      <StatCard label="Tim Lulus Sempurna" value="1 / 15" icon="i-lucide-trophy" color="success" />
      <StatCard label="Sedang di Lapangan" value="6 Kelompok" icon="i-lucide-activity" color="secondary" />
      <StatCard label="Antrian Checkpoint" value="8 Belum Mulai" icon="i-lucide-clock" color="warning" />
    </div>

    <!-- Tabel Lengkap -->
    <NeoCard title="KLASEMEN LENGKAP" icon="i-lucide-list" badge="15 KELOMPOK">
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
              <th class="px-4 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-widest">Waktu Tempuh</th>
              <th class="px-4 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="t in filteredLeaderboard"
              :key="t.rank"
              class="border-b border-neo-outline-variant hover:bg-neo-surface-container transition-colors"
            >
              <td class="px-4 py-4 text-center">
                <span
                  class="inline-flex items-center justify-center w-8 h-8 rounded-full neo-border neo-shadow-sm font-mono text-xs font-bold"
                  :class="t.rank === 1 ? 'bg-neo-success text-neo-ink' : t.rank === 2 ? 'bg-neo-primary-container text-white' : t.rank === 3 ? 'bg-neo-surface-container-highest' : 'bg-white'"
                >
                  #{{ t.rank }}
                </span>
              </td>
              <td class="px-4 py-4">
                <div class="font-display font-semibold text-sm uppercase flex items-center gap-2">
                  {{ t.name }}
                  <span class="px-1.5 py-0.5 bg-neo-surface-container neo-border rounded font-mono text-[9px]">TIM-{{ t.rank }}</span>
                </div>
                <div class="font-mono text-[10px] text-neo-on-surface-variant mt-0.5">Ketua: {{ t.ketua }}</div>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center justify-center gap-1.5 font-mono text-[10px]">
                  <span class="px-2 py-1 bg-neo-surface-container-high neo-border rounded font-bold" :class="t.p1 > 0 ? '' : 'opacity-40'">P1: {{ t.p1 }}</span>
                  <span class="px-2 py-1 bg-neo-surface-container-high neo-border rounded font-bold" :class="t.p2 > 0 ? '' : 'opacity-40'">P2: {{ t.p2 }}</span>
                  <span class="px-2 py-1 bg-neo-surface-container-high neo-border rounded font-bold" :class="t.p3 > 0 ? '' : 'opacity-40'">P3: {{ t.p3 }}</span>
                  <span class="px-2 py-1 bg-neo-surface-container-high neo-border rounded font-bold" :class="t.p4 > 0 ? '' : 'opacity-40'">P4: {{ t.p4 }}</span>
                  <span class="px-2 py-1 bg-neo-surface-container-low neo-border rounded font-bold" :class="t.p5 > 0 ? 'bg-neo-success/20' : 'opacity-40'">P5: {{ t.p5 }}</span>
                </div>
              </td>
              <td class="px-4 py-4 text-right">
                <span class="font-display font-bold text-lg leading-none">{{ t.total }}</span>
                <span class="font-mono text-[10px] text-neo-on-surface-variant block">PTS</span>
              </td>
              <td class="px-4 py-4 text-center font-mono text-xs font-bold">{{ t.time }}</td>
              <td class="px-4 py-4 text-center">
                <StatusBadge
                  :label="t.status"
                  :status="t.status === 'completed' ? 'completed' : t.status === 'active' ? 'active' : 'standby'"
                />
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

      <NeoCard title="AUDIT FEED" icon="i-lucide-activity">
        <div class="space-y-4">
          <div
            v-for="(log, i) in auditLogs"
            :key="i"
            class="flex items-start gap-3 pb-4 border-b border-neo-outline-variant last:border-0 last:pb-0"
          >
            <span class="font-mono text-[10px] text-neo-on-surface-variant shrink-0 mt-0.5">{{ log.time }}</span>
            <div>
              <span class="font-mono text-[10px] neo-border rounded px-1.5 py-0.5 bg-neo-surface-container">{{ log.pos }}</span>
              <p class="font-body text-xs mt-1.5">{{ log.message }}</p>
            </div>
          </div>
        </div>
      </NeoCard>
    </div>
  </div>
</template>
