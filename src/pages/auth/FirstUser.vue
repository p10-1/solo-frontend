<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header text-center">
            <h2>신규 사용자 정보 입력</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="registerUser">
              <div class="mb-3">
                <label for="userName" class="form-label">닉네임:</label>
                <div class="input-group">
                  <input
                    type="text"
                    v-model="userName"
                    class="form-control"
                    id="userName"
                    required
                  />
                  <button
                    type="button"
                    class="btn btn-outline-primary"
                    @click="checkuserName"
                    :disabled="isChecking"
                  >
                    닉네임 중복 확인
                  </button>
                </div>
                <div class="form-text text-muted mt-1">
                  <span v-if="userNameCheckMessage">{{ userNameCheckMessage }}</span>
                </div>
              </div>

              <div class="mb-3">
                <label for="birthdate" class="form-label">생년월일:</label>
                <input
                  type="date"
                  v-model="birthdate"
                  class="form-control"
                  id="birthdate"
                  required
                />
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-success" :disabled="!isuserNameAvailable">
                  제출
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { registerFirstUser, checkuserName } from '@/api/authApi' // 중복 확인 API 추가
import { useAuthStore } from '@/stores/authStore'
export default {
  data() {
    return {
      userName: '',
      birthdate: '',
      isuserNameAvailable: false,
      isChecking: false,
      userNameCheckMessage: ''
    }
  },
  methods: {
    async checkuserName() {
      this.isChecking = true
      try {
        const result = await checkuserName(this.userName)
        if (result.data) {
          this.isuserNameAvailable = true
          this.userNameCheckMessage = '사용 가능한 닉네임입니다.'
        } else {
          this.isuserNameAvailable = false
          this.userNameCheckMessage = '이미 사용 중인 닉네임입니다.'
        }
      } catch (error) {
        console.error('닉네임 중복 확인 중 오류가 발생했습니다:', error)
        this.isuserNameAvailable = false
        this.userNameCheckMessage = '오류가 발생했습니다. 다시 시도해주세요.'
      } finally {
        this.isChecking = false
      }
    },
    async registerUser() {
      if (!this.isuserNameAvailable) {
        alert('닉네임 중복 확인을 해주세요.')
        return
      }
      try {
        console.log('등록 정보:', this.userName, this.birthdate)
        const result = await registerFirstUser(this.userName, this.birthdate)
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
</script>
