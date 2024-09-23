// eslint-disable-next-line no-unused-vars
import { defineStore } from 'pinia'

export default {
  title: '빚이 없는 솔로', // 메인 타이틀
  subtitle: '자산분석해조', // 서브 타이틀
  menus: [
    // 메인 메뉴 구성 정보
    {
      title: '자산',
      url: '/asset',
      icon: 'fa-solid fa-chart-line' // 자산 증가를 나타내는 차트 아이콘
    },
    {
      title: '게시판',
      url: '/board',
      icon: 'fa-solid fa-clipboard' // 클립보드 아이콘
    },
    {
      title: '뉴스',
      url: '/news',
      icon: 'fa-solid fa-newspaper' // 신문 아이콘
    },
    {
      title: '정책',
      url: '/policy',
      icon: 'fa-solid fa-gavel' // 정책을 나타내는 망치 아이콘
    }
  ],
  accoutMenus: {
    // 인증 관련 메뉴 정보
    login: {
      url: '/login',
      title: '마이페이지',
      icon: 'fa-solid fa-user' // 사용자 아이콘
    },

    // join: {
    //   url: '/logout',
    //   title: '로그아웃',
    //   icon: ''
    // }
  }
}
