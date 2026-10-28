<template>
  <div class="w-full bg-surface-container-low rounded-xl p-4 mb-5 border-[3px] border-on-surface shadow-[4px_4px_0px_#1c1b1b]">
    <div class="flex items-center gap-2 mb-3 pb-2 border-b-[2px] border-surface-container-highest">
      <span class="material-symbols-outlined text-primary text-[20px]">route</span>
      <h3 class=" text-headline-sm text-on-surface uppercase">{{ title }}</h3>
    </div>
    <div class="flex flex-col gap-2.5">
      <div v-for="(step, index) in steps" :key="index" class="flex items-start gap-3">
        <span
          :class="[
            'w-6 h-6 rounded border-[2px] border-on-surface shadow-[2px_2px_0px_#1c1b1b] flex items-center justify-center text-label-badge shrink-0 mt-0.5',
            step.highlight ? 'bg-secondary-container text-on-secondary-fixed' : 'bg-surface-container-lowest text-on-surface',
          ]"
        >
          {{ index + 1 }}
        </span>
        <p class=" text-body-md text-on-surface">
          <span class="font-bold">{{ step.bold }}</span>
          {{ step.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Step {
  bold: string
  text: string
  highlight?: boolean
}

defineProps<{
  title: string
  steps: Step[]
}>()
</script>
