<script setup>
import { reactive, computed } from 'vue'
import config from '@/config/menu'
import MenuGroup from './menu/MenuGroup.vue'
import AccountMenuGroup from './menu/AccountMenuGroup.vue'

let state = reactive({ isNavShow: false }) // 초기값 false로 설정

let navClass = computed(() => (state.isNavShow ? 'navbar-collapse show' : 'navbar-collapse'))

const toggleNavShow = () => {
  state.isNavShow = !state.isNavShow
}

const isMobile = computed(() => window.innerWidth <= 767) // 모바일 체크
</script>

<template>
  <nav :class="['navigation', { scrolled: isScrolled }]">
    <div class="navi-icon">
      <router-link to="/" class="logo">
        <img src="../../assets/images/logo2.png" />
      </router-link>
    </div>

    <!-- PC 메뉴, 모바일에서는 조건부로 숨기기 -->
    <div
      class="menu-box"
      :class="navClass"
      id="collapsibleNavbar"
      v-show="!isMobile || state.isNavShow"
    >
      <MenuGroup :menus="config.menus" />
    </div>

    <!-- 오른쪽 로그인 -->
    <AccountMenuGroup />

    <!-- 모바일 메뉴 버튼 -->
    <button class="navbar-toggler" type="button" @click="toggleNavShow">
      <span class="navbar-toggler-icon"><i class="fa-solid fa-bars"></i></span>
    </button>

    <button
      v-if="state.isNavShow"
      class="navbar-toggler mobile-nav-button"
      type="button"
      @click="toggleNavShow"
    >
      <span class="navbar-toggler-icon">
        <i class="fa-solid fa-xmark"></i>
      </span>
    </button>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isScrolled: false // 스크롤 상태를 저장하는 변수
    }
  },
  methods: {
    handleScroll() {
      // 스크롤 위치가 50 이상일 때 배경색 변경
      if (window.scrollY > 50) {
        this.isScrolled = true
      } else {
        this.isScrolled = false
      }
    }
  },
  mounted() {
    // 컴포넌트가 마운트된 후 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', () => {
      this.$forceUpdate() // 화면 크기 변경 시 업데이트
    })
  },
  beforeUnmount() {
    // 컴포넌트가 해제될 때 스크롤 이벤트 리스너 제거
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
