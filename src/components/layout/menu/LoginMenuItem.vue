<template>
  <button @click="goTologin" class="button-main">로그인</button>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goTologin = () => {
  router.push({ name: 'login' })
}
</script>
