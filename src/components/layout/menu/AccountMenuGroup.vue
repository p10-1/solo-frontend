<template>
  <div>
    <ul class="navbar-nav ms-auto">
      <template v-if="isLogin">
        <AccountMenuItem :username="username" />
        <MenuItem v-for="menu in accountMenus" :key="menu.url" :menu="menu" />
      </template>
      <template v-else>
        <MenuItem v-for="menu in loginMenus" :key="menu.url" :menu="menu" />
      </template>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import MenuItem from './MenuItem.vue'
import AccountMenuItem from './AccountMenuItem.vue'
import config from '@/config'

const authStore = useAuthStore()

const isLogin = computed(() => authStore.isLogin)
const username = computed(() => authStore.username)

const { accoutMenus } = config
const loginMenus = computed(() => accoutMenus.filter((menu) => menu.url === '/login'))
const accountMenus = computed(() => accoutMenus.filter((menu) => menu.url !== '/login'))
</script>
