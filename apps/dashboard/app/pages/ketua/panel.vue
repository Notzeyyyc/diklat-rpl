<script setup lang="ts">
import type { TeamOverview } from '@diklat/shared'

definePageMeta({
  layout: 'ketua',
})

useHead({
  title: 'Panel Operasional - Ketua Post',
})

const { overview, liveEvents, refresh } = useOverview()

// Regu yang belum mulai = antrian; regu pertama yang sedang berjalan = giliran aktif
const inQueue = computed<TeamOverview[]>(() => overview.value.teams.filter(t => t.completedPositions.length === 0))
const activeTeam = computed<TeamOverview | undefined>(() =>
  overview.value.teams.find(t => t.completedPositions.length > 0 && t.completedPositions.length < 5),
)

const stats = computed<{ label: string, value: string | number, icon: string, color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' }[]>(() => [
  { label: 'Groups Completed', value: overview.value.stats.completedTeams, icon: 'i-lucide-check-circle', color: 'success' },
  { label: 'Currently Active', value: overview.value.stats.activeTeams, icon: 'i-lucide-activity', color: 'primary' },
  { label: 'In Queue', value: inQueue.value.length, icon: 'i-lucide-clock', color: 'warning' },
  { label: 'Rata-rata Skor', value: `${overview.value.stats.avgScore}`, icon: 'i-lucide-timer', color: 'secondary' },
])

// Submit skor: pos = pos berikutnya regu aktif
const scoreInput = ref<number | null>(null)
const scoreNotes = ref('')
const submitting = ref(false)

const nextPosOf = (t?: TeamOverview) => (t ? Math.min(t.completedPositions.length + 1, 5) : 0)

async function submitScore() {
  const team = activeTeam.value
  if (!team) {
    useToast().add({ title: 'Tidak ada regu aktif', description: 'Panggil dulu regu berikutnya.', color: 'warning' })
    return
  }
  const score = Number(scoreInput.value)
  if (!Number.isInteger(score) || score < 0 || score > 100) {
    useToast().add({ title: 'Skor tidak valid', description: 'Masukkan angka bulat 0-100.', color: 'warning' })
    return
  }
  submitting.value = true
  try {
    await $fetch('/api/scores', {
      method: 'POST',
      body: { teamId: team.teamId, positionId: nextPosOf(team), score, notes: scoreNotes.value || undefined },
    })
    useToast().add({ title: 'Skor berhasil dikirim', description: `Skor untuk ${team.name} telah terkirim.`, color: 'success' })
    scoreInput.value = null
    scoreNotes.value = ''
    await refresh()
  } catch (e: unknown) {
    const err = e as { statusMessage?: string }
    useToast().add({ title: 'Gagal kirim skor', description: err?.statusMessage ?? 'Coba lagi.', color: 'danger' })
  } finally {
    submitting.value = false
  }
}

function callNextGroup() {
  if (inQueue.value.length > 0) {
    useToast().add({
      title: `Regu berikutnya: ${inQueue.value[0]!.name}`,
      description: 'Regu sudah tercatat sebagai yang berikutnya dalam urutan pos.',
      color: 'primary',
    })
  }
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
      <NeoCard title="GILIRAN AKTIF" icon="i-lucide-users" :badge="activeTeam ? '1 AKTIF' : 'KOSONG'">
        <div v-if="activeTeam" class="neo-border-thick neo-shadow-lg rounded-xl p-5 bg-neo-primary-container text-white mb-5">
          <div class="flex items-center gap-2 mb-2">
            <StatusBadge label="SEDANG AKTIF" status="active" />
            <span class="font-mono text-[10px] opacity-75">PROGRES {{ activeTeam.completedPositions.length }}/5</span>
            <span class="font-mono text-[10px] font-bold">POS BERIKUTNYA: 0{{ nextPosOf(activeTeam) }}</span>
          </div>
          <div class="font-display font-bold text-lg">{{ activeTeam.name }}</div>
          <div class="font-mono text-[10px] opacity-75 mt-1">Sedang mengerjakan Pos 0{{ nextPosOf(activeTeam) }}</div>
        </div>
        <div v-else class="mb-5 font-mono text-[10px] text-neo-on-surface-variant uppercase">
          Tidak ada regu yang sedang di lapangan
        </div>

        <div class="flex flex-col gap-3">
          <div class="flex gap-3">
            <UInput
              v-model="scoreInput"
              type="number"
              :min="0"
              :max="100"
              placeholder="Skor 0-100"
              class="flex-1"
            />
            <UInput
              v-model="scoreNotes"
              maxlength="500"
              placeholder="Catatan (opsional)"
              class="flex-1"
            />
          </div>
          <div class="flex gap-3">
            <UButton color="success" size="sm" icon="i-lucide-check-circle" class="flex-1 neo-hover" :loading="submitting" @click="submitScore">
              Submit Skor
            </UButton>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-radio" class="w-4 h-4 text-neo-on-surface-variant" />
            <span class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest">Emergency Channel HT 04</span>
          </div>
        </template>
      </NeoCard>

      <!-- Standby Queue -->
      <NeoCard title="ANTRIAN STANDBY" icon="i-lucide-list" :badge="`${inQueue.length} ANTRE`">
        <div class="space-y-3">
          <div
            v-for="(g, i) in inQueue"
            :key="g.teamId"
            class="flex items-center gap-3 px-4 py-3 neo-border rounded-xl bg-white"
          >
            <span class="w-7 h-7 rounded-lg bg-neo-surface-container-highest flex items-center justify-center font-mono text-[10px] font-bold neo-border">
              {{ i + 1 }}
            </span>
            <div class="flex-1 min-w-0">
              <div class="font-display font-semibold text-sm">{{ g.name }}</div>
              <div class="font-mono text-[10px] text-neo-on-surface-variant">Belum mulai</div>
            </div>
          </div>
          <p v-if="inQueue.length === 0" class="font-mono text-[10px] text-neo-on-surface-variant uppercase">Antrian kosong</p>
        </div>

        <template #footer>
          <UButton
            color="primary"
            size="sm"
            icon="i-lucide-arrow-right"
            block
            class="neo-hover"
            :disabled="inQueue.length === 0"
            @click="callNextGroup"
          >
            Regu Berikutnya
          </UButton>
        </template>
      </NeoCard>
    </div>

    <!-- Recent Activity -->
    <NeoCard title="AKTIVITAS TERBARU" icon="i-lucide-clock" :badge="`${liveEvents.length} EVENTS`">
      <div class="space-y-4">
        <p v-if="liveEvents.length === 0" class="font-mono text-[10px] text-neo-on-surface-variant uppercase">Menunggu aktivitas realtime...</p>
        <div
          v-for="(e, i) in liveEvents"
          :key="`${e.at}-${i}`"
          class="flex items-start gap-3 pb-4 border-b border-neo-outline-variant last:border-0 last:pb-0"
        >
          <span class="font-mono text-[10px] text-neo-on-surface-variant shrink-0 mt-0.5">{{ e.at.slice(11, 16) }}</span>
          <UIcon :name="e.type === 'progress' ? 'i-lucide-check-circle' : 'i-lucide-send'" class="w-4 h-4 text-neo-primary shrink-0 mt-0.5" />
          <div>
            <p class="font-body text-xs">{{ e.type === 'progress' ? 'Checkpoint verified' : `Score submitted (${e.score})` }}</p>
            <span class="font-mono text-[10px] text-neo-on-surface-variant">POS 0{{ e.positionId }}</span>
          </div>
        </div>
      </div>
    </NeoCard>
  </div>
</template>
