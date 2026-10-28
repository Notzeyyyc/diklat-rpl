<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { SessionUser } from '@diklat/shared'

const { data: user } = useFetch<SessionUser | null>('/api/auth/me')

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
  useToast().add({ title: 'Sampai jumpa!', description: 'Anda telah keluar.', color: 'neutral' })
  await navigateTo('/login')
}

const items: NavigationMenuItem[][] = [
  [
    {
      label: 'Tracking Murid',
      icon: 'i-lucide-users',
      to: '/admin/tracking-murid',
    },
    {
      label: 'Leaderboard',
      icon: 'i-lucide-trophy',
      to: '/admin/leaderboard',
    },
    {
      label: 'Tracking Pos',
      icon: 'i-lucide-map-pin',
      to: '/admin/tracking-pos',
    },
  ],
]
</script>

<template>
  <UDashboardGroup storage-key="admin-dashboard">
    <UDashboardSidebar
      :menu="{ modal: false }"
      :collapsible="false"
      resizable
      :min-size="15"
      :default-size="22"
      :max-size="30"
      :ui="{
        root: 'neo-sidebar bg-white relative hidden lg:flex flex-col min-h-svh min-w-16 w-(--width) shrink-0',
        header: 'neo-sidebar-header px-6 py-5',
        footer: 'neo-sidebar-footer px-4 py-4',
      }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-neo-primary neo-border-thick neo-shadow-sm flex items-center justify-center shrink-0">
            <span class="text-white font-mono font-bold text-sm">D</span>
          </div>
          <div class="flex flex-col">
            <span class="font-display font-bold text-sm tracking-tight uppercase">DIKLAT 2026</span>
            <span class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest">Himpunan RPL</span>
          </div>
        </div>
      </template>

      <template #default>
        <div class="px-3 py-2">
          <div class="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant px-2">
            Main Navigation
          </div>
          <UNavigationMenu
            :items="items[0]"
            orientation="vertical"
            highlight
            tooltip
            :ui="{ link: 'min-h-11' }"
          />
        </div>
      </template>

      <template #footer>
        <div class="space-y-3">
          <div class="neo-border-thick neo-shadow-sm rounded-lg p-3 bg-neo-surface-container">
            <div class="flex items-center justify-between mb-2">
              <span class="font-mono text-[10px] font-bold uppercase tracking-widest text-neo-on-surface-variant">Server Runtime</span>
              <span class="px-1.5 py-0.5 bg-neo-success neo-border rounded font-mono text-[9px] font-bold">PROD</span>
            </div>
            <div class="font-mono text-[10px] text-neo-on-surface-variant leading-relaxed">
              Node: v2.6.4-prod<br>
              Sync: SSE Active
            </div>
          </div>
          <div class="flex items-center gap-3">
            <UAvatar size="md" :alt="user?.username ?? 'Admin'" class="neo-border neo-shadow-sm" />
            <div class="flex flex-col min-w-0">
              <span class="font-display font-semibold text-sm truncate capitalize">{{ user?.username ?? 'Admin' }}</span>
              <span class="font-mono text-[10px] text-neo-on-surface-variant truncate">Administrator</span>
            </div>
          </div>
          <UButton color="neutral" variant="ghost" size="md" icon="i-lucide-log-out" block class="neo-hover" @click="logout">
            Logout
          </UButton>
        </div>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar toggle-side="left" class="neo-border-b-3 neo-shadow-header bg-white" />
      </template>

      <template #body>
        <div class="max-w-[1400px] mx-auto p-6 lg:p-8 space-y-8">
          <slot />
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
