<template>
  <nav class="navbar navbar-expand-sm custom-navbar navbar-dark">
    <div class="container-fluid">
      <!-- 홈 링크 -->
      <router-link class="navbar-brand" to="/"> <i class="fa-solid fa-house"></i> 홈 </router-link>

      <div class="navbar-collapse">
        <ul class="navbar-nav ms-auto">
          <router-link v-for="menu in mainMenus" :key="menu.url" :to="menu.url" class="nav-link">
            <i :class="menu.icon"></i> {{ menu.title }}
          </router-link>

          <!-- 로그인 상태에 따라 로그인/로그아웃 버튼 표시 -->
          <template v-if="isLogin">
            <router-link to="/mypage" class="nav-link">
              <i class="fa-solid fa-user"></i> 마이페이지
            </router-link>
            <router-link to="/logout" class="nav-link">
              <i class="fa-solid fa-sign-out-alt"></i> 로그아웃
            </router-link>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link">
              <i class="fa-solid fa-sign-in-alt"></i> 로그인
            </router-link>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import config from '@/config'

const authStore = useAuthStore()

// 로그인 여부 확인
const isLogin = computed(() => authStore.isLogin)

// 메뉴 데이터
const mainMenus = config.menus
</script>

<style scoped>
.custom-navbar {
  background-color: #4caf50; /* 원하는 색상으로 변경 */
}
</style>
