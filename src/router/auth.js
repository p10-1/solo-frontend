// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import LogoutView from '@/views/LogoutView.vue'
import CallbackView from '@/views/CallbackView.vue'
import FirstUserView from '@/views/FirstUserView.vue' // 새 사용자 등록 페이지
import HomeView from '@/views/HomeView.vue' // 홈 페이지

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutView
  },
  {
    path: '/callback',
    name: 'Callback',
    component: CallbackView
  },
  {
    path: '/firstUser',
    name: 'FirstUser',
    component: FirstUserView // 새 사용자 등록 페이지 컴포넌트
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
