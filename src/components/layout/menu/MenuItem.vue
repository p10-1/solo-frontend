<script setup>
const props = defineProps({
  menu: { Type: Object, required: true }
})
</script>
<template>
  <li class="dropdown dropdown-full nav-item">
    <router-link class="nav-link font-color-white" :to="menu.url">
      <!-- <i :class="menu.icon"></i> -->
      {{ menu.title }}
      <label class="px-dropdown-toggle mob-menu"></label>
    </router-link>
  </li>
</template>
<style>
.font-color-white {
  color: #fff;
}
</style>
