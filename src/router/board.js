// import { isAuthenticated } from '@/util/guards'
import BoardDetail from '@/components/CommunityPage/BoardDetail.vue'
import BoardList from '@/components/CommunityPage/BoardList.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/board/',
    name: 'board/list',
    component: BoardList
  },
  {
    path: 'board/detail/:no',
    name: 'board/detail',
    component: BoardDetail
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
//   {
//     path: '/board/create',
//     name: 'board/create',
//     component: () => import('@/components/CommunityPage/')
//     // beforeEnter: isAuthenticated,
//   },
//   {
//     path: '/board/update/:no',
//     name: 'board/update',
//     component: () => import('../pages/board/BoardUpdatePage.vue')
//     // beforeEnter: isAuthenticated,
//   }
