<template>
  <div class="inline-flex items-center gap-space-2xs bg-secondary-fixed text-on-secondary-fixed border-[3px] border-[#111111] px-space-sm py-1 rounded-full shadow-[2px_2px_0px_#111111] mb-space-lg">
    <span class="material-symbols-outlined text-[16px]">{{ icon }}</span>
    <span class=" text-label-badge uppercase tracking-wider">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  icon?: string
}>()
</script>
