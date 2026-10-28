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
        <div class="relative w-[140px] h-[140px] bg-surface-container-lowest border-[2px] border-on-surface rounded-lg p-2.5 flex items-center justify-center shadow-[2px_2px_0px_#1c1b1b] overflow-hidden">
          <!-- Corner brackets -->
          <span class="absolute top-1 left-1 w-3 h-3 border-t-[3px] border-l-[3px] border-primary pointer-events-none z-10"></span>
          <span class="absolute top-1 right-1 w-3 h-3 border-t-[3px] border-r-[3px] border-primary pointer-events-none z-10"></span>
          <span class="absolute bottom-1 left-1 w-3 h-3 border-b-[3px] border-l-[3px] border-primary pointer-events-none z-10"></span>
          <span class="absolute bottom-1 right-1 w-3 h-3 border-b-[3px] border-r-[3px] border-primary pointer-events-none z-10"></span>

          <!-- Live camera saat scan aktif -->
          <video v-if="scanning" ref="videoRef" class="absolute inset-0 w-full h-full object-cover" muted playsinline autoplay></video>

          <template v-else>
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
          </template>
        </div>
      </div>
      <p class=" text-body-sm text-on-surface-variant text-center mt-2 max-w-[20rem] leading-snug">{{ statusText }}</p>

      <!-- Fallback manual: tanpa kamera (BarcodeDetector tidak ada / izin ditolak) -->
      <form v-if="showManual" class="w-full mt-3 flex gap-2" @submit.prevent="submitManual">
        <input
          v-model="manualValue"
          type="text"
          maxlength="40"
          autocomplete="off"
          placeholder="Ketik code dari ketua"
          class="flex-1 border-[2px] border-on-surface rounded-lg px-3 py-3 text-on-surface bg-surface-container-lowest"
        />
      </form>
    </div>

    <!-- Scan Button -->
    <button
      type="button"
      class="w-full mt-3 bg-primary-container text-on-primary py-4 px-6 rounded-lg text-label-btn tracking-wider uppercase border-[3px] border-on-surface shadow-[4px_4px_0px_#1c1b1b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1c1b1b] transition-all flex items-center justify-center gap-2 font-bold cursor-pointer"
      @click="scanning ? stop() : start()"
    >
      <span>{{ scanning ? 'BERHENTI' : buttonText }}</span>
      <span class="material-symbols-outlined text-[20px]">{{ scanning ? 'stop' : 'arrow_forward' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
// ponytail: scanner pakai BarcodeDetector API (Chrome/Android), fallback input manual.
// Upgrade: ganti deteksi ke lib ringan (mis. zxing) kalau harus dukung iOS Safari lama.
const props = defineProps<{
  title?: string
  description?: string
  buttonText?: string
}>()

const emit = defineEmits<{
  scan: [value: string]
}>()

const scanning = ref(false)
const showManual = ref(false)
const manualValue = ref('')
const statusText = ref(props.description ?? '')
const videoRef = ref<HTMLVideoElement | null>(null)
let stream: MediaStream | null = null
let raf = 0

const stop = () => {
  scanning.value = false
  cancelAnimationFrame(raf)
  stream?.getTracks().forEach((t) => t.stop())
  stream = null
}

onBeforeUnmount(stop)

const start = async () => {
  statusText.value = props.description ?? ''
  const Detector = (globalThis as { BarcodeDetector?: new (opts?: { formats?: string[] }) => { detect: (src: CanvasImageSource) => Promise<{ rawValue: string }[]> } }).BarcodeDetector
  if (!Detector || !navigator.mediaDevices?.getUserMedia) {
    showManual.value = true
    statusText.value = 'Kamera tidak tersedia di browser ini — gunakan input manual.'
    return
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    scanning.value = true
    const detector = new Detector({ formats: ['qr_code'] })
    await nextTick()
    if (videoRef.value) {
      videoRef.value.srcObject = stream
      await videoRef.value.play()
    }
    const loop = async () => {
      if (!scanning.value || !videoRef.value) return
      try {
        const codes = await detector.detect(videoRef.value)
        if (codes.length > 0) {
          stop()
          emit('scan', codes[0]!.rawValue)
          return
        }
      } catch { /* frame blur → frame berikutnya */ }
      raf = requestAnimationFrame(() => setTimeout(loop, 150))
    }
    loop()
  } catch {
    stop()
    showManual.value = true
    statusText.value = 'Izin kamera ditolak — gunakan input manual.'
  }
}

const submitManual = () => {
  const v = manualValue.value.trim()
  if (v) {
    manualValue.value = ''
    emit('scan', v)
  }
}
</script>
