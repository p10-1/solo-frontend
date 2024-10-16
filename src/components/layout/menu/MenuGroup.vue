<template>
  <ul class="nav-list">
    <MenuItem v-for="menu in props.menus" :menu="menu" :key="menu.id" />
  </ul>
</template>
<script setup>
import MenuItem from './MenuItem.vue'
const props = defineProps({
  menus: { type: Array, required: true }
})
</script>
