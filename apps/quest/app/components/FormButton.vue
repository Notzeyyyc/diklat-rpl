<template>
  <button
    type="submit"
    :disabled="disabled"
    class="neo-btn w-full h-14 bg-primary-container text-on-primary flex items-center justify-center gap-space-xs"
    :class="{
      'translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_#111111]': loading,
    }"
  >
    <span v-if="loading" class="material-symbols-outlined animate-spin text-[20px]">sync</span>
    <span v-if="loading">{{ loadingText }}</span>
    <span v-else>{{ text }}</span>
    <span v-if="!loading && icon" class="material-symbols-outlined text-[20px]">{{ icon }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  text: string
  icon?: string
  loading?: boolean
  loadingText?: string
  disabled?: boolean
}>()
</script>
