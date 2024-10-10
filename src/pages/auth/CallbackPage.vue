<template>
  <div>로그인 처리 중...</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { handleLoginCallback } from '@/api/authApi'

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  if (code) {
    handleLoginCallback(code)
      .then((response) => {
        console.log('Response data:', response.data)
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
        console.error('Login failed:', error)
        alert('로그인에 실패했습니다. 다시 시도해 주세요.')
      })
  } else {
    console.error('Code not found in URL')
  }
})
</script>
