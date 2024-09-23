import { createRouter, createWebHistory } from 'vue-router'
// 이게 각각의 page를 가져오는 것
import Home from '../pages/HomePage.vue'
// import Login from '../pages/auth/LoginPage.vue'
// import Logout from '../pages/auth/LogoutPage.vue'
import Board from '../pages/board/BoardPage.vue'
import Asset from '../pages/asset/AssetPage.vue'
import MyPage from '../pages/auth/MyPage.vue'
import News from '../pages/news/NewsPage.vue'
import Policy from '../pages/policy/PolicyPage.vue'
// import Join from '../pages/auth/JoinPage.vue'
import FirstUser from '@/pages/auth/FirstUser.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/firstUser',
      name: 'FirstUser',
      component: FirstUser // 새 사용자 등록 페이지 컴포넌트
    },
    // {
    //   path: '/join',
    //   name: 'join',
    //   component: Join
    // },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: Login
    // },
    // {
    //   path: '/logout',
    //   name: 'logout',
    //   component: Logout
    // },
    {
      path: '/board',
      name: 'board',
      component: Board
    },
    {
      path: '/asset',
      name: 'asset',
      component: Asset
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: MyPage
    },
    {
      path: '/news',
      name: 'news',
      component: News
    },
    {
      path: '/policy',
      name: 'policy',
      component: Policy
    }
  ]
})

export default router
