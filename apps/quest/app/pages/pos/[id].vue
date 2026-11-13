<template>
  <div class="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-start">
    <AppHeader />
    <main class="flex-1 flex flex-col w-full pt-20 px-gutter pb-safe bg-surface">
      <div class="flex flex-col w-full pb-20">
        <PuzzleHeader :posNumber="posId" statusText="Status: Misi Aktif • Sesi 01" />

        <PuzzleCard
          v-if="puzzle"
          :currentSlide="currentSlide"
          :puzzle="puzzle"
          @nextSlide="currentSlide = 2"
          @prevSlide="currentSlide = 1"
        >
          <template #slide1>
            <PasswordInput v-model="password" label="MASUKKAN CODE DARI KETUA" placeholder="Code dari ketua" />
            <ValidationMessage :message="statusMessage" :variant="statusVariant" :icon="statusIcon" />
            <button
              type="button"
              class="w-full mt-3 bg-primary-container text-on-primary py-4 px-6 rounded-lg text-label-btn tracking-wider uppercase border-[3px] border-on-surface shadow-[4px_4px_0px_#1c1b1b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1c1b1b] transition-all flex items-center justify-center gap-2 font-bold cursor-pointer"
              @click="handleVerification"
            >
              <span>VERIFIKASI CODE</span>
              <span class="material-symbols-outlined text-[20px]">check_circle</span>
            </button>
          </template>
        </PuzzleCard>

        <QRScanner
          title="SCAN QR UNTUK LANJUT"
          description="Scan QR code yang ditampilkan ketua di pos, atau ketik code secara manual."
          buttonText="MULAI SCAN"
          @scan="handleScanQR"
        />

        <ProcedureCard
          title="PROSEDUR MISI POS"
          :steps="procedureSteps"
        />

        <BackLink to="/pos" text="KEMBALI KE DAFTAR POS" icon="arrow_back" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { state, completePos, isValidPos } = useGameState()

const posId = computed(() => Number(route.params.id))
const puzzle = computed(() => getPosPuzzle(posId.value))

// Route guard: id ga valid → 404. POS semua kebuka (keputusan owner 28 Okt) — tanpa lock sequential.
if (!isValidPos(posId.value)) {
  throw createError({ statusCode: 404, statusMessage: 'Pos tidak ditemukan', fatal: true })
}

const currentSlide = ref(1)
const password = ref('')
const statusMessage = ref('')
const statusVariant = ref<'success' | 'error'>('error')
const statusIcon = ref('')

const procedureSteps = computed(() => [
  { bold: 'Baca soal', text: ' pada kartu di atas dengan teliti.' },
  { bold: 'Kunjungi pos fisik', text: ' sesuai clue lokasi (buka tab CLUE di atas).' },
  { bold: 'Beritahu jawaban', text: ' langsung secara lisan ke panitia pos.' },
  { bold: 'Minta code', text: ' ke ketua di pos, lalu masukkan/scan untuk verifikasi.', highlight: true },
])

const handleVerification = async () => {
  const val = password.value.trim().toUpperCase()

  if (!val) {
    statusVariant.value = 'error'
    statusMessage.value = 'Masukkan code dari ketua terlebih dahulu!'
    statusIcon.value = 'error'
    return
  }

  if (!state.value.teamId) {
    statusVariant.value = 'error'
    statusMessage.value = 'Regu belum terdaftar. Kembali ke halaman awal!'
    statusIcon.value = 'error'
    return
  }

  try {
    await $fetch(`/api/pos/${posId.value}/verify`, {
      method: 'POST',
      body: { code: val },
    })
    statusVariant.value = 'success'
    statusMessage.value = 'BERHASIL! Menuju halaman progres...'
    statusIcon.value = 'check_circle'
    completePos(posId.value)
    setTimeout(() => {
      router.push({ path: '/pos/progress', query: { done: String(posId.value) } })
    }, 600)
  } catch (err: unknown) {
    statusVariant.value = 'error'
    statusMessage.value = (err as { data?: { statusMessage?: string } }).data?.statusMessage
      ?? 'Verifikasi gagal. Coba lagi!'
    statusIcon.value = 'warning'
  }
}

const handleScanQR = (value: string) => {
  // QR berisi code pos → masuk alur verify server yang sama
  password.value = value
  handleVerification()
}
</script>
