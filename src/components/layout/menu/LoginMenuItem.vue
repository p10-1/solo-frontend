<template>
  <button @click="goTologin" class="button-main">로그인</button>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goTologin = () => {
  router.push({ name: 'login' })
}
</script>

<!-- <template>
  <a href="#" class="button-main" @click.prevent="login">
    {{ isProcessing ? '로그인 중...' : '로그인' }}
  </a>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { loginWithKakao, handleLoginCallback } from '@/api/authApi.js'

const isProcessing = ref(false)

// 로그인 함수
const login = () => {
  isProcessing.value = true // 로그인 처리 중 상태로 변경
  loginWithKakao()
}

// onMounted 훅에서 URL 파라미터 확인
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  if (code) {
    handleLoginCallback(code)
      .then((response) => {
        console.log('Response data:', response.data)
        isProcessing.value = false
        if (response.data.status === 'newUser') {
          window.location.href = '/firstUser'
        } else {
          const userInfo = response.data
          if (userInfo) {
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
          } else {
            console.error('User info is undefined.')
          }
          window.location.href = '/'
        }
      })
      .catch((error) => {
        isProcessing.value = false // 로딩 종료
        console.error('Login failed:', error)
        alert('로그인에 실패했습니다. 다시 시도해 주세요.')
      })
  }
})
</script> -->
