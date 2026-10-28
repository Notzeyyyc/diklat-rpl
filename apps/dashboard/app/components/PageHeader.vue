<script setup lang="ts">
defineProps<{
  badge?: string
  badgeColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'
  title: string
  description?: string
}>()
</script>

<template>
  <div class="neo-border-thick neo-shadow-lg bg-white rounded-xl p-6 relative overflow-hidden">
    <div class="absolute -right-6 -top-6 w-32 h-32 bg-neo-primary/5 rounded-full pointer-events-none" />
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2 flex-wrap">
          <UBadge v-if="badge" :color="badgeColor || 'primary'" size="sm">
            {{ badge }}
          </UBadge>
          <span class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest font-bold">
            // DISPATCH PROTOCOL V2.6
          </span>
        </div>
        <h1 class="font-display font-bold text-2xl md:text-3xl tracking-tight text-neo-ink uppercase">
          {{ title }}
        </h1>
        <p v-if="description" class="font-body text-sm text-neo-on-surface-variant max-w-2xl">
          {{ description }}
        </p>
      </div>
      <slot name="actions" />
    </div>
  </div>
</template>
