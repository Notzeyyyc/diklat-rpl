<script setup lang="ts">
defineProps<{
  title?: string
  icon?: string
  badge?: string
  badgeColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'
}>()
</script>

<template>
  <div class="neo-border-thick neo-shadow-lg bg-white rounded-xl overflow-hidden">
    <div v-if="title || badge || $slots.header" class="border-b-2 border-neo-ink px-5 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <UIcon v-if="icon" :name="icon" class="w-4 h-4 text-neo-on-surface-variant" />
        <h3 class="font-display font-bold text-sm tracking-tight uppercase">{{ title }}</h3>
      </div>
      <div class="flex items-center gap-2">
        <slot name="header" />
        <UBadge v-if="badge" :color="badgeColor || 'neutral'" size="sm">
          {{ badge }}
        </UBadge>
      </div>
    </div>
    <div class="p-5">
      <slot />
    </div>
    <div v-if="$slots.footer" class="border-t-2 border-neo-ink px-5 py-4 bg-neo-surface-container">
      <slot name="footer" />
    </div>
  </div>
</template>
