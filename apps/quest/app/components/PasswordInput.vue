<template>
  <div class="w-full mb-3 flex flex-col items-center">
    <label class=" text-label-badge uppercase text-on-surface-variant tracking-widest mb-2">{{ label }}</label>
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="neo-input text-headline-sm text-center uppercase tracking-wider placeholder:text-outline"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
