<template>
  <!-- Completed State -->
  <div
    v-if="isCompleted"
    class="relative bg-[#2DD4BF] rounded-xl border-[3.5px] border-[#111111] shadow-[5px_5px_0px_#111111] p-4 flex flex-col justify-between h-40 overflow-hidden cursor-default transition-all duration-100 select-none"
  >
    <!-- Stamp Watermark Background Effect -->
    <div class="absolute -right-4 -bottom-4 select-none pointer-events-none opacity-15 text-[#111111]">
      <span class="material-symbols-outlined text-[96px]">verified</span>
    </div>
    <div class="flex items-center justify-between w-full z-10">
      <span class=" text-label-badge uppercase tracking-widest text-[#111111] bg-white/70 px-2 py-0.5 rounded border-[2px] border-[#111111]">STATUS</span>
      <span class="flex items-center gap-1 text-label-badge bg-[#111111] text-[#2DD4BF] px-2 py-0.5 rounded-full border-[1.5px] border-[#111111] shadow-[1.5px_1.5px_0px_rgba(255,255,255,0.8)]">
        <span class="material-symbols-outlined text-[13px] font-bold">check_circle</span>
        DONE
      </span>
    </div>
    <div class="flex flex-col z-10 my-auto">
      <span class=" text-[30px] leading-tight text-[#111111] font-extrabold tracking-tight">POS {{ posNumber }}</span>
      <span class=" text-headline-sm text-[#111111] font-bold flex items-center gap-1 tracking-tight">
        ✓ SELESAI
      </span>
    </div>
    <div class="w-full flex items-center justify-between text-[#111111] pt-2 border-t-[2px] border-[#111111]/30 z-10">
      <span class="material-symbols-outlined text-[20px] text-[#111111]" style="font-variation-settings: 'FILL' 1;">task_alt</span>
    </div>
  </div>

  <!-- Available / Active State -->
  <button
    v-else
    class="group relative bg-[#FFFFFF] rounded-xl border-[3.5px] border-[#111111] shadow-[5px_5px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#111111] p-4 flex flex-col justify-between h-40 transition-all duration-75 text-left overflow-hidden"
    @click="$emit('select', posNumber)"
    type="button"
  >
    <div class="flex items-center justify-between w-full">
      <span class=" text-label-badge uppercase tracking-widest text-on-surface-variant">AVAILABLE</span>
      <span class="w-2.5 h-2.5 rounded-full bg-primary-container border-[1.5px] border-[#111111]"></span>
    </div>
    <div class="flex flex-col my-auto">
      <span class=" text-[30px] leading-tight text-on-surface font-extrabold tracking-tight group-hover:text-primary transition-colors">POS {{ posNumber }}</span>
      <span v-if="posSubtitle" class=" text-body-sm text-on-surface-variant font-medium">{{ posSubtitle }}</span>
    </div>
    <div class="w-full flex items-center justify-between text-on-surface pt-2 border-t-[2px] border-[#111111]/20">
      <span class=" text-body-sm font-bold text-primary">MASUK POS</span>
      <span class="material-symbols-outlined text-[18px] text-on-surface group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  posNumber: number
  isCompleted: boolean
  posSubtitle?: string
  showProgress?: boolean
}>()

defineEmits<{
  select: [pos: number]
}>()
</script>
