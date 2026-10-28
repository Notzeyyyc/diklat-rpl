<script setup lang="ts">
definePageMeta({
  layout: 'ketua',
})

useHead({
  title: 'Akun - Ketua Post',
})

const user = ref({
  name: 'Siti Rahma',
  id: 'KTP-03-2026',
  role: 'Ketua Post Lapangan',
  pos: 'POS-03',
  email: 'siti.rahma@diklat2026.id',
  phone: '0812-3456-7890',
  joinDate: '2026-01-15',
})

const notifications = ref([
  { label: 'Notifikasi Push', description: 'Terima notifikasi langsung di browser', enabled: true },
  { label: 'Suara Panggilan', description: 'Aktifkan suara saat ada panggilan', enabled: true },
  { label: 'Email Alerts', description: 'Kirim alert ke email terdaftar', enabled: false },
  { label: 'Auto Refresh', description: 'Refresh data otomatis setiap 30 detik', enabled: true },
])

const isEditing = ref(false)
const editForm = ref({ ...user.value })

function saveProfile() {
  user.value = { ...editForm.value }
  isEditing.value = false
  useToast().add({
    title: 'Profil berhasil disimpan',
    description: 'Perubahan pada profil Anda telah tersimpan.',
    color: 'success',
  })
}

function cancelEdit() {
  editForm.value = { ...user.value }
  isEditing.value = false
}

function handleLogout() {
  useToast().add({
    title: 'Logout berhasil',
    description: 'Anda telah keluar dari sistem.',
    color: 'info',
  })
  navigateTo('/login')
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
            <UAvatar size="xl" :alt="user.name" class="neo-border-thick neo-shadow-lg mx-auto mb-4" />
            <h2 class="font-display font-bold text-xl tracking-tight">{{ user.name }}</h2>
            <p class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest mt-1">{{ user.id }}</p>
            <div class="mt-3">
              <StatusBadge :label="user.role" status="active" />
            </div>
          </div>

          <template #footer>
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-sm">
                <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-neo-primary shrink-0" />
                <span class="font-body">{{ user.pos }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <UIcon name="i-lucide-mail" class="w-4 h-4 text-neo-primary shrink-0" />
                <span class="font-body truncate">{{ user.email }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <UIcon name="i-lucide-phone" class="w-4 h-4 text-neo-primary shrink-0" />
                <span class="font-body">{{ user.phone }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <UIcon name="i-lucide-calendar" class="w-4 h-4 text-neo-primary shrink-0" />
                <span class="font-body">Bergabung {{ user.joinDate }}</span>
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
              size="sm"
              icon="i-lucide-pencil"
              class="neo-hover"
              @click="isEditing = true"
            >
              Edit
            </UButton>
          </template>

          <div v-if="isEditing" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant mb-2">
                  Nama Lengkap
                </label>
                <UInput v-model="editForm.name" placeholder="Nama" icon="i-lucide-user" />
              </div>
              <div>
                <label class="block font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant mb-2">
                  ID Panitia
                </label>
                <UInput v-model="editForm.id" placeholder="ID" icon="i-lucide-hash" disabled />
              </div>
              <div>
                <label class="block font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant mb-2">
                  Email
                </label>
                <UInput v-model="editForm.email" placeholder="Email" icon="i-lucide-mail" />
              </div>
              <div>
                <label class="block font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant mb-2">
                  No. Telepon
                </label>
                <UInput v-model="editForm.phone" placeholder="Telepon" icon="i-lucide-phone" />
              </div>
            </div>
            <div class="flex gap-3 justify-end">
              <UButton color="neutral" size="sm" class="neo-hover" @click="cancelEdit">Batal</UButton>
              <UButton color="primary" size="sm" icon="i-lucide-check" class="neo-hover" @click="saveProfile">Simpan</UButton>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-neo-outline-variant">
              <span class="font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Nama</span>
              <span class="font-display font-semibold text-sm">{{ user.name }}</span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-neo-outline-variant">
              <span class="font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">ID</span>
              <span class="font-mono text-xs neo-border rounded px-2 py-0.5 bg-neo-surface-container">{{ user.id }}</span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-neo-outline-variant">
              <span class="font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Role</span>
              <span class="font-body text-sm">{{ user.role }}</span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-neo-outline-variant">
              <span class="font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Pos</span>
              <span class="font-mono text-xs neo-border rounded px-2 py-0.5 bg-neo-primary-container text-white">{{ user.pos }}</span>
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
              <UButton color="neutral" size="sm" icon="i-lucide-key" class="neo-hover">Ubah</UButton>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-neo-outline-variant">
              <div>
                <div class="font-display font-semibold text-sm">Two-Factor Auth</div>
                <div class="font-mono text-[10px] text-neo-on-surface-variant">Belum diaktifkan</div>
              </div>
              <UButton color="neutral" size="sm" icon="i-lucide-smartphone" class="neo-hover">Aktifkan</UButton>
            </div>
            <div class="flex items-center justify-between py-3">
              <div>
                <div class="font-display font-semibold text-sm">Logout</div>
                <div class="font-mono text-[10px] text-neo-on-surface-variant">Keluar dari sesi ini</div>
              </div>
              <UButton color="danger" size="sm" icon="i-lucide-log-out" class="neo-hover" @click="handleLogout">Logout</UButton>
            </div>
          </div>
        </NeoCard>
      </div>
    </div>
  </div>
</template>
