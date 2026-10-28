<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  subtext?: string
  icon?: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}>()
</script>

<template>
  <div class="neo-border-thick neo-shadow-md bg-white rounded-xl p-5 relative overflow-hidden">
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <p class="font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant mb-2">
          {{ label }}
        </p>
        <p class="font-display font-bold text-2xl text-neo-ink leading-none">{{ value }}</p>
        <p v-if="subtext" class="font-mono text-[10px] text-neo-on-surface-variant mt-1.5">{{ subtext }}</p>
      </div>
      <div v-if="icon" class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 neo-border neo-shadow-sm"
        :class="{
          'bg-neo-primary-container': color === 'primary' || !color,
          'bg-neo-secondary-container': color === 'secondary',
          'bg-neo-success/20': color === 'success',
          'bg-neo-warning/20': color === 'warning',
          'bg-neo-danger-container': color === 'danger',
        }"
      >
        <UIcon :name="icon" class="w-5 h-5"
          :class="{
            'text-neo-on-primary': color === 'primary' || !color,
            'text-neo-on-surface': color === 'secondary',
            'text-neo-success': color === 'success',
            'text-neo-warning': color === 'warning',
            'text-neo-danger': color === 'danger',
          }"
        />
      </div>
    </div>
  </div>
</template>
