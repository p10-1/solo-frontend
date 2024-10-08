<template>
  <a href="#" class="button-main log-out-button" @click.prevent="logout"> 로그아웃 </a>
  <!-- <router-link class="button-main" to="board/create">글쓰기</router-link> -->
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

<style scope>
.log-out-button {
  margin-left: 2rem;
}
</style>
