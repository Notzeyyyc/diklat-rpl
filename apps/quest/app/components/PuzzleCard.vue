<template>
  <div class="w-full mb-6 flex flex-col items-center">
    <div class="w-full bg-surface-container-lowest rounded-xl p-5 relative border-[3px] border-on-surface shadow-[5px_5px_0px_#1c1b1b] overflow-hidden">
      <!-- Slide 1 -->
      <div v-if="currentSlide === 1" class="flex flex-col">
        <div class="flex items-center justify-between gap-2 mb-4 pb-3 border-b-[2px] border-surface-container-highest">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-container text-on-secondary-fixed text-label-badge uppercase tracking-wider border-[2px] border-on-surface shadow-[2px_2px_0px_#1c1b1b]">
            <span class="material-symbols-outlined text-[14px]">terminal</span>
            SLIDE 1/2 • SOAL PUZZLE
          </span>
          <button
            type="button"
            class="min-h-[44px] px-4 py-1 rounded bg-surface-container text-on-surface text-label-badge uppercase border-[1.5px] border-on-surface flex items-center gap-1 cursor-pointer hover:bg-surface-container-high transition-all"
            @click="$emit('nextSlide')"
          >
            <span>CLUE</span>
            <span class="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        <!-- Puzzle Content -->
        <div class="bg-surface-container-low rounded-lg p-5 my-2 border-[2px] border-on-surface text-center shadow-[3px_3px_0px_#1c1b1b] relative overflow-hidden">
          <div class="absolute -right-6 -bottom-6 text-surface-container-highest/60 pointer-events-none select-none">
            <span class="material-symbols-outlined text-[90px]">data_object</span>
          </div>
          <p class=" text-label-badge uppercase tracking-widest text-on-surface-variant mb-2 font-bold">DEKRIPSI BIT STREAM</p>
          <div class=" text-display-hero-mobile text-primary tracking-widest font-extrabold leading-tight break-all">
            {{ puzzleCode }}
          </div>
        </div>

        <slot name="slide1" />
      </div>

      <!-- Slide 2 -->
      <div v-else class="flex flex-col">
        <div class="flex items-center justify-between gap-2 mb-4 pb-3 border-b-[2px] border-surface-container-highest">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary text-on-primary text-label-badge uppercase tracking-wider border-[2px] border-on-surface shadow-[2px_2px_0px_#1c1b1b]">
            <span class="material-symbols-outlined text-[14px]">lightbulb</span>
            SLIDE 2/2 • CLUE
          </span>
          <button
            type="button"
            class="min-h-[44px] px-4 py-1 rounded bg-surface-container text-on-surface text-label-badge uppercase border-[1.5px] border-on-surface flex items-center gap-1 cursor-pointer hover:bg-surface-container-high transition-all"
            @click="$emit('prevSlide')"
          >
            <span class="material-symbols-outlined text-[18px]">chevron_left</span>
            <span>SOAL</span>
          </button>
        </div>

        <div class="bg-surface-container-low rounded-lg p-5 my-2 border-[2px] border-on-surface shadow-[3px_3px_0px_#1c1b1b] relative overflow-hidden">
          <div class="absolute -right-6 -bottom-6 text-surface-container-highest/60 pointer-events-none select-none">
            <span class="material-symbols-outlined text-[90px]">key</span>
          </div>
          <p class=" text-label-badge uppercase tracking-widest text-on-surface-variant mb-2 font-bold">PETUNJUK DEKRIPSI</p>
          <p class=" text-body-lg text-on-surface leading-relaxed">
            Setiap <span class="font-bold text-primary">8-bit</span> biner merepresentasikan satu karakter ASCII.
            Konversikan setiap blok ke desimal, lalu temukan huruf yang sesuai pada tabel ASCII.
          </p>
          <div class="mt-4 p-3 bg-surface-container rounded-lg border-[2px] border-on-surface text-code-stat text-primary tracking-wider">
            {{ clueExample }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentSlide: number
  puzzleCode: string
  clueExample?: string
}>()

defineEmits<{
  nextSlide: []
  prevSlide: []
}>()
</script>
