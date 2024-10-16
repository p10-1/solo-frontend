<template>
  <div class="loan-info-container">
    <div class="form-box">
      <label for="month">개월수마다 대출 상환금을 확인하시겠습니까?</label>
      <div>
        <input
          class="form-control basic-input"
          v-model.number="inputMonth"
          type="number"
          id="month"
          :min="1"
          :max="props.loanData.period"
          placeholder="숫자만 입력"
        />
        <button @click="applySelectedMonth" class="button-input">확인</button>
      </div>
      <span v-if="!isValidMonth" class="error">
        1에서 {{ props.loanData.period }} 사이의 값을 입력해주세요.
      </span>
    </div>

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
import { computed, ref } from 'vue'

const inputMonth = ref(1)
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

const isValidMonth = computed(
  () => inputMonth.value > 0 && inputMonth.value <= props.loanData.period
)

const applySelectedMonth = () => {
  if (isValidMonth.value) {
    selectedMonth.value = inputMonth.value
  }
}

// 이하 나머지 코드는 그대로 유지
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

// const loanMonths = computed(() => Array.from({ length: props.loanData.period }, (_, i) => i + 1))

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
.loan-info-container .form-box label {
  display: block;
  font-size: 1.08rem;
  font-weight: 500;
  letter-spacing: -1px;
  color: #333;
  margin-bottom: 15px;
}
.form-box > div {
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
}
.form-box .basic-input {
  padding: 0.375rem 0.75rem;
  border: 2px solid #e4deff;
  background-color: #e4deff;
  border-radius: 12px;
  font-size: 1rem;
  letter-spacing: -1px;
}
.form-box .button-input {
  margin-left: 5px;
  text-wrap: nowrap;
  width: 100px;
  padding: 12px 20px;
  line-height: 1;
  border-radius: 12px;
  color: #fff;
  background-color: #6846f5;
  border: 1px solid #6846f5;
}
.form-box .error {
  display: block;
  text-align: left;
  padding: 0;
  margin-bottom: 10px;
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
.error {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
}
</style>
