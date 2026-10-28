<template>
  <div class="w-full bg-surface-container-lowest rounded-lg border-[3px] border-[#111111] p-1 shadow-[3px_3px_0px_#111111] flex gap-1 h-5">
    <div
      v-for="i in total"
      :key="i"
      :class="[
        'flex-1 h-full',
        i <= completed
          ? 'bg-[#2DD4BF]'
          : 'bg-surface-container-high',
        i < total ? 'border-r-[2px] border-[#111111]' : '',
        i === 1 ? 'rounded-l-[2px]' : '',
        i === total ? 'rounded-r-[2px]' : '',
      ]"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  completed: number
  total: number
}>()
</script>
