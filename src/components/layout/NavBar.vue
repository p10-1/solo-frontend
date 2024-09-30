<script setup>
import { reactive, computed } from 'vue'
import config from '@/config'
import MenuGroup from './menu/MenuGroup.vue'
import AccountMenuGroup from './menu/AccountMenuGroup.vue'
let state = reactive({ isNavShow: false })
let navClass = computed(() =>
  state.isNavShow ? 'collapse navbar-collapse show' : 'collapse navbar-collapse'
)
const toggleNavShow = () => (state.isNavShow = !state.isNavShow)
</script>
<template>
  <nav class="navbar navbar-transparent navbar-expand-lg fixed-top">
    <div class="container">
      <div class="navbar-translate">
        <router-link class="navbar-brand" to="/">
          <!-- <i class="fa-solid fa-house"></i> -->
          <!-- 모바일 화면 로고 -->
          <image class="logo-dark logo-white" src="" alt="logo 이미지" />
          <!-- PC 화면 로고 -->
          <image class="logo-light" src="" alt="logo 이미지" />
        </router-link>
      </div>

      <!-- PC 메뉴 -->
      <div :class="navClass" id="collapsibleNavbar">
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
    </div>
  </nav>
</template>
