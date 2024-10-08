<template>
  <Header />
  <NavBar />
  <section class="container min-height-container">
    <slot></slot>
  </section>
  <Footer />
</template>
<script setup>
import Header from './Header.vue'
import NavBar from './NavBar.vue'
import Footer from './Footer.vue'
</script>
