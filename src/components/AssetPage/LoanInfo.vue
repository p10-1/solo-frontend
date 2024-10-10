<template>
  <div class="loan-info-container">
    <!-- purpose가 '전세자금'인 경우 -->
    <div v-if="props.loanData.purpose === '전세자금'">
      <div v-for="(value, key) in formattedHouseLoanInfo" :key="key" class="loan-item">
        <span class="loan-label">{{ key }}:</span>
        <span class="loan-value">{{ value }}</span>
      </div>
    </div>

    <!-- 그 외의 경우 -->
    <div v-else>
      <div v-for="(value, key) in formattedLoanInfo" :key="key" class="loan-item">
        <span class="loan-label">{{ key }}:</span>
        <span class="loan-value">{{ value }}</span>
      </div>
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

const calculateMonthlyInterest = (amount, interest) => {
  const monthlyInterestRate = interest / 100 / 12
  return amount * monthlyInterestRate
}

const monthlyPayment = computed(() =>
  calculateMonthlyPayment(props.loanData.amount, props.loanData.interest, props.loanData.period)
)

const totalPayment = computed(() => monthlyPayment.value * props.loanData.period)

const monthlyInterest = computed(() =>
  calculateMonthlyInterest(props.loanData.amount, props.loanData.interest)
)

const formattedLoanInfo = computed(() => ({
  '대출 금액': formatCurrency(props.loanData.amount),
  '대출 목적': props.loanData.purpose,
  '대출 기간': `${props.loanData.period}개월`,
  이자율: `${props.loanData.interest}%`,
  '월 상환금': formatCurrency(monthlyPayment.value),
  '총 상환금': formatCurrency(totalPayment.value)
}))

const formattedHouseLoanInfo = computed(() => ({
  '대출 금액': formatCurrency(props.loanData.amount),
  '대출 목적': props.loanData.purpose,
  '대출 기간': `${props.loanData.period}개월`,
  이자율: `${props.loanData.interest}%`,
  '월 이자': formatCurrency(monthlyInterest.value)
}))
</script>

<style scoped></style>
