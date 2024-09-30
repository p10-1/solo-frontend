<template>
  <div class="loan-info">
    <h3>대출 정보</h3>
    <p>대출 금액: {{ formatCurrency(loanData.amount) }}원</p>
    <p>대출 목적: {{ loanData.purpose }}</p>
    <p>대출 기간: {{ loanData.period }}개월</p>
    <p>이자율: {{ loanData.interest }}%</p>
    <p>월 상환금: {{ formatCurrency(monthlyPayment) }}원</p>
    <p>총 상환금: {{ formatCurrency(totalPayment) }}원</p>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  loanData: {
    type: Object,
    required: true,
    default: () => ({
      amount: 0,
      purpose: '',
      period: 0,
      interest: 0
    })
  }
})

// 월 상환금 계산 (원리금 균등상환 방식)
const monthlyPayment = computed(() => {
  const r = props.loanData.interest / 100 / 12
  const n = props.loanData.period
  const P = props.loanData.amount
  return (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)
})

// 총 상환금 계산
const totalPayment = computed(() => monthlyPayment.value * props.loanData.period)

// 숫자를 통화 형식으로 변환하는 함수
const formatCurrency = (value) => {
  return new Intl.NumberFormat('ko-KR').format(Math.round(value))
}
</script>

<style scoped>
.loan-info {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

h3 {
  margin-bottom: 15px;
  color: #333;
}

p {
  margin-bottom: 10px;
  color: #555;
}
</style>
