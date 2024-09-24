<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import config from '@/config'
</script>
<template>
  <div class="jumbotron p -5 bg -primary text -white">
    <h1>{{ config.title }}</h1>
    <p>{{ config.subtitle }}</p>
  </div>
</template>
<style scoped>
.jumbotron {
  background-image: url('@/assets/images/background.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  color: green;
  padding: 2rem;
}
</style>
