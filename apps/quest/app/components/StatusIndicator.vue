<template>
  <div class="mt-space-lg flex items-center gap-space-xs text-on-surface-variant">
    <span class="relative flex h-2.5 w-2.5">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed-dim opacity-75"></span>
      <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
    </span>
    <span class=" text-body-sm uppercase tracking-wide">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>
