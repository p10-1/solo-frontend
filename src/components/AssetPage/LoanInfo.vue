<template>
  <div class="loan-info-container">
    <label for="month">몇 번째 달의 상환금을 확인하시겠습니까?</label>
    <select v-model="selectedMonth" id="month">
      <option v-for="month in loanMonths" :key="month" :value="month">{{ month }}개월</option>
    </select>
    <!-- 만기일시상환인 경우 -->
    <div v-if="props.repaymentMethod === 'bullet-repayment'">
      <ul v-for="(value, key) in formattedBullet" :key="key" class="loan-item">
        <li class="loan-label">{{ key }}</li>
        <li class="loan-value">
          <span class="text-accent">{{ value }}</span>
        </li>
      </ul>
    </div>
    <!-- 원금균등상환인 경우 -->
    <div v-if="props.repaymentMethod === 'equal-principal'">
      <ul v-for="(value, key) in formattedPrincipal" :key="key" class="loan-item">
        <li class="loan-label">{{ key }}</li>
        <li class="loan-value">
          <span class="text-accent">{{ value }}</span>
        </li>
      </ul>
    </div>
    <!-- 원리금균등상환인 경우 -->
    <div v-if="props.repaymentMethod === 'equal-principal-interest'">
      <ul v-for="(value, key) in formattedInterest" :key="key" class="loan-item">
        <li class="loan-label">{{ key }}</li>
        <li class="loan-value">
          <span class="text-accent">{{ value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
//src/components/AssetPage/LoanInfo.vue

import { computed, ref } from 'vue'

const selectedMonth = ref(1)
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
  },
  repaymentMethod: {
    type: String,
    required: true
  }
})
// const formatBigInt = (value) => {
//   return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
// }

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

const calculateEqualPrincipalPayments = (amount, interest, period) => {
  const monthlyPrincipal = amount / period
  const payments = []
  let remainingBalance = amount

  for (let i = 0; i < period; i++) {
    const monthlyInterest = remainingBalance * (interest / 100 / 12)
    const totalMonthlyPayment = monthlyPrincipal + monthlyInterest
    payments.push(totalMonthlyPayment)
    remainingBalance -= monthlyPrincipal
  }

  return payments
}

// Loan months: 1 to the total loan period
const loanMonths = computed(() => Array.from({ length: props.loanData.period }, (_, i) => i + 1))

const monthlyPayment = computed(() =>
  calculateMonthlyPayment(props.loanData.amount, props.loanData.interest, props.loanData.period)
)

const totalPayment = computed(() => monthlyPayment.value * props.loanData.period)

const monthlyInterest = computed(() =>
  calculateMonthlyInterest(props.loanData.amount, props.loanData.interest)
)

const equalPrincipalPayments = computed(() =>
  calculateEqualPrincipalPayments(
    props.loanData.amount,
    props.loanData.interest,
    props.loanData.period
  )
)

const selectedMonthPayment = computed(() => {
  const month = selectedMonth.value - 1
  return month >= 0 && month < props.loanData.period ? equalPrincipalPayments.value[month] : 0
})

const formattedInterest = computed(() => ({
  '대출 금액': formatCurrency(props.loanData.amount),
  '대출 목적': props.loanData.purpose,
  '대출 기간': `${props.loanData.period}개월`,
  이자율: `${props.loanData.interest}%`,
  '월 상환금': formatCurrency(monthlyPayment.value),
  '총 상환금': formatCurrency(totalPayment.value)
}))

const formattedPrincipal = computed(() => ({
  '대출 금액': formatCurrency(props.loanData.amount),
  '대출 목적': props.loanData.purpose,
  '대출 기간': `${props.loanData.period}개월`,
  이자율: `${props.loanData.interest}%`,
  '월 상환금': formatCurrency(selectedMonthPayment.value),
  '총 상환금': formatCurrency(equalPrincipalPayments.value.reduce((a, b) => a + b, 0))
}))

const formattedBullet = computed(() => ({
  '대출 금액': formatCurrency(props.loanData.amount),
  '대출 목적': props.loanData.purpose,
  '대출 기간': `${props.loanData.period}개월`,
  이자율: `${props.loanData.interest}%`,
  '월 이자': formatCurrency(monthlyInterest.value)
}))
</script>

<style scoped>
.loan-info-container {
  position: relative;
  width: 100%;
  border-radius: 25px;
  padding: 2rem 1.7rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}
.loan-info-container .loan-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px dashed #cfc6fd;
}
.loan-info-container .loan-item:last-child {
  margin-bottom: 0;
}
.loan-item .loan-label {
  font-size: 1.08rem;
  font-weight: 500;
  letter-spacing: -1px;
  color: #333;
}
.loan-item .loan-value {
  margin: 10px 0;
  font-size: 1.08rem;
  letter-spacing: -1px;
  font-weight: 500;
  color: #333;
}
.loan-item .loan-value .text-accent {
  font-weight: 600;
  font-size: 1.4rem;
}
</style>
