<script setup>
import { reactive, computed } from 'vue'
import config from '@/config'
import MenuGroup from './menu/MenuGroup.vue'
import AccountMenuGroup from './menu/AccountMenuGroup.vue'
import { useAuthStore } from '@/stores/auth'

// 네비게이션 상태
const state = reactive({ isNavShow: false })

// 로그인 상태 가져오기
const authStore = useAuthStore()
const isLogin = computed(() => authStore.isLogin)

// 네비게이션 바 클래스 설정
const navClass = computed(() =>
  state.isNavShow ? 'collapse navbar-collapse show' : 'collapse navbar-collapse'
)

// 네비게이션 바 토글
const toggleNavShow = () => (state.isNavShow = !state.isNavShow)
</script>

<template>
  <nav class="navbar navbar-expand-sm custom-navbar navbar-dark">
    <div class="container-fluid">
      <!-- 홈 링크 -->
      <router-link class="navbar-brand" to="/"> <i class="fa-solid fa-house"></i> 홈 </router-link>

      <!-- 모바일 토글 버튼 -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapsibleNavbar"
        @click="toggleNavShow"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 네비게이션 바 -->
      <div :class="navClass" id="collapsibleNavbar">
        <!-- 기본 메뉴 그룹 -->
        <MenuGroup :menus="config.menus" />

        <!-- 로그인 상태에 따른 메뉴 -->
        <template v-if="isLogin">
          <AccountMenuGroup />
        </template>
        <template v-else>
          <MenuGroup :menus="config.accoutMenus" />
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.custom-navbar {
  background-color: #4caf50; /* 원하는 색상으로 변경 */
}
</style>
