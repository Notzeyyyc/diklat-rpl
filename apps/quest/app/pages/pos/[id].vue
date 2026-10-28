<template>
  <div class="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-start">
    <AppHeader />
    <main class="flex-1 flex flex-col w-full pt-20 px-gutter pb-safe bg-surface">
      <div class="flex flex-col w-full pb-20">
        <PuzzleHeader :posNumber="posId" statusText="Status: Misi Aktif • Sesi 01" />

        <PuzzleCard
          :currentSlide="currentSlide"
          puzzleCode="01001000 01000101 01001100 01001100 01001111"
          clueExample="01001000 = 72 = H"
          @nextSlide="currentSlide = 2"
          @prevSlide="currentSlide = 1"
        >
          <template #slide1>
            <PasswordInput v-model="password" label="MASUKKAN PASSWORD DARI PANITIA" placeholder="Contoh: RPLJUARA" />
            <ValidationMessage :message="statusMessage" :variant="statusVariant" :icon="statusIcon" />
            <button
              type="button"
              class="w-full mt-3 bg-primary-container text-on-primary py-4 px-6 rounded-lg text-label-btn tracking-wider uppercase border-[3px] border-on-surface shadow-[4px_4px_0px_#1c1b1b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1c1b1b] transition-all flex items-center justify-center gap-2 font-bold cursor-pointer"
              @click="handleVerification"
            >
              <span>VERIFIKASI PASSWORD</span>
              <span class="material-symbols-outlined text-[20px]">check_circle</span>
            </button>
          </template>
        </PuzzleCard>

        <QRScanner
          title="SCAN QR UNTUK LANJUT"
          description="Scan QR yang diberikan oleh penjaga pos untuk melanjutkan. (Fitur scan belum tersedia — demo saja.)"
          buttonText="DEMO"
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
const { completePos, isValidPos, isPosAvailable } = useGameState()

const posId = computed(() => Number(route.params.id))

// Route guard: id ga valid → 404. Pos terkunci (sebelumnya belum selesai) → balik ke daftar pos
if (!isValidPos(posId.value)) {
  throw createError({ statusCode: 404, statusMessage: 'Pos tidak ditemukan', fatal: true })
}
if (!isPosAvailable(posId.value)) {
  await navigateTo('/pos', { redirectCode: 302 })
}

const currentSlide = ref(1)
const password = ref('')
const statusMessage = ref('')
const statusVariant = ref<'success' | 'error'>('error')
const statusIcon = ref('')

const procedureSteps = [
  { bold: 'Baca puzzle', text: ' biner pada kartu di atas dengan teliti.' },
  { bold: 'Kunjungi pos fisik', text: ' di area Parkiran Kampus.' },
  { bold: 'Beritahu jawaban', text: ' langsung secara lisan ke panitia pos.' },
  { bold: 'Terima password', text: ' & masukkan ke kolom di atas untuk verifikasi.', highlight: true },
]

const handleVerification = () => {
  const val = password.value.trim().toUpperCase()

  if (!val) {
    statusVariant.value = 'error'
    statusMessage.value = 'Masukkan password dari panitia terlebih dahulu!'
    statusIcon.value = 'error'
    return
  }

  // ponytail: password hardcoded di frontend (game lapangan, belum ada backend).
  // Upgrade: pindah verifikasi ke server API pas backend jadi.
  if (val === 'RPLJUARA' || val === 'PARKIRAN26') {
    statusVariant.value = 'success'
    statusMessage.value = 'BERHASIL! Menuju halaman progres...'
    statusIcon.value = 'check_circle'
    completePos(posId.value)
    setTimeout(() => {
      router.push({ path: '/pos/progress', query: { done: String(posId.value) } })
    }, 600)
  } else {
    statusVariant.value = 'error'
    statusMessage.value = 'Password salah. Konfirmasi ke panitia di Pos!'
    statusIcon.value = 'warning'
  }
}

const handleScanQR = () => {
  // Stub jujur: belum ada kamera/verifikasi QR. Jangan pernah set success dari sini.
  statusVariant.value = 'error'
  statusMessage.value = 'Scan QR belum tersedia. Konfirmasi ke panitia pos untuk lanjut.'
  statusIcon.value = 'qr_code_scanner'
}
</script>
