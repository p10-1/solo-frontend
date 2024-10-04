<script setup>
import { reactive, computed } from 'vue'
import config from '@/config'
import MenuGroup from './menu/MenuGroup.vue'
import AccountMenuGroup from './menu/AccountMenuGroup.vue'
let state = reactive({ isNavShow: true })
let navClass = computed(() =>
  state.isNavShow ? 'collapse navbar-collapse show' : 'collapse navbar-collapse'
)
const toggleNavShow = () => (state.isNavShow = !state.isNavShow)
</script>
<template>
  <nav :class="['navigation', { scrolled: isScrolled }]">
    <div class="navi-icon">
      <router-link to="/" class="logo">
        <img src="../../assets/images/logo2.png" />
      </router-link>
    </div>

    <!-- PC 메뉴 -->
    <div class="menu-box" :class="navClass" id="collapsibleNavbar">
      <!-- 추후 작업 예정 -->
      <MenuGroup :menus="config.menus" />
    </div>
    <!-- 오른쪽 로그인 -->
    <AccountMenuGroup />

    <!-- 모바일 메뉴 버튼 -->
    <button
      class="navbar-toggler collapsedr"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#collapsibleNavbar"
      @click="toggleNavShow"
    >
      <span class="navbar-toggler-icon"></span>
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
  },
  beforeDestroy() {
    // 컴포넌트가 해제될 때 스크롤 이벤트 리스너 제거
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped></style>
