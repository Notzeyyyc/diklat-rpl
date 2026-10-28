<script setup lang="ts">
import type { TeamOverview } from '@diklat/shared'

definePageMeta({
  layout: 'ketua',
})

useHead({
  title: 'Panel Operasional - Ketua Post',
})

const { overview, liveEvents, refresh } = useOverview()

// Keputusan owner 28 Okt: POS semua kebuka, tanpa giliran/antrian.
const stats = computed<{ label: string, value: string | number, icon: string, color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' }[]>(() => [
  { label: 'Total Regu', value: overview.value.stats.totalTeams, icon: 'i-lucide-users', color: 'primary' },
  { label: 'Groups Completed', value: overview.value.stats.completedTeams, icon: 'i-lucide-check-circle', color: 'success' },
  { label: 'Total Skor Masuk', value: overview.value.stats.scoresCount, icon: 'i-lucide-star', color: 'warning' },
  { label: 'Rata-rata Skor', value: `${overview.value.stats.avgScore}`, icon: 'i-lucide-timer', color: 'secondary' },
])

const POS_OPTIONS = [1, 2, 3, 4, 5].map(n => ({ label: `POS 0${n}`, value: n }))

// ---- Generate one-time code ----
const codeTeamId = ref<string | null>(null)
const codePos = ref<number | null>(null)
const generating = ref(false)
const generatedCode = ref('')
const qrDataUrl = ref('')

async function generateCode() {
  if (!codeTeamId.value || !codePos.value) {
    useToast().add({ title: 'Lengkapi dulu', description: 'Pilih regu dan pos.', color: 'warning' })
    return
  }
  generating.value = true
  try {
    const res = await $fetch<{ code: string }>('/api/admin/pos-codes', {
      method: 'POST',
      body: { teamId: codeTeamId.value, positionId: codePos.value },
    })
    generatedCode.value = res.code
    const QRCode = await import('qrcode')
    qrDataUrl.value = await QRCode.toDataURL(res.code, { width: 200, margin: 1 })
    useToast().add({ title: 'Code dibuat', description: `Code untuk POS 0${codePos.value}: ${res.code}`, color: 'success' })
  } catch (e: unknown) {
    const err = e as { statusMessage?: string }
    useToast().add({ title: 'Gagal generate code', description: err?.statusMessage ?? 'Coba lagi.', color: 'danger' })
  } finally {
    generating.value = false
  }
}

// ---- Submit skor: regu & pos dipilih manual (tanpa antrian) ----
const scoreTeamId = ref<string | null>(null)
const scorePos = ref<number | null>(null)
const scoreInput = ref<number | null>(null)
const scoreNotes = ref('')
const submitting = ref(false)

async function submitScore() {
  if (!scoreTeamId.value || !scorePos.value) {
    useToast().add({ title: 'Lengkapi dulu', description: 'Pilih regu dan pos.', color: 'warning' })
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
      body: { teamId: scoreTeamId.value, positionId: scorePos.value, score, notes: scoreNotes.value || undefined },
    })
    useToast().add({ title: 'Skor berhasil dikirim', color: 'success' })
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
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      badge="POS OPERASIONAL"
      badge-color="primary"
      title="PANEL OPERASIONAL TERPADU"
      description="Generate code pos, input skor, dan pantau aktivitas evaluasi"
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
      <!-- Generate One-Time Code -->
      <NeoCard title="GENERATE CODE POS" icon="i-lucide-key-round" :badge="generatedCode ? 'AKTIF' : 'SIAP'">
        <div class="space-y-3">
          <USelect
            v-model="codeTeamId"
            placeholder="Pilih regu"
            class="w-full"
            :items="overview.teams.map(t => ({ label: t.name, value: t.teamId }))"
          />
          <USelect
            v-model="codePos"
            placeholder="Pilih pos"
            class="w-full"
            :items="POS_OPTIONS"
          />
          <UButton
            color="primary"
            size="sm"
            icon="i-lucide-key-round"
            block
            class="neo-hover"
            :loading="generating"
            @click="generateCode"
          >
            Generate Code
          </UButton>

          <div v-if="generatedCode" class="flex items-center gap-4 rounded-xl p-4 neo-border bg-white">
            <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR code pos" class="w-28 h-28 neo-border rounded-lg shrink-0" />
            <div class="min-w-0">
              <p class="font-mono text-[10px] text-neo-on-surface-variant uppercase">Code sekali pakai — hangus setelah dipakai</p>
              <p class="font-display text-3xl font-bold tracking-[0.3em] my-1">{{ generatedCode }}</p>
              <p class="font-mono text-[10px] text-neo-on-surface-variant uppercase">Code lama otomatis tidak berlaku</p>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-qr-code" class="w-4 h-4 text-neo-on-surface-variant" />
            <span class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest">Regu scan QR atau ketik code</span>
          </div>
        </template>
      </NeoCard>

      <!-- Submit Skor -->
      <NeoCard title="INPUT SKOR" icon="i-lucide-star" badge="MANUAL">
        <div class="space-y-3">
          <USelect
            v-model="scoreTeamId"
            placeholder="Pilih regu"
            class="w-full"
            :items="overview.teams.map(t => ({ label: t.name, value: t.teamId }))"
          />
          <div class="flex gap-3">
            <USelect
              v-model="scorePos"
              placeholder="Pos"
              class="flex-1"
              :items="POS_OPTIONS"
            />
            <UInput
              v-model="scoreInput"
              type="number"
              :min="0"
              :max="100"
              placeholder="Skor 0-100"
              class="flex-1"
            />
          </div>
          <UInput
            v-model="scoreNotes"
            maxlength="500"
            placeholder="Catatan (opsional)"
            class="w-full"
          />
          <UButton color="success" size="sm" icon="i-lucide-check-circle" block class="neo-hover" :loading="submitting" @click="submitScore">
            Submit Skor
          </UButton>
        </div>

        <template #footer>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-radio" class="w-4 h-4 text-neo-on-surface-variant" />
            <span class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest">Emergency Channel HT 04</span>
          </div>
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
