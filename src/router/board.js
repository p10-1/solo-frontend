// import { isAuthenticated } from '@/util/guards'
import BoardDetail from '@/components/CommunityPage/BoardDetail.vue'
import Board from '@/pages/board/BoardPage.vue'
import BoardCreate from '@/components/CommunityPage/BoardCreate.vue'
import BoardUpdate from '@/components/CommunityPage/BoardUpdate.vue'
import { isAuthenticated } from '@/util/guard'

const routes = [
  {
    path: '/board',
    name: 'board',
    component: Board
  },
  {
    path: '/board/detail/:boardNo',
    name: 'board/detail',
    component: BoardDetail,
    props: true
  },
  {
    path: '/board/create',
    name: 'board/create',
    component: BoardCreate,
    beforeEnter: isAuthenticated
  },
  {
    path: '/board/update/:boardNo',
    name: 'board/update',
    component: BoardUpdate,
    beforeEnter: isAuthenticated
  }
]
// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })
export default routes
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
