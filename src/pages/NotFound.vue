<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Sorry, the page you are looking for does not exist.</p>
    <router-link to="/" class="btn btn-primary">Go Back Home</router-link>
  </div>
</template>

<script setup></script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 100px;
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

.btn {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>
