<template>
  <div>
    <h1>신규 사용자 정보 입력</h1>
    <form @submit.prevent="registerUser">
      <div>
        <label for="name">이름:</label>
        <input type="text" v-model="name" required />
      </div>
      <div>
        <label for="birthdate">생년월일:</label>
        <input type="date" v-model="birthdate" required />
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
      birthdate: ''
    }
  },
  methods: {
    async registerUser() {
      try {
        console.log('등록 정보:', this.name, this.birthdate) // 정보 확인
        const result = await registerFirstUser(this.name, this.birthdate)
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

<!-- <template>
  <div>
    <h1>신규 사용자 정보 입력</h1>
    <form @submit.prevent="registerUser">
      <div>
        <label for="nickname">닉네임:</label>
        <input type="text" v-model="nickname" required />
        <button type="button" @click="checkNickname" :disabled="isChecking">
          닉네임 중복 확인
        </button>
        <span v-if="nicknameCheckMessage">{{ nicknameCheckMessage }}</span>
      </div>
      <div>
        <label for="birthdate">생년월일:</label>
        <input type="date" v-model="birthdate" required />
      </div>
      <button type="submit" :disabled="!isNicknameAvailable">제출</button>
    </form>
  </div>
</template>

<script>
import { registerFirstUser, checkUsername } from '@/api/authApi' // 중복 확인 API 추가
import { useAuthStore } from '@/stores/authStore'
export default {
  data() {
    return {
      nickname: '',
      birthdate: '',
      isNicknameAvailable: false,
      isChecking: false,
      nicknameCheckMessage: ''
    }
  },
  methods: {
    async checkNickname() {
      this.isChecking = true
      try {
        const result = await checkUsername(this.nickname)
        if (result.data.available) {
          this.isNicknameAvailable = true
          this.nicknameCheckMessage = '사용 가능한 닉네임입니다.'
        } else {
          this.isNicknameAvailable = false
          this.nicknameCheckMessage = '이미 사용 중인 닉네임입니다.'
        }
      } catch (error) {
        console.error('닉네임 중복 확인 중 오류가 발생했습니다:', error)
        this.isNicknameAvailable = false
        this.nicknameCheckMessage = '오류가 발생했습니다. 다시 시도해주세요.'
      } finally {
        this.isChecking = false
      }
    },
    async registerUser() {
      if (!this.isNicknameAvailable) {
        alert('닉네임 중복 확인을 해주세요.')
        return
      }
      try {
        console.log('등록 정보:', this.nickname, this.birthdate)
        const result = await registerFirstUser(this.nickname, this.birthdate)
        const userInfo = result.data
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
</script> -->
