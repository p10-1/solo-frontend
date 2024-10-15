<template>
  <div class="join-container">
    <h2 class="title text-align-center">신규 가입</h2>
    <div class="join-body">
      <div class="join-content">
        <form @submit.prevent="registerUser">
          <div>
            <ul>
              <li><label for="userName" class="input-label">닉네임</label></li>
              <li>
                <input
                  type="text"
                  v-model="userName"
                  class="form-control basic-input"
                  id="userName"
                  placeholder="닉네임을 입력하세요."
                  maxlength="25"
                  required
                />
                <button
                  type="button"
                  class="button-sub button-input"
                  @click="check"
                  :disabled="isChecking"
                >
                  중복 확인
                </button>
              </li>
            </ul>
            <ul>
              <li></li>
              <li>
                <span class="error" v-if="userNameCheckMessage">{{ userNameCheckMessage }}</span>
              </li>
            </ul>
            <ul>
              <li>
                <label for="birthdate" class="input-label">생년월일</label>
              </li>
              <li>
                <input
                  type="date"
                  v-model="birthdate"
                  class="form-control basic-input"
                  id="birthdate"
                  required
                />
              </li>
            </ul>
            <button
              type="submit"
              class="button-main margin-top-2rem"
              :disabled="!isuserNameAvailable"
            >
              회원 가입
            </button>
          </div>
        </form>
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
    router.push('/mypage') // 홈으로 리다이렉트
    //router.push('/') // 홈으로 리다이렉트
  } catch (error) {
    console.error('사용자 등록 중 오류가 발생했습니다:', error)
  }
}
</script>

<style scoped>
.join-container h2.title {
  border-bottom: 0;
  margin-bottom: 15px;
}
.join-content {
  width: 48%;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 25px;
  text-align: center;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
}
.join-content ul {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.join-content ul li {
  display: flex;
  width: 100%;
}
.join-content ul li:first-child {
  flex: 0 0 20%;
}
.join-content ul li .input-label {
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: -1.2px;
}
.join-content .basic-input {
  padding: 0.375rem 0.75rem;
  border: 2px solid #e4deff;
  background-color: #e4deff;
  border-radius: 12px;
  font-size: 1rem;
  letter-spacing: -1px;
  cursor: pointer;
}
.join-content .button-input {
  margin-left: 5px;
  text-wrap: nowrap;
  width: 100px;
  padding: 12px 20px;
  line-height: 1;
  border-radius: 12px;
  color: #fff;
  background-color: #6846f5;
  border: 1px solid #6846f5;
}

.join-content ul li .error {
  font-size: 1rem;
  font-weight: 400;
  padding: 0;
  margin-top: -15px;
}
.join-content .button-main {
}
</style>
