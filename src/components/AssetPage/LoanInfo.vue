<template>
  <div class="loan-info">
    <h3>대출 정보</h3>
    <p>대출 상품: {{ loanAmount }}원</p>
    <p>대출 상환금: {{ payment }}원</p>
    <p>대출 합계: {{ totalLoan }}원</p>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

// props 정의: 대출 금액과 상환금
const props = defineProps({
  loanAmount: {
    type: Number,
    default: 0
  },
  payment: {
    type: Number,
    default: 0
  }
})

// 총 대출 금액 계산
const totalLoan = computed(() => props.loanAmount + props.payment)
</script>

<style scoped>
/* 스타일 정의 */
</style>
