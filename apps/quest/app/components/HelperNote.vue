<template>
  <div class="mt-6 w-full bg-surface-container-lowest border-[2px] border-[#111111] shadow-[3px_3px_0px_#111111] rounded-xl p-3.5 flex items-start gap-3">
    <div class="bg-tertiary-fixed border-[2px] border-[#111111] p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center text-on-tertiary-fixed">
      <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">{{ icon }}</span>
    </div>
    <div class="flex flex-col">
      <span class=" text-label-badge uppercase text-tertiary font-bold tracking-wider">{{ title }}</span>
      <p class=" text-body-sm text-on-surface font-medium leading-tight mt-0.5">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon?: string
}>()
</script>
