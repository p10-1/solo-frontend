<template>
  <div class="list-item">
    <h3>자산 상세 정보</h3>
    <ul>
      <li>User No: {{ assetData.userNo }}</li>
      <li>User ID: {{ assetData.userId }}</li>
      <li>현금자산: {{ assetData.cash }}</li>
      <li>예금: {{ assetData.deposit }}</li>
      <li>주식: {{ assetData.stock }}</li>
      <li>부동산: {{ assetData.property }}</li>
      <li>소비 유형: {{ assetData.consume }}</li>
      <li>대출 금액: {{ assetData.loanAmount }}</li>
      <li>대출 목적: {{ assetData.loanPurpose }}</li>
      <li>대출 기간: {{ assetData.period }}개월</li>
      <li>생성일: {{ formatDate(assetData.createDate) }}</li>
      <li>수정일: {{ formatDate(assetData.updateDate) }}</li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
// ... (import statements remain the same)
const loading = ref(true)
const error = ref(null)
const assetData = ref({
  cash: 0,
  deposit: 0,
  stock: 0,
  property: 0,
  loanAmount: 0,
  loanPurpose: '',
  period: 0
})
const props = defineProps({
  assetData: {
    type: Object,
    required: true
  }
})
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString()
}
</script>

<style scoped>
.list-item {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
