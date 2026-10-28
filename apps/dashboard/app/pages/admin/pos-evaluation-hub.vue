<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Pos Evaluation Hub - Admin Dashboard',
})

const activePos = ref('POS-03')

const staff = [
  { name: 'Budi Santoso', role: 'Operator Timer', active: true },
  { name: 'Citra Dewi', role: 'Verifikator Alat', active: true },
  { name: 'Dimas Pratama', role: 'PIC Scanner QR', active: true },
]

const activeGroup = {
  name: 'Kelompok Garuda',
  level: 2,
  multiplier: 'x4',
  status: 'Sedang Menjawab Soal & Praktik',
}

const standbyQueue = [
  { name: 'Kelompok Rajawali', level: 1, multiplier: 'x2' },
  { name: 'Kelompok Nusantara', level: 3, multiplier: 'x8' },
  { name: 'Kelompok Code Hunters', level: 2, multiplier: 'x4' },
]
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      badge="MONITORING RUANG EVALUASI"
      badge-color="primary"
      title="POST EVALUATION HUB"
      description="Pantau status operasional setiap pos evaluasi"
    />

    <div class="flex gap-3 overflow-x-auto pb-2">
      <UButton
        v-for="i in 5"
        :key="i"
        :color="activePos === `POS-0${i}` ? 'primary' : 'neutral'"
        size="sm"
        :class="activePos !== `POS-0${i}` ? 'neo-border neo-shadow-sm' : 'neo-border-thick neo-shadow-md'"
        @click="activePos = `POS-0${i}`"
      >
        POS 0{{ i }}
      </UButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
      <div class="md:col-span-5 space-y-5">
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
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-radio" class="w-4 h-4 text-neo-on-surface-variant" />
              <span class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest">Emergency Channel HT 04</span>
            </div>
          </template>
        </NeoCard>
      </div>

      <div class="md:col-span-7 space-y-5">
        <NeoCard title="STATUS GILIRAN PESERTA" icon="i-lucide-users" badge="1 Aktif - 3 Antre">
          <div class="space-y-4">
            <div class="neo-border-thick neo-shadow-lg rounded-xl p-5 bg-neo-primary-container text-white">
              <div class="flex items-center gap-2 mb-2">
                <StatusBadge label="SEDANG AKTIF" status="active" />
                <span class="font-mono text-[10px] opacity-75">LEVEL {{ activeGroup.level }}</span>
                <span class="font-mono text-[10px] font-bold">{{ activeGroup.multiplier }}</span>
              </div>
              <div class="font-display font-bold text-lg">{{ activeGroup.name }}</div>
              <div class="font-mono text-[10px] opacity-75 mt-1">{{ activeGroup.status }}</div>
            </div>

            <div>
              <p class="font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant mb-3">
                STANDBY QUEUE
              </p>
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
                  </div>
                  <span class="font-mono text-[10px]">L{{ g.level }}</span>
                  <span class="font-mono text-[10px] font-bold">{{ g.multiplier }}</span>
                </div>
              </div>
            </div>
          </div>
        </NeoCard>
      </div>
    </div>
  </div>
</template>
