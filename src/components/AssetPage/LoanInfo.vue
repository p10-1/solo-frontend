<template>
  <div class="loan-info">
    <h3>대출 정보</h3>
    <p>대출 상품: {{ loanAmount.toLocaleString() }}원</p>
    <p>대출 상환금: {{ payment.toLocaleString() }}원</p>
    <p>대출 합계: {{ loanTotal.toLocaleString() }}원</p>
  </div>
</template>

<script setup>
const props = defineProps({
  loanAmount: {
    type: Number,
    required: true
  },
  payment: {
    type: Number,
    required: true
  }
})

const loanTotal = props.loanAmount + props.payment
</script>

<style scoped>
.loan-info {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}
</style>
