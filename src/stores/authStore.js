// stores/authStore.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userInfo: null
  }),
  actions: {
    setUserInfo(user) {
      this.userInfo = user
    },
    clearUserInfo() {
      this.userInfo = null
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.userInfo,
    username: (state) => (state.userInfo ? state.userInfo.name : '')
  }
})
