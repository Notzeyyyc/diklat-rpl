<script setup lang="ts">
import type { TeamOverview } from '@diklat/shared'

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Tracking Pos - Admin Dashboard',
})

const { overview, liveEvents, refresh } = useOverview()

// Kelompok "sedang di" pos X = pos berikutnya yang belum dia selesaikan adalah X
const atPos = (posId: number): TeamOverview[] =>
  overview.value.teams.filter((t) => !t.completedPositions.includes(posId) && t.completedPositions.length === posId - 1)

const posData = computed(() =>
  [1, 2, 3, 4, 5].map(posId => ({
    id: `POS 0${posId}`,
    name: '',
    groups: atPos(posId).map(t => t.name),
    groupCount: atPos(posId).length,
    status: atPos(posId).length >= 3 ? 'busy' : 'active',
  })),
)

const teamsInField = computed(() => overview.value.teams.filter(t => t.completedPositions.length > 0 && t.completedPositions.length < 5).length)
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
          <UButton color="neutral" size="md" icon="i-lucide-refresh-cw" class="neo-hover" @click="refresh">
            Refresh
          </UButton>
        </div>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <StatCard label="Total Pos Aktif" value="5/5 (100%)" icon="i-lucide-map-pin" color="primary" />
      <StatCard label="Kelompok di Lapangan" :value="`${teamsInField} Kelompok`" subtext="Antara basecamp & finish" icon="i-lucide-users" color="secondary" />
      <StatCard label="Basecamp" :value="`${overview.stats.totalTeams - teamsInField - overview.stats.completedTeams} Kelompok`" subtext="Belum mulai" icon="i-lucide-check-circle" color="success" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
      <div
        v-for="pos in posData"
        :key="pos.id"
        class="neo-border-thick neo-shadow-lg bg-white rounded-xl overflow-hidden"
      >
        <div class="px-4 md:px-5 py-3 md:py-4 border-b-2 border-neo-ink flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <span class="font-mono text-xs font-bold neo-border rounded px-1.5 py-0.5 bg-neo-surface-container shrink-0">{{ pos.id }}</span>
            <StatusBadge :label="pos.status === 'busy' ? 'BUSY' : 'ACTIVE'" :status="pos.status === 'busy' ? 'busy' : 'active'" />
          </div>
          <span class="font-mono text-[10px] text-neo-on-surface-variant shrink-0">{{ pos.groupCount }} grp</span>
        </div>
        <div class="p-4 md:p-5">
          <p class="font-mono text-[10px] text-neo-on-surface-variant mb-3">Kelompok yang sedang mengerjakan pos ini</p>
          <div v-if="pos.groups.length" class="space-y-2">
            <div
              v-for="g in pos.groups"
              :key="g"
              class="flex items-center gap-2 text-sm md:text-xs font-display font-semibold min-w-0"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-neo-primary shrink-0" />
              <span class="truncate">{{ g }}</span>
            </div>
          </div>
          <p v-else class="font-mono text-[10px] text-neo-on-surface-variant uppercase">Kosong</p>
        </div>
      </div>
    </div>

    <NeoCard title="FEED LIVE" icon="i-lucide-clock" :badge="`${liveEvents.length} EVENTS`">
      <div class="overflow-x-auto">
        <p v-if="liveEvents.length === 0" class="font-mono text-[10px] text-neo-on-surface-variant uppercase px-4 py-3">
          Menunggu aktivitas realtime...
        </p>
        <table v-else class="w-full">
          <thead>
            <tr class="border-b-2 border-neo-ink">
              <th class="px-4 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-widest">Waktu</th>
              <th class="px-4 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-widest">Tipe</th>
              <th class="px-4 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-widest">Pos</th>
              <th class="px-4 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-widest">Aktivitas</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(e, i) in liveEvents"
              :key="`${e.at}-${i}`"
              class="border-b border-neo-outline-variant hover:bg-neo-surface-container transition-colors"
            >
              <td class="px-4 py-3 font-mono text-xs">{{ e.at.slice(11, 16) }}</td>
              <td class="px-4 py-3">
                <span class="font-mono text-[10px] neo-border rounded px-1.5 py-0.5 bg-neo-surface-container uppercase">{{ e.type }}</span>
              </td>
              <td class="px-4 py-3 font-display font-semibold text-sm">POS 0{{ e.positionId }}</td>
              <td class="px-4 py-3 font-body text-xs">
                {{ e.type === 'progress' ? `Regu menyelesaikan pos ini` : `Skor ${e.score} dicatat` }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </NeoCard>
  </div>
</template>
