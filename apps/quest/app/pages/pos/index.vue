<template>
  <div class="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-start">
    <AppHeader />
    <main class="flex-1 flex flex-col w-full pt-20 px-gutter pb-safe bg-surface">
      <div class="flex flex-col w-full pb-8">
        <TeamStatusBanner :teamName="state.teamName || 'CYBER EAGLE 07'" :showOnline="true" />

        <ProgressHeader title="PILIH POS" description="Pilih pos aktif di bawah ini untuk memulai tahapan verifikasi lapangan." />

        <PosGrid @select="handleSelectPos" />

        <HelperNote
          title="PETUNJUK LAPANGAN"
          description="Kunjungi pos di dunia nyata, selesaikan puzzle, dan minta password kepada panitia pos."
          icon="info"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { state, isPosCompleted, isPosAvailable, selectPos } = useGameState()

const handleSelectPos = (pos: number) => {
  if (isPosAvailable(pos)) {
    selectPos(pos)
    router.push(`/pos/${pos}`)
  }
}
</script>
