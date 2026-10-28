<template>
  <div class="w-full mt-4 flex flex-col gap-4">
    <!-- Row 1: POS 1 & POS 2 -->
    <div class="grid grid-cols-2 gap-3.5 w-full">
      <PosButton
        v-for="pos in [1, 2]"
        :key="pos"
        :pos-number="pos"
        :is-completed="isPosCompleted(pos)"
        :is-available="isPosAvailable(pos)"
        :pos-subtitle="showSubtitles ? getPosSubtitle(pos) : undefined"
        @select="$emit('select', pos)"
      />
    </div>

    <!-- Row 2: POS 3 & POS 4 -->
    <div class="grid grid-cols-2 gap-3.5 w-full">
      <PosButton
        v-for="pos in [3, 4]"
        :key="pos"
        :pos-number="pos"
        :is-completed="isPosCompleted(pos)"
        :is-available="isPosAvailable(pos)"
        :pos-subtitle="showSubtitles ? getPosSubtitle(pos) : undefined"
        @select="$emit('select', pos)"
      />
    </div>

    <!-- Row 3: POS 5 (Centered) -->
    <div class="w-full flex justify-center">
      <PosButton
        :pos-number="5"
        :is-completed="isPosCompleted(5)"
        :is-available="isPosAvailable(5)"
        :pos-subtitle="showSubtitles ? getPosSubtitle(5) : undefined"
        class="w-full max-w-[280px]"
        @select="$emit('select', 5)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showSubtitles?: boolean
}>()

defineEmits<{
  select: [pos: number]
}>()

// Single source of truth: locking dari composable, bukan lokal
const { isPosCompleted, isPosAvailable } = useGameState()

const posSubtitles: Record<number, string> = {
  1: 'Algoritma & Logic',
  2: 'Database System',
  3: 'Networking',
  4: 'Jaringan & Cloud',
  5: 'Final Boss Challenge',
}

const getPosSubtitle = (pos: number) => posSubtitles[pos] || ''
</script>
