import { createRouter, createWebHistory } from 'vue-router'
// 이게 각각의 page를 가져오는 것
import Home from '../pages/HomePage.vue'
import Login from '../pages/auth/LoginPage.vue'
import Board from '../pages/board/BoardPage.vue'
import Asset from '../pages/asset/AssetPage.vue'
import MyPage from '../pages/auth/MyPage.vue'
import News from '../pages/news/NewsPage.vue'
import Policy from '../pages/policy/PolicyPage.vue'
import Join from '../pages/auth/JoinPage.vue'
import WritePage from '@/pages/board/WritePage.vue'
import PostDetailPage from '@/pages/board/PostDetailPage.vue'
import Logout from '../pages/auth/LogoutPage.vue' // 로그아웃 페이지 추가
import SignUpPage from '@/pages/auth/SignUpPage.vue'

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
      path: '/logout',
      name: 'logout',
      component: Logout // 로그아웃 시 해당 페이지로 이동
    },
    { path: '/signup', name: SignUpPage, component: SignUpPage },
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
    },
    {
      path: '/board/write',
      name: 'WritePage',
      component: WritePage
    },
    {
      path: '/board/:id',
      name: 'PostDetailPage',
      component: PostDetailPage
    }
  ]
})

// 전역 네비게이션 가드
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token')
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login') // 로그인 필요 시 로그인 페이지로 이동
  } else {
    next() // 계속 진행
  }
})
export default router
