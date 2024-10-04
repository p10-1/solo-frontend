<script setup>
import { RouterView } from 'vue-router'
import DefaultLayout from './components/layout/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <RouterView />
    <div id="modals"></div>
  </DefaultLayout>
</template>

<style scoped></style>
