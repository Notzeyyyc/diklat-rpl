<script setup lang="ts">
definePageMeta({
  layout: 'ketua',
})

useHead({
  title: 'Panel Operasional - Ketua Post',
})

const activeGroup = ref({
  name: 'Kelompok Garuda',
  level: 2,
  multiplier: 'x4',
  status: 'Sedang Menjawab Soal & Praktik',
  startTime: '14:20',
  elapsed: '12m 35s',
})

const standbyQueue = ref([
  { name: 'Kelompok Rajawali', level: 1, multiplier: 'x2', waiting: '8m 12s' },
  { name: 'Kelompok Nusantara', level: 3, multiplier: 'x8', waiting: '5m 45s' },
  { name: 'Kelompok Code Hunters', level: 2, multiplier: 'x4', waiting: '3m 20s' },
])

const staff = ref([
  { name: 'Budi Santoso', role: 'Operator Timer', active: true },
  { name: 'Citra Dewi', role: 'Verifikator Alat', active: true },
  { name: 'Dimas Pratama', role: 'PIC Scanner QR', active: true },
])

const recentActivity = ref([
  { time: '14:32', action: 'Checkpoint verified', group: 'ByteForce', icon: 'i-lucide-check-circle' },
  { time: '14:28', action: 'Session started', group: 'Garuda', icon: 'i-lucide-play' },
  { time: '14:25', action: 'Score submitted', group: 'Logic Squad', icon: 'i-lucide-send' },
  { time: '14:20', action: 'Queue updated', group: 'Rajawali', icon: 'i-lucide-refresh-cw' },
])

const stats = ref<{ label: string, value: string | number, icon: string, color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' }[]>([
  { label: 'Groups Completed', value: '3', icon: 'i-lucide-check-circle', color: 'success' },
  { label: 'Currently Active', value: '1', icon: 'i-lucide-activity', color: 'primary' },
  { label: 'In Queue', value: '3', icon: 'i-lucide-clock', color: 'warning' },
  { label: 'Avg Time', value: '11m', icon: 'i-lucide-timer', color: 'secondary' },
])

function callNextGroup() {
  if (standbyQueue.value.length > 0) {
    const next = standbyQueue.value.shift()
    if (next) {
      activeGroup.value = {
        name: next.name,
        level: next.level,
        multiplier: next.multiplier,
        status: 'Memulai sesi evaluasi',
        startTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        elapsed: '0m 0s',
      }
      useToast().add({
        title: `Memanggil ${next.name}`,
        description: 'Kelompok berikutnya dipanggil ke pos evaluasi.',
        color: 'primary',
      })
    }
  }
}

