<template>
  <div class="policy-grid">
    <div v-for="policy in policies" :key="policy.id" class="policy-item">
      <h3>{{ policy.title }}</h3>
      <p>{{ policy.category }}</p>
      <p>{{ policy.date }}</p>
      <button>신청하기</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  policies: Array
})
</script>

<style scoped>
.policy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.policy-item {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
}
</style>
