<template>
  <h2 class="title">신규 정보 등록</h2>
  <div class="col-md-6 center-box">
    <div class="card shadow-sm">
      <div class="card-header text-center">
        <h2>정보를 입력해 주세요</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="registerUser">
          <div class="mb-3">
            <!-- <label for="userName" class="form-label">닉네임:</label> -->
            <div class="input-group full-width">
              <label for="userName" class="input-label">닉네임</label>
              <!-- <div class="search-bar">닉네임</div> -->
              <input type="text" v-model="userName" class="form-control" id="userName" required />
              <button type="button" class="button-sub" @click="check" :disabled="isChecking">
                닉네임 중복 확인
              </button>
            </div>
            <div class="form-text text-muted mt-1 user-name-message">
              <span v-if="userNameCheckMessage">{{ userNameCheckMessage }}</span>
            </div>
          </div>

          <div class="input-group full-width">
            <label for="birthdate" class="input-label">생년월일</label>
            <!-- <label for="birthdate" class="form-label">생년월일:</label> -->
            <!-- <div class="search-bar">생년월일</div> -->
            <input type="date" v-model="birthdate" class="form-control" id="birthdate" required />
          </div>

          <div class="d-grid">
            <button type="submit" class="button-main" :disabled="!isuserNameAvailable">제출</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-header {
  background-color: #fff;
  box-shadow: 0px 0px 10px rgb(221, 214, 255);
}
.card-header h2 {
  font-size: 1.75rem;
  color: #333;
  font-weight: 500; /* 폰트 두께를 얇게 설정100~900 */
}
.card-body {
  padding: 35px 30px 16px 30px;
}
.input-group .form-control {
  border: 2px solid #cfc6fd;
  background: #e8f0fe;
  border-radius: 12px !important;

  height: 45px; /* 원하는 높이 값 */
  font-size: 17px; /* 글자 크기 조정 */
  padding: 10px 15px; /* 내부 여백 조정 */
}
.d-grid {
  display: flex;
  justify-content: center;
  margin: 20px 0px 10px 0px;
}
.user-name-message {
  text-align: left; /* 메시지를 왼쪽 정렬 */
  margin-left: 60px; /* 메시지를 입력창과 가까이 맞춤 */
  font-size: 14px; /* 메시지 글자 크기 조정 */
}
.full-width {
  width: 100%;
  display: flex;
  align-items: center;
}
.box-title {
  display: flex;
  justify-content: center;
}
.first-user-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
}
.col-md-6 {
  margin: 0 auto;
  width: 70%;
  padding: 32px 32px;
  border-radius: 12px;
  text-align: center;
  background-color: #cfc6fd;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
  transition: all 0.3s;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  cursor: pointer;
}
.form-box {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 500px;
}

.form-header {
  text-align: center;
  margin-bottom: 20px;
}

.form-header h2 {
  font-size: 1.75rem;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
}

.input-group {
  display: flex;
  gap: 10px;
}

.feedback {
  font-size: 0.875rem;
}

.text-success {
  color: green;
}

.text-danger {
  color: red;
}

.d-grid .btn-success {
  text-align: center;
  background-color: #6846f5;
  border: none;
  padding: 10px 0;
  font-size: 1rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  width: 150px; /* 버튼의 너비 조절 */
  height: 40px; /* 버튼의 높이 조절 */
  padding: 10px 20px; /* 내부 여백 조절 */
  font-size: 16px; /* 글자 크기 조절 */
  border-radius: 25px; /* 둥근 모서리 유지 */
  justify-content: center; /* 가로 중앙 정렬 */
}

.btn-success:hover {
  background-color: #502fd4;
  cursor: pointer;
}

.btn-outline-primary:hover {
  background-color: #6846f5;
  color: #fff;
}
</style>

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

<style scoped>
.card-header {
  background-color: #fff;
  box-shadow: 0px 0px 10px rgb(221, 214, 255);
}
.card-header h2 {
  font-size: 1.75rem;
  color: #333;
  font-weight: 500; /* 폰트 두께를 얇게 설정100~900 */
}
.card-body {
  padding: 35px 30px 16px 30px;
}
.input-group .form-control {
  border: 2px solid #cfc6fd;
  background: #e8f0fe;
  border-radius: 12px !important;

  height: 45px; /* 원하는 높이 값 */
  font-size: 17px; /* 글자 크기 조정 */
  padding: 10px 15px; /* 내부 여백 조정 */
}
.d-grid {
  display: flex;
  justify-content: center;
  margin: 20px 0px 10px 0px;
}
.user-name-message {
  text-align: left; /* 메시지를 왼쪽 정렬 */
  margin-left: 60px; /* 메시지를 입력창과 가까이 맞춤 */
  font-size: 14px; /* 메시지 글자 크기 조정 */
}
.full-width {
  width: 100%;
  display: flex;
  align-items: center;
}
.box-title {
  display: flex;
  justify-content: center;
}
.first-user-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
}
.col-md-6 {
  margin: 0 auto;
  width: 70%;
  padding: 32px 32px;
  border-radius: 12px;
  text-align: center;
  background-color: #cfc6fd;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
  transition: all 0.3s;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  cursor: pointer;
}
.form-box {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 500px;
}

.form-header {
  text-align: center;
  margin-bottom: 20px;
}

.form-header h2 {
  font-size: 1.75rem;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
}

.input-group {
  display: flex;
  gap: 10px;
}

.feedback {
  font-size: 0.875rem;
}

.text-success {
  color: green;
}

.text-danger {
  color: red;
}

.d-grid .btn-success {
  text-align: center;
  background-color: #6846f5;
  border: none;
  padding: 10px 0;
  font-size: 1rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  width: 150px; /* 버튼의 너비 조절 */
  height: 40px; /* 버튼의 높이 조절 */
  padding: 10px 20px; /* 내부 여백 조절 */
  font-size: 16px; /* 글자 크기 조절 */
  border-radius: 25px; /* 둥근 모서리 유지 */
  justify-content: center; /* 가로 중앙 정렬 */
}

.btn-success:hover {
  background-color: #502fd4;
  cursor: pointer;
}

.btn-outline-primary:hover {
  background-color: #6846f5;
  color: #fff;
}
</style>
