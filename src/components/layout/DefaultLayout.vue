<template>
  <NavBar />
  <section class="container min-height-container">
    <slot></slot>
  </section>
  <Footer />
</template>
<script setup>
import NavBar from './NavBar.vue'
import Footer from './Footer.vue'
</script>
