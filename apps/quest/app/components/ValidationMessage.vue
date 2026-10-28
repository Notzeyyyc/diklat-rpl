<template>
  <div
    v-if="message"
    :class="['w-full mb-3 p-3 rounded-lg border-[2px] border-on-surface text-center text-body-md shadow-[2px_2px_0px_#1c1b1b] mt-3', variantClass]"
  >
    <span class="material-symbols-outlined text-[16px] align-middle mr-1">{{ icon }}</span>
    {{ message }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  message?: string
  variant?: 'success' | 'error'
  icon?: string
}>()

const variantClass = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-secondary-container text-on-secondary-fixed'
    case 'error':
      return 'bg-error-container text-on-error-container'
    default:
      return 'bg-surface-container text-on-surface'
  }
})
</script>
