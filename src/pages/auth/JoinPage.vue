<template>
  <div>
    <h1>회원가입</h1>
    <form @submit.prevent="join">
      <input v-model="username" placeholder="아이디" />
      <input type="password" v-model="password" placeholder="비밀번호" />
      <button type="submit">회원가입</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')

const join = () => {
  console.log(`회원가입: ${username.value}`)
  // 회원가입 로직 (실제 서버 통신을 여기에)
}
</script>
