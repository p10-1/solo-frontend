<template>
  <a href="#" class="nav-link" @click.prevent="logout">
    <i class="fa-solid fa-right-from-bracket"></i>
    로그아웃
  </a>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  localStorage.removeItem('token') // 로그아웃 시 토큰 삭제
  router.push('/login') // 로그인 페이지로 리다이렉트
}
</script>
