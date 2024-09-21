export default [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/HomePage.vue')
  },
  {
    path: '/join',
    name: 'join',
    component: () => import('../pages/auth/JoinPage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/auth/LoginPage.vue')
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('../pages/auth/LogoutPage.vue')
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
    component: () => import('../pages/auth/MyPage.vue')
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
