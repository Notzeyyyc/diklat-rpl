<template>
  <div class="w-full flex flex-col mb-6">
    <div class="w-full flex items-center justify-center mb-3">
      <h3 class=" text-label-btn uppercase tracking-widest text-on-surface font-extrabold flex items-center gap-1.5">
        <span class="material-symbols-outlined text-[20px] text-primary">qr_code_scanner</span>
        {{ title }}
      </h3>
    </div>
    <div class="w-full bg-surface-container-lowest rounded-xl p-5 border-[3px] border-on-surface shadow-[4px_4px_0px_#1c1b1b] flex flex-col items-center justify-center relative overflow-hidden">
      <!-- Scanner Corner Guides & Laser Line -->
      <div class="relative p-4 flex flex-col items-center justify-center">
        <div class="relative w-[140px] h-[140px] bg-surface-container-lowest border-[2px] border-on-surface rounded-lg p-2.5 flex items-center justify-center shadow-[2px_2px_0px_#1c1b1b]">
          <!-- Corner brackets -->
          <span class="absolute top-1 left-1 w-3 h-3 border-t-[3px] border-l-[3px] border-primary pointer-events-none"></span>
          <span class="absolute top-1 right-1 w-3 h-3 border-t-[3px] border-r-[3px] border-primary pointer-events-none"></span>
          <span class="absolute bottom-1 left-1 w-3 h-3 border-b-[3px] border-l-[3px] border-primary pointer-events-none"></span>
          <span class="absolute bottom-1 right-1 w-3 h-3 border-b-[3px] border-r-[3px] border-primary pointer-events-none"></span>
          <!-- Animated laser scan line -->
          <div class="absolute left-1 right-1 h-[2px] bg-secondary-fixed shadow-[0_0_8px_#62fae3] animate-pulse top-1/2 pointer-events-none"></div>
          <!-- Stylized QR Code SVG -->
          <svg class="w-full h-full text-primary" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8h28v28H8V8zm6 6v16h16V14H14zm4 4h8v8h-8v-8z" fill="#0046cb"></path>
            <path d="M64 8h28v28H64V8zm6 6v16h16V14H70zm4 4h8v8h-8v-8z" fill="#0046cb"></path>
            <path d="M8 64h28v28H8V64zm6 6v16h16V70H14zm4 4h8v8h-8v-8z" fill="#0046cb"></path>
            <rect x="44" y="10" width="6" height="6" fill="#0046cb"></rect>
            <rect x="52" y="18" width="6" height="6" fill="#0046cb"></rect>
            <rect x="44" y="26" width="6" height="6" fill="#0046cb"></rect>
            <rect x="10" y="44" width="6" height="6" fill="#0046cb"></rect>
            <rect x="22" y="44" width="6" height="6" fill="#0046cb"></rect>
            <rect x="28" y="50" width="6" height="6" fill="#0046cb"></rect>
            <rect x="44" y="44" width="12" height="12" fill="#0046cb"></rect>
            <rect x="60" y="44" width="6" height="6" fill="#0046cb"></rect>
            <rect x="72" y="44" width="8" height="8" fill="#0046cb"></rect>
            <rect x="86" y="44" width="6" height="6" fill="#0046cb"></rect>
            <rect x="44" y="62" width="6" height="8" fill="#0046cb"></rect>
            <rect x="54" y="72" width="8" height="6" fill="#0046cb"></rect>
            <rect x="70" y="64" width="10" height="10" fill="#0046cb"></rect>
            <rect x="64" y="80" width="8" height="8" fill="#0046cb"></rect>
            <rect x="84" y="76" width="8" height="12" fill="#0046cb"></rect>
            <rect x="52" y="84" width="6" height="6" fill="#0046cb"></rect>
          </svg>
        </div>
      </div>
      <p class=" text-body-sm text-on-surface-variant text-center mt-2 max-w-[20rem] leading-snug">{{ description }}</p>
    </div>

    <!-- Scan Button -->
    <button
      type="button"
      class="w-full mt-3 bg-primary-container text-on-primary py-4 px-6 rounded-lg text-label-btn tracking-wider uppercase border-[3px] border-on-surface shadow-[4px_4px_0px_#1c1b1b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1c1b1b] transition-all flex items-center justify-center gap-2 font-bold cursor-pointer"
      @click="$emit('scan')"
    >
      <span>{{ buttonText }}</span>
      <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  buttonText?: string
}>()

defineEmits<{
  scan: []
}>()
</script>
