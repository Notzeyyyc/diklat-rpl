<template>
  <div class="w-full flex flex-col gap-space-xs mt-2 mb-4">
    <div class="w-full bg-surface-container-lowest p-space-sm rounded-lg flex items-center justify-between shadow-[4px_4px_0px_#111111] border-[3px] border-[#111111]">
      <div class="flex items-center gap-space-xs">
        <span class="material-symbols-outlined text-primary text-[20px]" style="font-variation-settings: 'FILL' 1;">shield</span>
        <div class="flex flex-col">
          <span class=" text-label-badge text-on-surface-variant uppercase">REGU PESERTA</span>
          <span class=" text-headline-sm text-on-surface uppercase tracking-tight">{{ teamName }}</span>
        </div>
      </div>
      <div class="bg-secondary-container text-on-secondary-container px-space-xs py-1 rounded border-[2px] border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center gap-1">
        <span class="material-symbols-outlined text-[14px]">bolt</span>
        <span class=" text-label-badge tracking-wider font-bold">{{ progress }} / {{ total }} SELESAI</span>
      </div>
    </div>
    <ProgressBar :completed="progress" :total="total" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  teamName: string
  progress: number
  total: number
}>()
</script>
