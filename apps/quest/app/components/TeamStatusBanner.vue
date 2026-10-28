<template>
  <div class="w-full mt-2 mb-5 flex items-center justify-between bg-primary-fixed border-[3px] border-[#111111] shadow-[3px_3px_0px_#111111] rounded-xl px-4 py-3">
    <div class="flex items-center gap-2 min-w-0">
      <span class="material-symbols-outlined text-on-primary-fixed text-[22px] flex-shrink-0" style="font-variation-settings: 'FILL' 1;">shield</span>
      <div class="flex flex-col truncate">
        <span class=" text-label-badge text-on-primary-fixed-variant uppercase tracking-wider">TEAM ASSIGNMENT</span>
        <span class=" text-headline-sm text-on-primary-fixed font-bold truncate">{{ teamName }}</span>
      </div>
    </div>
    <div v-if="showOnline" class="flex-shrink-0 bg-secondary-container border-[2px] border-[#111111] px-2.5 py-1 rounded-full shadow-[2px_2px_0px_#111111] flex items-center gap-1.5">
      <span class="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
      <span class=" text-label-badge text-on-secondary-container uppercase">ONLINE</span>
    </div>
    <slot name="badge" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  teamName: string
  showOnline?: boolean
}>()
</script>
