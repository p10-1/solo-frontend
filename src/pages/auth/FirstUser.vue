<template>
  <div>
    <h1>신규 사용자 정보 입력</h1>
    <form @submit.prevent="registerUser">
      <div>
        <label for="name">이름:</label>
        <input type="text" v-model="name" required />
      </div>
      <div>
        <label for="birthDate">생년월일:</label>
        <input type="date" v-model="birthDate" required />
      </div>
      <button type="submit">제출</button>
    </form>
  </div>
</template>

<script>
import { registerFirstUser } from '@/api/authApi'
import { useAuthStore } from '@/stores/authStore'
export default {
  data() {
    return {
      name: '',
      birthDate: ''
    }
  },
  methods: {
    async registerUser() {
      try {
        console.log('등록 정보:', this.name, this.birthDate) // 정보 확인
        const result = await registerFirstUser(this.name, this.birthDate)
        // 사용자 등록 후 처리
        const userInfo = result.data // 사용자 정보를 응답에서 가져옵니다.
        // Pinia 스토어에 사용자 정보 저장
        const authStore = useAuthStore()
        authStore.setUserInfo(userInfo)

        sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
        console.log('등록된 사용자:', result)
        this.$router.push('/') // 홈으로 리다이렉트
      } catch (error) {
        console.error('사용자 등록 중 오류가 발생했습니다:', error)
      }
    }
  }
}
</script>
