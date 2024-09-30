<script setup>
import Header from './Header.vue'
import NavBar from './NavBar.vue'
import Footer from './Footer.vue'
</script>
<template>
  <Header />
  <NavBar />
  <div class="section">
    <div class="container section">
      <slot></slot>
    </div>
  </div>
  <Footer />
</template>
