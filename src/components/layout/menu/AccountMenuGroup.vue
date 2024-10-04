<script setup>
import AccountMenuItem from './AccountMenuItem.vue'
import LoginMenuItem from './LoginMenuItem.vue'
import LogoutMenuItem from './LogoutMenuItem.vue'
import { useAuthStore } from '@/stores/authStore'
import { computed } from 'vue'

const authStore = useAuthStore()

// 로그인 상태 확인
const isLogin = computed(() => authStore.isLoggedIn)
const username = computed(() => authStore.username)
</script>

<template>
  <div class="login-wrapper">
    <ul class="login-box">
      <template v-if="isLogin">
        <AccountMenuItem :username="username" />
        <LogoutMenuItem />
      </template>
      <template v-else>
        <LoginMenuItem />
      </template>
    </ul>
  </div>
</template>
<style scoped>
.login-wrapper {
  position: relative;
}
</style>
