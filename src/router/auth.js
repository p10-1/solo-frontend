export default [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/HomePage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/auth/LoginPage.vue')
  },
  {
    path: '/board',
    name: 'board',
    component: () => import('../pages/board/BoardPage.vue')
  },
  {
    path: '/asset',
    name: 'asset',
    component: () => import('../pages/asset/AssetPage.vue')
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: () => import('../pages/auth/MyPagePage.vue')
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('../pages/news/NewsPage.vue')
  },
  {
    path: '/policy',
    name: 'policy',
    component: () => import('../pages/policy/PolicyPage.vue')
  }
]
