// eslint-disable-next-line no-unused-vars
import MyPage from '@/pages/auth/MyPage.vue'

export default {
  title: '빚이 없는 솔로', // 메인 타이틀
  subtitle: '자산분석해조', // 서브 타이틀
  menus: [
    // 메인 메뉴 구성 정보
    {
      title: '자산',
      url: '/asset'
    },
    {
      title: '게시판',
      url: '/board',
      icon: 'fa-solid fa-paste'
    },
    {
      title: '뉴스',
      url: '/news'
    },
    {
      title: '정책',
      url: '/policy'
    },
    {
      title: '상품',
      url: '/product'
    }
  ],
  accoutMenus: {
    // 인증 관련 메뉴 정보
    login: {
      url: '/login',
      title: '마이페이지',
      icon: 'fa-solid fa-user' // 사용자 아이콘
    }
    // join: {
    //   url: '/logout',
    //   title: '로그아웃',
    //   icon: ''
    // }
  }
}
