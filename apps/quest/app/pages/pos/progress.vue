<template>
  <div class="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-start">
    <AppHeader />
    <main class="flex-1 flex flex-col w-full pt-20 px-gutter pb-safe bg-surface">
      <div class="flex flex-col w-full pb-8">
        <ProgressStrip :teamName="state.teamName || 'CYBER EAGLE 07'" :progress="progress" :total="state.totalPos" />

        <div class="flex items-center justify-between mb-3 px-1">
          <div class="flex items-center gap-2">
            <div class="w-3 h-6 bg-primary border-[2px] border-[#111111] shadow-[2px_2px_0px_#111111]"></div>
            <h2 class=" text-display-hero-mobile text-on-surface tracking-tight uppercase">PILIH POS</h2>
          </div>
          <span class=" text-label-badge text-on-surface-variant bg-surface-container-high px-2 py-1 rounded border-[2px] border-[#111111]">RUTE TERBUKA</span>
        </div>

        <PosGrid :showSubtitles="true" @select="handleSelectPos" />

        <SuccessToast
          :show="showToast"
          :title="`Pos ${lastCompletedPos} Berhasil!`"
          message="Pos Berhasil Diselesaikan! Lanjutkan ke pos berikutnya."
          @dismiss="showToast = false"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { state, isPosCompleted, isPosAvailable, isValidPos, completePos, progress } = useGameState()

// SSE live: progres update tanpa refresh
const refetch = async () => {
  if (!state.value.teamId) return
  try {
    const teams = await $fetch<{ id: string; completedPositions: number[] }[]>('/api/teams')
    const me = teams.find((t) => t.id === state.value.teamId)
    if (me) state.value.completedPos = me.completedPositions
  } catch { /* polling berikutnya coba lagi */ }
}

useRealtime((e) => {
  if (e.type === 'progress' && e.teamId === state.value.teamId) completePos(e.positionId)
}, refetch)

// Query ?done dipakai hanya kalau pos-nya valid DAN memang sudah selesai
const doneParam = Number(route.query.done)
const isValidDone = isValidPos(doneParam) && isPosCompleted(doneParam)
const lastCompletedPos = ref(isValidDone ? doneParam : 0)
const showToast = ref(lastCompletedPos.value > 0)

const handleSelectPos = (pos: number) => {
  if (isPosAvailable(pos) && !isPosCompleted(pos)) {
    router.push(`/pos/${pos}`)
  }
}
</script>
