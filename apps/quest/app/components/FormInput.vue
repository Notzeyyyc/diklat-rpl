<template>
  <div class="w-full relative">
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      autocomplete="off"
      class="neo-input text-headline-sm text-center placeholder:text-outline"
      :class="{ 'border-error': error }"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
  error?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
