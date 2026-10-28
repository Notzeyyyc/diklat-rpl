<template>
  <NuxtLink
    :to="to"
    class="w-full bg-surface-container-lowest text-on-surface py-3 px-4 rounded-lg text-label-btn tracking-wider uppercase border-[3px] border-on-surface shadow-[3px_3px_0px_#1c1b1b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1c1b1b] transition-all text-center flex items-center justify-center gap-2"
  >
    <span class="material-symbols-outlined text-[18px]">{{ icon }}</span>
    <span>{{ text }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  to: string
  text: string
  icon?: string
}>()
</script>
