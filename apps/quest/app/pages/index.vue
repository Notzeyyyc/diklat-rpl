<template>
  <div class="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-start">
    <AppHeader />
    <main class="flex-1 flex flex-col w-full pt-20 px-gutter pb-safe bg-surface">
      <div class="flex flex-col w-full items-center px-space-xs relative justify-center flex-1 my-auto py-space-xl">
        <div class="w-full max-w-[24rem] flex flex-col items-center">
          <StatusRibbon label="CHECK-IN SYSTEM AKTIF" icon="qr_code_scanner" />

          <RegistrationCard
            stepLabel="STEP 01 / REGISTRASI KELOMPOK"
            title="IDENTITAS REGU"
            description="Gunakan nama regu resmi sesuai dengan pembagian mentor lapangan."
            flowText="Scan QR ➜ Masukkan Nama ➜ Mulai Misi Pos-to-Pos"
          >
            <form class="w-full flex flex-col items-center gap-space-md" @submit.prevent="handleSubmit">
              <FormInput v-model="groupName" placeholder="Masukkan Nama Kelompok" :error="showError" />
              <FormHint :error="showError" :errorMessage="errorMessage" hint="Minimal 3 karakter alfanumerik" />
              <FormButton text="NEXT" icon="arrow_forward" :loading="isSubmitting" loadingText="MENYIMPAN..." />
            </form>
          </RegistrationCard>

          <StatusIndicator text="SYSTEM READY • PROTOKOL 2026" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { registerGroup } = useGameState()

const groupName = ref('')
const showError = ref(false)
const errorMessage = ref('')
const isSubmitting = ref(false)

const handleSubmit = () => {
  const name = groupName.value.trim()

  if (name.length < 3) {
    showError.value = true
    errorMessage.value = 'Nama kelompok terlalu pendek!'
    return
  }

  if (!/^[A-Za-z0-9 ]+$/.test(name)) {
    showError.value = true
    errorMessage.value = 'Nama hanya boleh huruf, angka, dan spasi!'
    return
  }

  isSubmitting.value = true

  setTimeout(() => {
    registerGroup(name)
    router.push('/pos')
  }, 600)
}
</script>
