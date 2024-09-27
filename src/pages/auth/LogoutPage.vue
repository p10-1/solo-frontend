<template>
  <div>로그아웃 중...</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 로그아웃 처리
authStore.logout()
router.push('/login')
</script>
