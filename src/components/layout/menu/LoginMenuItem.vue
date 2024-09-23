<template>
  <a href="#" class="nav-link" @click.prevent="login">
    <i class="fa-solid fa-right-from-bracket"></i>
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
        console.log('Response data:', response.data) // 응답 데이터 출력
        isProcessing.value = false // 로딩 종료
        if (response.data.status === 'newUser') {
          window.location.href = '/firstUser'
        } else {
          const userInfo = response.data
          console.log('User Info:', userInfo) // userInfo 출력
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
</script>
