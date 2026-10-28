<template>
  <div class="w-full text-center py-4 mb-2">
    <h2 class=" text-headline-lg text-on-surface uppercase tracking-wider font-extrabold flex items-center justify-center gap-2">
      <span>POS {{ posNumber }}</span>
    </h2>
    <div class="flex items-center justify-center gap-2 mt-1">
      <span class="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse inline-block border-[2px] border-on-surface"></span>
      <p class=" text-label-badge uppercase tracking-widest text-on-surface-variant">{{ statusText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  posNumber: number
  statusText: string
}>()
</script>
