<script setup lang="ts">
definePageMeta({
  layout: 'login',
})

useHead({
  title: 'Login - DIKLAT 2026',
})

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''

  if (!username.value || !password.value) {
    error.value = 'Mohon isi semua field yang tersedia.'
    return
  }

  loading.value = true

  try {
    const user = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: username.value.trim(), password: password.value },
    })
    useToast().add({
      title: `Selamat datang, ${user.username}!`,
      description: `Anda login sebagai ${user.role === 'admin' ? 'Admin' : 'Ketua Post'}.`,
      color: 'success',
    })
    await navigateTo(user.role === 'admin' ? '/admin/tracking-murid' : '/ketua/panel')
  } catch (e: unknown) {
    const err = e as { statusCode?: number; statusMessage?: string }
    error.value = err?.statusMessage ?? 'Login gagal. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-[380px]">
    <div
      class="bg-white border border-[#111] rounded-2xl p-7 sm:p-8 relative"
      style="box-shadow: 0 1px 2px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)"
    >
      <div class="absolute -top-3 right-4 bg-[#0A5CFF] text-white text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
        SECURE AUTH
      </div>

      <div class="text-center mb-7 pt-2">
        <div class="inline-block border border-[#111] rounded px-2.5 py-0.5 mb-4">
          <span class="font-mono text-[10px] font-bold tracking-wider text-[#111]">SYSTEM // 2026.01</span>
        </div>
        <h1 class="font-display font-bold text-[28px] tracking-tight text-[#111] leading-none mb-1">DIKLAT 2026</h1>
        <p class="font-mono text-[11px] text-[#434656]">by Himpunan RPL</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-5">
          <div class="flex items-center justify-between mb-1">
            <h2 class="font-mono text-[12px] font-bold uppercase tracking-wider text-[#111]">LOGIN PANITIA</h2>
            <UIcon name="i-lucide-user" class="w-3.5 h-3.5 text-[#434656]" />
          </div>
          <p class="font-mono text-[10px] text-[#737688] mb-4">Committee access portal</p>

          <div class="space-y-3.5">
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="font-mono text-[10px] font-bold uppercase tracking-wider text-[#111]">USERNAME</label>
                <span class="font-mono text-[9px] text-[#737688] uppercase tracking-wider">PANITIA ID</span>
              </div>
              <input
                v-model="username"
                type="text"
                placeholder="Username"
                class="w-full h-10 px-3 rounded-lg border border-[#111] bg-white text-[13px] text-[#111] placeholder:text-[#737688] outline-none transition-all duration-150 focus:ring-2 focus:ring-[#0A5CFF]/20 focus:border-[#0A5CFF] font-[inherit]"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="font-mono text-[10px] font-bold uppercase tracking-wider text-[#111]">PASSWORD</label>
                <span class="font-mono text-[9px] text-[#737688] uppercase tracking-wider">MIN. 8 CHARS</span>
              </div>
              <input
                v-model="password"
                type="password"
                placeholder="Password"
                class="w-full h-10 px-3 rounded-lg border border-[#111] bg-white text-[13px] text-[#111] placeholder:text-[#737688] outline-none transition-all duration-150 focus:ring-2 focus:ring-[#0A5CFF]/20 focus:border-[#0A5CFF] font-[inherit]"
              />
            </div>
          </div>
        </div>

        <div
          v-if="error"
          class="flex items-center gap-2 bg-[#ffdad6] text-[#ff4b4b] rounded-lg px-3 py-2 mb-3 font-mono text-[11px] font-bold"
        >
          <UIcon name="i-lucide-alert-circle" class="w-3.5 h-3.5 shrink-0" />
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full h-11 rounded-xl text-white text-[13px] font-bold uppercase tracking-wider transition-all duration-150 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-mono"
          style="background: linear-gradient(135deg, #0A5CFF 0%, #0046CB 100%)"
        >
          <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ loading ? 'MEMPROSES...' : 'LOGIN' }}
          <span v-if="!loading" class="text-[16px] leading-none">&rarr;</span>
        </button>
      </form>

      <div class="flex items-center justify-between mt-5 pt-4 border-t border-[#e5e2e1]">
        <div class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]"></span>
          <span class="font-mono text-[9px] font-bold uppercase tracking-wider text-[#737688]">AUTH_NODE_01</span>
        </div>
        <span class="font-mono text-[9px] font-bold uppercase tracking-wider text-[#737688]">ENCRYPTED_PORT</span>
      </div>
    </div>
  </div>
</template>
