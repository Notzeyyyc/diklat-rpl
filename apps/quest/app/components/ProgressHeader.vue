<template>
  <div class="flex flex-col items-center justify-center text-center my-2">
    <div class="inline-block bg-surface-container-lowest border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111] px-6 py-2 rounded-xl mb-2 transform -rotate-1">
      <h2 class=" text-display-hero-mobile text-on-surface uppercase tracking-tight font-extrabold">
        {{ title }}
      </h2>
    </div>
    <p class=" text-body-sm text-on-surface-variant max-w-[260px] text-center">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>
