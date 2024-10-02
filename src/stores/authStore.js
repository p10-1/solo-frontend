// stores/authStore.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || null // 세션 스토리지에서 사용자 정보 로드
  }),
  actions: {
    setUserInfo(user) {
      this.userInfo = user
      sessionStorage.setItem('userInfo', JSON.stringify(user)) // 세션 스토리지에 저장
    },
    clearUserInfo() {
      this.userInfo = null
      sessionStorage.removeItem('userInfo') // 세션 스토리지에서 제거
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.userInfo,
    username: (state) => (state.userInfo ? state.userInfo.userName : '')
    // userID: (state) => (state.userInfo ? state.userInfo.kakaoId : '')
  }
})
