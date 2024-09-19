export default {
  title: '빚 없는 솔로', // 메인 타이틀
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
    }
  ],
  accoutMenus: {
    // 인증 관련 메뉴 정보
    login: {
      url: '/login',
      title: '로그인',
      icon: 'fa-solid fa-right-to-bracket'
    },
    join: {
      url: '/join',
      title: '회원가입',
      icon: 'fa-solid fa-user-plus'
    }
  }
}
