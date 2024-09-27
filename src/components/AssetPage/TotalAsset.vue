<template>
  <div class="total-asset">
    <h2>KB님의 총 자산은 {{ formattedAmount }}원입니다</h2>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// props 정의: 총 자산 금액
const props = defineProps({
  totalAmount: Number
})

// 금액 포맷팅
const formattedAmount = computed(() => {
  return props.totalAmount.toLocaleString()
})
</script>

<style scoped>
.total-asset {
  background-color: #ffeeba;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}

h2 {
  margin: 0;
  font-size: 1.5em;
}
</style>
