import { createRouter, createWebHistory } from 'vue-router'
// 이게 각각의 page를 가져오는 것
import Home from '../pages/HomePage.vue'
import Login from '../pages/auth/LoginPage.vue'
import Board from '../pages/board/BoardPage.vue'
import Asset from '../pages/asset/AssetPage.vue'
import MyPage from '../pages/auth/MyPagePage.vue'
import News from '../pages/news/NewsPage.vue'
import Policy from '../pages/policy/PolicyPage.vue'
import Join from '../pages/auth/JoinPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/join',
      name: 'join',
      component: Join
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
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
