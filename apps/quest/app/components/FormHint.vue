<template>
  <div class="min-h-[20px] flex items-center justify-center text-body-sm text-on-surface-variant">
    <span v-if="error" class="inline-flex items-center gap-1 text-tertiary-container">
      <span class="material-symbols-outlined text-[14px]">warning</span>
      {{ errorMessage }}
    </span>
    <span v-else class="inline-flex items-center gap-1">
      <span class="material-symbols-outlined text-[14px] text-primary">info</span>
      {{ hint }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error?: boolean
  errorMessage?: string
  hint?: string
}>()
</script>
