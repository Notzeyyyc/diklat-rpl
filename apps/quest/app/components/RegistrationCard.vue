<template>
  <div class="w-full bg-surface-container-lowest border-[4px] border-[#111111] rounded-xl shadow-[6px_6px_0px_#111111] p-space-lg flex flex-col items-center text-center relative overflow-hidden">
    <!-- Decorative Retro Corner Accent -->
    <div class="absolute -top-3 -right-3 w-10 h-10 bg-primary border-[3px] border-[#111111] rotate-12 flex items-center justify-center">
      <span class="material-symbols-outlined text-on-primary text-[18px]">bolt</span>
    </div>

    <!-- Step Header -->
    <div class=" text-label-badge text-on-surface-variant uppercase tracking-widest mb-space-sm">
      {{ stepLabel }}
    </div>

    <!-- Instructional Header -->
    <h2 class=" text-headline-md text-on-surface uppercase tracking-tight mb-space-2xs">
      {{ title }}
    </h2>
    <p class=" text-body-sm text-on-surface-variant max-w-[18rem] mb-space-lg">
      {{ description }}
    </p>

    <slot />

    <!-- Mission Flow Pill -->
    <div v-if="flowText" class="w-full mt-space-lg pt-space-md border-t-[2px] border-[#111111]/15 flex items-center justify-center">
      <div class="inline-flex items-center gap-1 px-space-xs py-1 bg-surface-container-high rounded-md border-[2px] border-[#111111]">
        <span class=" text-[10px] text-on-surface uppercase font-bold tracking-tight">
          {{ flowText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stepLabel: string
  title: string
  description: string
  flowText?: string
}>()
</script>
