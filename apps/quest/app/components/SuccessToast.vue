<template>
  <div v-if="show" class="w-full bg-[#FFFFFF] rounded-xl border-[3.5px] border-[#111111] shadow-[5px_5px_0px_#111111] p-3.5 flex items-start gap-3 relative transition-all duration-150">
    <div class="w-10 h-10 rounded-lg bg-[#2DD4BF] border-[2.5px] border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center shrink-0">
      <span class="material-symbols-outlined text-[#111111] text-[22px]">celebration</span>
    </div>
    <div class="flex flex-col flex-1 pr-4">
      <div class="flex items-center gap-1.5">
        <span class=" text-headline-sm text-on-surface leading-tight">{{ title }}</span>
      </div>
      <p class=" text-body-sm text-on-surface-variant mt-0.5 leading-snug">
        {{ message }}
      </p>
    </div>
    <button class="text-on-surface hover:text-primary transition-colors" @click="$emit('dismiss')" type="button">
      <span class="material-symbols-outlined text-[18px]">close</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
  message: string
}>()

defineEmits<{
  dismiss: []
}>()
</script>
