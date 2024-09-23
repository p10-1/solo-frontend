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
  <nav class="navbar navbar-expand-sm custom-navbar navbar-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <i class="fa-solid fa-house"></i>
        홈
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapsibleNavbar"
        @click="toggleNavShow"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div :class="navClass" id="collapsibleNavbar">
        <!-- 추후 작업 예정 -->
        <MenuGroup :menus="config.menus" />
        <AccountMenuGroup />
      </div>
    </div>
  </nav>
</template>
<style>
.custom-navbar {
  background-color: #4caf50; /* Replace this with your desired color */
}
</style>
