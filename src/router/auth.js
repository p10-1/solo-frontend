export default [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/auth/Login.vue')
  },
  {
    path: '/board',
    name: 'board',
    component: () => import('../pages/board/Board.vue')
  },
  {
    path: '/asset',
    name: 'asset',
    component: () => import('../pages/asset/Asset.vue')
  },
  {
    path: '/auth/join',
    name: 'join',
    component: () => import('../pages/auth/JoinPage.vue')
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: () => import('../pages/auth/MyPage.vue')
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('../pages/news/News.vue')
  },
  {
    path: '/policy',
    name: 'policy',
    component: () => import('../pages/policy/Policy.vue')
  }
]
