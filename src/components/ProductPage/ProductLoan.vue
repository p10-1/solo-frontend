<template>
  <div>
    <h1>대출 상품 리스트</h1>
    <ul v-if="loans.length">
      <li v-for="loan in loans" :key="loan.fin_prdt_cd">
        <h2>{{ loan.fin_prdt_nm }} ({{ loan.kor_co_nm }})</h2>
        <p>대출 한도: {{ loan.loan_lmt }}</p>
        <p>가입 방법: {{ loan.join_way }}</p>
        <p>조기 상환 수수료: {{ loan.erly_rpay_fee }}</p>
        <p>대출 금리: {{ loan.dly_rate }}</p>
      </li>
    </ul>
    <p v-else>대출 상품이 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRentHouseLoan } from '@/api/productApi'

const loans = ref([]) 
const fetchLoanProducts = async () => {
  try {
    loans.value = await getRentHouseLoan('020000', 1)
  } catch (error) {
    console.error('대출 상품을 가져오는 데 오류가 발생했습니다:', error)
  }
}

onMounted(fetchLoanProducts)
</script>

