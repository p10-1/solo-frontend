<script setup>
const props = defineProps({
  menu: { Type: Object, required: true }
})
</script>
<template>
  <li class="">
    <router-link class="" :to="menu.url">
      <!-- <i :class="menu.icon"></i> -->
      {{ props.menu.title }}
    </router-link>
  </li>
</template>
