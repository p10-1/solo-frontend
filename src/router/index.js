import { createRouter, createWebHistory } from 'vue-router'
// 이게 각각의 page를 가져오는 것
import Home from '../pages/HomePage.vue'
import Callback from '@/pages/auth/CallbackPage.vue'
import Board from '../pages/board/BoardPage.vue'
import Asset from '../pages/asset/AssetPage.vue'
import MyPage from '../pages/auth/MyPage.vue'
import News from '../pages/news/NewsPage.vue'
import Policy from '../pages/policy/PolicyPage.vue'
import FirstUser from '@/pages/auth/FirstUser.vue'
import Login from '@/pages/auth/LoginPage.vue'
import Product from '@/pages/product/ProductPage.vue'
import boardRoutes from './board'
// 팀소개 추가
import SoloTeam from '@/pages/CreateSoloTeam.vue'
import { isAuthenticated } from '@/util/guard'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/callback',
      name: 'callback',
      component: Callback
    },
    {
      path: '/firstUser',
      name: 'FirstUser',
      component: FirstUser // 새 사용자 등록 페이지 컴포넌트
    },
    {
      path: '/board',
      name: 'board',
      component: Board
    },
    {
      path: '/asset',
      name: 'asset',
      component: Asset,
      beforeEnter: isAuthenticated
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
      path: '/soloTeam',
      name: 'soloTeam',
      component: SoloTeam
    },
    {
      path: '/policy',
      name: 'policy',
      component: Policy,
      beforeEnter: isAuthenticated
    },
    {
      path: '/product',
      name: 'product',
      component: Product,
      beforeEnter: isAuthenticated
    },
    ...boardRoutes
  ],
  scrollBehavior() {
    // 항상 상단으로 스크롤
    return { top: 0 }
  }
})

export default router
