<script setup lang="ts">
import type { SessionUser } from '@diklat/shared'

definePageMeta({
  layout: 'ketua',
})

useHead({
  title: 'Akun - Ketua Post',
})

const { data: user } = await useFetch<SessionUser | null>('/api/auth/me')

const notifications = ref([
  { label: 'Notifikasi Push', description: 'Terima notifikasi langsung di browser', enabled: true },
  { label: 'Suara Panggilan', description: 'Aktifkan suara saat ada panggilan', enabled: true },
  { label: 'Email Alerts', description: 'Kirim alert ke email terdaftar', enabled: false },
  { label: 'Auto Refresh', description: 'Refresh data otomatis setiap 30 detik', enabled: true },
])

const isEditing = ref(false)

function cancelEdit() {
  isEditing.value = false
}

async function handleLogout() {
  await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
  useToast().add({
    title: 'Logout berhasil',
    description: 'Anda telah keluar dari sistem.',
    color: 'info',
  })
  await navigateTo('/login')
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      badge="AKUN"
      badge-color="primary"
      title="AKUN // PROFIL KETUA POST"
      description="Kelola informasi profil dan pengaturan akun Anda"
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Profile Card -->
      <div class="lg:col-span-1">
        <NeoCard>
          <div class="text-center">
            <UAvatar size="xl" :alt="user?.username ?? 'Ketua'" class="neo-border-thick neo-shadow-lg mx-auto mb-4" />
            <h2 class="font-display font-bold text-xl tracking-tight capitalize">{{ user?.username ?? 'Ketua' }}</h2>
            <p class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest mt-1">PANITIA 2026</p>
            <div class="mt-3">
              <StatusBadge :label="user?.role ?? 'ketua'" status="active" />
            </div>
          </div>

          <template #footer>
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-sm">
                <UIcon name="i-lucide-shield" class="w-4 h-4 text-neo-primary shrink-0" />
                <span class="font-body capitalize">{{ user?.role === 'admin' ? 'Administrator' : 'Ketua Post Lapangan' }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <UIcon name="i-lucide-calendar" class="w-4 h-4 text-neo-primary shrink-0" />
                <span class="font-body">Angkatan 2026</span>
              </div>
            </div>
          </template>
        </NeoCard>
      </div>

      <!-- Settings -->
      <div class="lg:col-span-2 space-y-5">
        <!-- Edit Profile -->
        <NeoCard title="EDIT PROFIL" icon="i-lucide-user" badge="PROFIL">
          <template #header>
            <UButton
              v-if="!isEditing"
              color="primary"
              size="md"
              icon="i-lucide-pencil"
              class="neo-hover"
              @click="isEditing = true"
            >
              Edit
            </UButton>
          </template>

          <div v-if="isEditing" class="space-y-5">
            <p class="font-mono text-[10px] text-neo-on-surface-variant uppercase">
              Profil panitia dikelola server — tidak dapat diubah dari sini.
            </p>
            <div class="flex gap-3 justify-end">
              <UButton color="neutral" size="md" class="neo-hover" @click="cancelEdit">Batal</UButton>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-neo-outline-variant">
              <span class="font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Nama</span>
              <span class="font-display font-semibold text-sm capitalize">{{ user?.username ?? 'Ketua' }}</span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-neo-outline-variant">
              <span class="font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Role</span>
              <span class="font-body text-sm capitalize">{{ user?.role ?? 'ketua' }}</span>
            </div>
          </div>
        </NeoCard>

        <!-- Notifications -->
        <NeoCard title="PENGATURAN NOTIFIKASI" icon="i-lucide-bell" badge="NOTIFIKASI">
          <div class="space-y-4">
            <div
              v-for="n in notifications"
              :key="n.label"
              class="flex items-center justify-between py-3 border-b border-neo-outline-variant last:border-0"
            >
              <div>
                <div class="font-display font-semibold text-sm">{{ n.label }}</div>
                <div class="font-mono text-[10px] text-neo-on-surface-variant">{{ n.description }}</div>
              </div>
              <UToggle v-model="n.enabled" color="primary" />
            </div>
          </div>
        </NeoCard>

        <!-- Security -->
        <NeoCard title="KEAMANAN AKUN" icon="i-lucide-shield" badge="SECURITY">
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-neo-outline-variant">
              <div>
                <div class="font-display font-semibold text-sm">Ubah Password</div>
                <div class="font-mono text-[10px] text-neo-on-surface-variant">Terakhir diubah 30 hari lalu</div>
              </div>
              <UButton color="neutral" size="md" icon="i-lucide-key" class="neo-hover">Ubah</UButton>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-neo-outline-variant">
              <div>
                <div class="font-display font-semibold text-sm">Two-Factor Auth</div>
                <div class="font-mono text-[10px] text-neo-on-surface-variant">Belum diaktifkan</div>
              </div>
              <UButton color="neutral" size="md" icon="i-lucide-smartphone" class="neo-hover">Aktifkan</UButton>
            </div>
            <div class="flex items-center justify-between py-3">
              <div>
                <div class="font-display font-semibold text-sm">Logout</div>
                <div class="font-mono text-[10px] text-neo-on-surface-variant">Keluar dari sesi ini</div>
              </div>
              <UButton color="danger" size="md" icon="i-lucide-log-out" class="neo-hover" @click="handleLogout">Logout</UButton>
            </div>
          </div>
        </NeoCard>
      </div>
    </div>
  </div>
</template>
