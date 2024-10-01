<script setup>
defineProps({ username: String })
</script>
<template>
  <li class="nav-list">
    <router-link class="" to="/mypage">
      <!-- <i class="fa-solid fa-user"></i> -->
      {{ username }}
    </router-link>
  </li>
</template>

<style></style>