function submitScore() {
  useToast().add({
    title: 'Skor berhasil dikirim',
    description: `Skor untuk ${activeGroup.value.name} telah terkirim.`,
    color: 'success',
  })
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      badge="POS OPERASIONAL"
      badge-color="primary"
      title="PANEL OPERASIONAL TERPADU"
      description="Kelola alur peserta dan pantau aktivitas pos evaluasi"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <StatCard
        v-for="stat in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :icon="stat.icon"
        :color="stat.color"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <!-- Active Group -->
      <NeoCard title="GILIRAN AKTIF" icon="i-lucide-users" badge="1 AKTIF">
        <div class="neo-border-thick neo-shadow-lg rounded-xl p-5 bg-neo-primary-container text-white mb-5">
          <div class="flex items-center gap-2 mb-2">
            <StatusBadge label="SEDANG AKTIF" status="active" />
            <span class="font-mono text-[10px] opacity-75">LEVEL {{ activeGroup.level }}</span>
            <span class="font-mono text-[10px] font-bold">{{ activeGroup.multiplier }}</span>
          </div>
          <div class="font-display font-bold text-lg">{{ activeGroup.name }}</div>
          <div class="font-mono text-[10px] opacity-75 mt-1">{{ activeGroup.status }}</div>
          <div class="flex items-center gap-4 mt-3 font-mono text-[10px]">
            <span>Mulai: {{ activeGroup.startTime }}</span>
            <span>Elapsed: {{ activeGroup.elapsed }}</span>
          </div>
        </div>

        <div class="flex gap-3">
          <UButton color="success" size="sm" icon="i-lucide-check-circle" class="flex-1 neo-hover" @click="submitScore">
            Submit Skor
          </UButton>
          <UButton color="warning" size="sm" icon="i-lucide-alert-triangle" class="flex-1 neo-hover">
            Tandai Masalah
          </UButton>
        </div>

        <template #footer>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-radio" class="w-4 h-4 text-neo-on-surface-variant" />
            <span class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest">Emergency Channel HT 04</span>
          </div>
        </template>
      </NeoCard>

      <!-- Standby Queue -->
      <NeoCard title="ANTRIAN STANDBY" icon="i-lucide-list" badge="3 ANTRE">
        <div class="space-y-3">
          <div
            v-for="(g, i) in standbyQueue"
            :key="g.name"
            class="flex items-center gap-3 px-4 py-3 neo-border rounded-xl bg-white"
          >
            <span class="w-7 h-7 rounded-lg bg-neo-surface-container-highest flex items-center justify-center font-mono text-[10px] font-bold neo-border">
              {{ i + 1 }}
            </span>
            <div class="flex-1 min-w-0">
              <div class="font-display font-semibold text-sm">{{ g.name }}</div>
              <div class="font-mono text-[10px] text-neo-on-surface-variant">Menunggu {{ g.waiting }}</div>
            </div>
            <span class="font-mono text-[10px]">L{{ g.level }}</span>
            <span class="font-mono text-[10px] font-bold">{{ g.multiplier }}</span>
          </div>
        </div>

        <template #footer>
          <UButton
            color="primary"
            size="sm"
            icon="i-lucide-arrow-right"
            block
            class="neo-hover"
            :disabled="standbyQueue.length === 0"
            @click="callNextGroup"
          >
            Panggil Grup Berikutnya
          </UButton>
        </template>
      </NeoCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <!-- Staff Info -->
      <NeoCard title="PANITIA PENGAWAS" icon="i-lucide-shield" badge="4 Petugas">
        <div class="space-y-4">
          <div class="flex items-center gap-3 p-4 neo-border rounded-xl bg-neo-surface-container">
            <UAvatar size="lg" alt="Siti Rahma" class="neo-border neo-shadow-sm" />
            <div class="flex-1 min-w-0">
              <div class="font-display font-bold text-sm">Siti Rahma</div>
              <div class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest">Ketua Post Lapangan</div>
            </div>
            <StatusBadge label="Aktif di Pos" status="active" />
          </div>

          <div class="space-y-3">
            <div
              v-for="s in staff"
              :key="s.name"
              class="flex items-center gap-3 px-4 py-3 neo-border rounded-xl bg-white"
            >
              <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-neo-success shrink-0" />
              <div class="flex-1 min-w-0">
                <div class="font-display font-semibold text-sm">{{ s.name }}</div>
                <div class="font-mono text-[10px] text-neo-on-surface-variant">{{ s.role }}</div>
              </div>
              <StatusBadge :label="s.active ? 'Online' : 'Offline'" :status="s.active ? 'active' : 'standby'" />
            </div>
          </div>
        </div>
      </NeoCard>

      <!-- Recent Activity -->
      <NeoCard title="AKTIVITAS TERBARU" icon="i-lucide-clock" badge="4 EVENTS">
        <div class="space-y-4">
          <div
            v-for="(log, i) in recentActivity"
            :key="i"
            class="flex items-start gap-3 pb-4 border-b border-neo-outline-variant last:border-0 last:pb-0"
          >
            <span class="font-mono text-[10px] text-neo-on-surface-variant shrink-0 mt-0.5">{{ log.time }}</span>
            <UIcon :name="log.icon" class="w-4 h-4 text-neo-primary shrink-0 mt-0.5" />
            <div>
              <p class="font-body text-xs">{{ log.action }}</p>
              <span class="font-mono text-[10px] text-neo-on-surface-variant">{{ log.group }}</span>
            </div>
          </div>
        </div>
      </NeoCard>
    </div>
  </div>
</template>
