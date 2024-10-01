<template>
  <div>
    <h1>회원가입 페이지</h1>
    <form @submit.prevent="signup">
      <input v-model="newUsername" placeholder="아이디" />
      <input type="password" v-model="newPassword" placeholder="비밀번호" />
      <button type="submit">회원가입</button>
    </form>

    <p v-if="signupMessage">{{ signupMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const newUsername = ref('')
const newPassword = ref('')
const signupMessage = ref('')
const router = useRouter()

const signup = async () => {
  try {
    // 새로운 사용자 정보를 서버에 POST 요청으로 추가
    const newUser = {
      username: newUsername.value,
      password: newPassword.value
    }
    const response = await axios.post('http://localhost:3000/users', newUser)

    if (response.status === 201) {
      signupMessage.value = '회원가입 성공! 이제 로그인해 주세요.'
      // 회원가입 성공 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push('/login')
      }, 2000) // 2초 후 이동
    } else {
      signupMessage.value = '회원가입에 실패했습니다. 다시 시도해 주세요.'
    }
  } catch (error) {
    signupMessage.value = '회원가입 중 오류가 발생했습니다.'
    console.error('회원가입 오류:', error)
  }
}
</script>

<style scoped>
/* 필요에 따라 스타일 추가 */
</style>
