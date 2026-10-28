<script setup lang="ts">
defineProps<{
  label: string
  status: 'success' | 'warning' | 'danger' | 'info' | 'active' | 'pending' | 'completed' | 'standby' | 'busy'
}>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-1 neo-border rounded-md font-mono text-[10px] font-bold uppercase tracking-wider neo-shadow-sm"
    :class="{
      'bg-neo-success text-neo-ink': status === 'success' || status === 'completed',
      'bg-neo-warning text-neo-ink': status === 'warning' || status === 'pending',
      'bg-neo-danger text-white': status === 'danger',
      'bg-neo-info text-neo-ink': status === 'info',
      'bg-neo-primary-container text-white': status === 'active' || status === 'busy',
      'bg-neo-surface-container-highest text-neo-on-surface-variant': status === 'standby',
    }"
  >
    <span v-if="status === 'completed'" class="material-symbols-outlined text-[12px]">check</span>
    <span v-else-if="status === 'active' || status === 'busy'" class="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
    {{ label }}
  </span>
</template>
