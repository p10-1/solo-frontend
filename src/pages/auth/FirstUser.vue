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
                    @click="check"
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

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerFirstUser, checkuserName } from '@/api/authApi' // API import
import { useAuthStore } from '@/stores/authStore'

const userName = ref('')
const birthdate = ref('')
const isuserNameAvailable = ref(false)
const isChecking = ref(false)
const userNameCheckMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()

const check = async () => {
  isChecking.value = true
  try {
    const result = await checkuserName(userName.value)
    if (result.data) {
      isuserNameAvailable.value = true
      userNameCheckMessage.value = '사용 가능한 닉네임입니다.'
    } else {
      isuserNameAvailable.value = false
      userNameCheckMessage.value = '이미 사용 중인 닉네임입니다.'
    }
  } catch (error) {
    console.error('닉네임 중복 확인 중 오류가 발생했습니다:', error)
    isuserNameAvailable.value = false
    userNameCheckMessage.value = '오류가 발생했습니다. 다시 시도해주세요.'
  } finally {
    isChecking.value = false
  }
}

const registerUser = async () => {
  if (!isuserNameAvailable.value) {
    alert('닉네임 중복 확인을 해주세요.')
    return
  }
  try {
    console.log('등록 정보:', userName.value, birthdate.value)
    const result = await registerFirstUser(userName.value, birthdate.value)
    const userInfo = result.data
    authStore.setUserInfo(userInfo)
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    console.log('등록된 사용자:', result)
    router.push('/') // 홈으로 리다이렉트
  } catch (error) {
    console.error('사용자 등록 중 오류가 발생했습니다:', error)
  }
}
</script>
