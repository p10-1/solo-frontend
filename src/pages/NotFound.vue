<template>
  <div class="not-found">
    <h2>404</h2>
    <p>Sorry, the page you are looking for does not exist.</p>
    <router-link to="/" class="button-main">Go Back Home</router-link>
  </div>
</template>

<script setup></script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 100px;
  height: 100vh;
}

.not-found h1 {
  font-size: 80px;
  font-weight: bold;
  color: #ff6666;
}

.not-found p {
  font-size: 20px;
  color: #333;
}
</style>
