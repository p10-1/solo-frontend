import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLogin: !!localStorage.getItem('token'), // 초기 상태: 토큰이 있으면 로그인 상태로 설정
    username: localStorage.getItem('username') || '' // 초기 상태: 토큰이 있으면 사용자명도 가져오기
  }),
  actions: {
    login(username, token) {
      this.isLogin = true
      this.username = username
      localStorage.setItem('token', token) // 토큰 저장
      localStorage.setItem('username', username) // 사용자명 저장
    },
    logout() {
      this.isLogin = false
      this.username = ''
      localStorage.removeItem('token') // 토큰 삭제
      localStorage.removeItem('username') // 사용자명 삭제
    }
  }
})
