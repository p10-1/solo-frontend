import { createRouter, createWebHistory } from 'vue-router'
// 이게 각각의 page를 가져오는 것
import Home from '../pages/Home.vue'
import Login from '../pages/auth/Login.vue'
import Board from '../pages/board/Board.vue'
import Asset from '../pages/asset/Asset.vue'
import MyPage from '../pages/auth/MyPage.vue'
import News from '../pages/news/News.vue'
import Policy from '../pages/policy/Policy.vue'

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
