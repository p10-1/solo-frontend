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
  <nav class="navigation">
    <div class="container">
      <div class="nav-box">
        <div class="logo-box">
          <a href="#">
            <!-- <i class="fa-solid fa-house"></i> -->
            <!-- PC 화면 로고 -->
            빚이 없는 솔로
            <image class="" src="/" alt="logo 이미지" />
          </a>
        </div>

        <!-- PC 메뉴 -->
        <div class="menu-box" :class="navClass" id="collapsibleNavbar">
          <!-- 추후 작업 예정 -->
          <MenuGroup :menus="config.menus" />
        </div>
        <!-- 오른쪽 로그인 -->
        <AccountMenuGroup />

        <!-- 모바일 메뉴 버튼 -->
        <!-- <button
          class="navbar-toggler collapsedr"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavbar"
          @click="toggleNavShow"
        >
          <span class="navbar-toggler-icon"></span>
        </button> -->
      </div>
    </div>
  </nav>
</template>
