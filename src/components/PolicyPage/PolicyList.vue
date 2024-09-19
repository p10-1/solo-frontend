<template>
  <div class="policy-list">
    <div v-for="policy in policies" :key="policy.id" class="policy-item">
      <h3>{{ policy.title }}</h3>
      <p>{{ policy.category }}</p>
      <p>{{ policy.date }}</p>
      <button class="action-button">{{ getActionText(policy) }}</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  policies: Array
})

const getActionText = (policy) => {
  // 여기서 정책의 상태에 따라 버튼 텍스트를 반환합니다.
  // 예: '신청', '모집중', '신청마감' 등
  return '신청'
}
</script>

<style scoped>
.policy-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.policy-item {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
}

.action-button {
  background-color: #000;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
