<template>
  <!-- 대출 정보를 나타내는 제목 -->
  <h2 class="title">대출 정보</h2>

  <!-- 대출 정보가 표시되는 메인 컨테이너 -->
  <div class="loan-info">
    <!-- formattedLoanInfo 객체의 각 항목을 순회하여 대출 정보를 표시 -->
    <div v-for="(value, key) in formattedLoanInfo" :key="key" class="loan-item">
      <!-- 대출 정보의 항목 이름 (key) -->
      <span class="loan-label">{{ key }}:</span>
      <!-- 대출 정보의 값 (value) -->
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
  /* 대출 정보 컨테이너에 연한 회색 배경과 둥근 모서리, 패딩 추가, 상단에 20px 간격 */
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

h3 {
  /* 제목(h3) 스타일: 아래쪽 15px의 간격과 짙은 회색(#333) 텍스트 색상 */
  margin-bottom: 15px;
  color: #333;
}

.loan-item {
  /* 대출 정보 항목을 가로로 배치하고, 각 항목 사이에 10px의 간격을 추가 */
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between; /* 항목 이름과 값을 양 끝에 배치 */
}

.loan-label {
  /* 대출 정보 항목 이름을 굵게 표시하고, 색상을 중간 회색(#555)으로 설정 */
  font-weight: bold;
  color: #555;
}

.loan-value {
  /* 대출 정보 값의 색상을 파란색(#007bff)으로 설정 */
  color: #007bff;
}
</style>
