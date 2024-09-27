<template>
  <div>
    <h1>로그인 페이지</h1>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="아이디" />
      <input type="password" v-model="password" placeholder="비밀번호" />
      <button type="submit">로그인</button>
    </form>
    <button @click="goToSignup">회원가입</button>
    <!-- 회원가입 버튼 -->

    <!-- Show error message if login fails -->
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

// Define the necessary variables
const username = ref('')
const password = ref('')
const errorMessage = ref('') // Error message to handle login failure

const router = useRouter()
const authStore = useAuthStore()

const login = async () => {
  try {
    // 로그인 시도
    await authStore.login({ username: username.value, password: password.value })
    router.push('/') // 성공 시 홈으로 리다이렉트
  } catch (error) {
    errorMessage.value = '로그인에 실패했습니다. 다시 시도해주세요.' // 에러 발생 시 메시지 설정
  }
}
// 회원가입 페이지로 이동
const goToSignup = () => {
  router.push('/signup')
}
</script>
<style scoped>
.login-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
</style>
