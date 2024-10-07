<template>
  <h2 class="title">대출 정보</h2>
  <div class="loan-info">
    <div v-for="(value, key) in formattedLoanInfo" :key="key" class="loan-item">
      <span class="loan-label">{{ key }}:</span>
      <span class="loan-value">{{ value }}</span>
    </div>
  </div>
</template>

<script setup>
//src/components/AssetPage/LoanInfo.vue

import { computed } from 'vue'

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

const formatCurrency = (value) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)
}

const calculateMonthlyPayment = (amount, interest, period) => {
  const r = interest / 100 / 12
  const n = period
  return (amount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)
}

const monthlyPayment = computed(() =>
  calculateMonthlyPayment(props.loanData.amount, props.loanData.interest, props.loanData.period)
)

const totalPayment = computed(() => monthlyPayment.value * props.loanData.period)

const formattedLoanInfo = computed(() => ({
  '대출 금액': formatCurrency(props.loanData.amount),
  '대출 목적': props.loanData.purpose,
  '대출 기간': `${props.loanData.period}개월`,
  이자율: `${props.loanData.interest}%`,
  '월 상환금': formatCurrency(monthlyPayment.value),
  '총 상환금': formatCurrency(totalPayment.value)
}))
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

.loan-item {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.loan-label {
  font-weight: bold;
  color: #555;
}

.loan-value {
  color: #007bff;
}
</style>
