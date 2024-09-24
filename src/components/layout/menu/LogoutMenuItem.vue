<template>
  <a href="#" class="nav-link" @click.prevent="logout">
    <i class="fa-solid fa-right-from-bracket"></i>
    로그아웃
  </a>
</template>

<script setup>
import { logoutWithKakao } from '@/api/authApi.js'

// 로그아웃 함수
const logout = async () => {
  // 로그아웃 API 호출
  await logoutWithKakao()
  // 세션 스토리지에서 사용자 정보 삭제
  sessionStorage.removeItem('userInfo')
}
</script>
