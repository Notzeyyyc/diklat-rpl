<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[][] = [
  [
    {
      label: 'Post Saya',
      icon: 'i-lucide-layout-grid',
      to: '/ketua/panel',
    },
    {
      label: 'Riwayat Penilaian',
      icon: 'i-lucide-clipboard-list',
      to: '/ketua/riwayat',
    },
    {
      label: 'Akun',
      icon: 'i-lucide-user',
      to: '/ketua/akun',
    },
  ],
]
</script>

<template>
  <UDashboardGroup storage-key="ketua-dashboard">
    <UDashboardSidebar
      open
      :collapsible="false"
      resizable
      :menu="{ modal: false }"
      :min-size="15"
      :default-size="22"
      :max-size="30"
      :ui="{
        root: 'neo-sidebar bg-white relative flex flex-col min-h-svh min-w-16 w-(--width) shrink-0',
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
            <span class="font-mono text-[10px] text-neo-on-surface-variant uppercase tracking-widest">Ketua Post</span>
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
          />
        </div>
      </template>

      <template #footer>
        <div class="flex items-center gap-3">
          <UAvatar size="sm" alt="Ketua" class="neo-border neo-shadow-sm" />
          <div class="flex flex-col min-w-0">
            <span class="font-display font-semibold text-sm truncate">Siti Rahma</span>
            <span class="font-mono text-[10px] text-neo-on-surface-variant truncate">KTP-03-2026</span>
          </div>
        </div>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar :toggle="false" class="neo-border-b-3 neo-shadow-header bg-white" />
      </template>

      <template #body>
        <div class="max-w-[1400px] mx-auto p-6 lg:p-8 space-y-8">
          <slot />
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
