<script setup>
defineProps({ username: String })
</script>
<template>
  <li class="nav-item">
    <router-link class="nav-link font-color-white" to="/mypage">
      <!-- <i class="fa-solid fa-user"></i> -->
      {{ username }}
    </router-link>
  </li>
</template>
<style>
.font-color-white {
  color: #fff;
}
</style>
