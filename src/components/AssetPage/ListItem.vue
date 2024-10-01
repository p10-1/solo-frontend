<template>
  <div class="list-item">
    <h3>자산 상세 정보</h3>
    <ul>
      <li>User ID: {{ assetData.userId || 'N/A' }}</li>
      <li>현금자산: {{ assetData.cash || 0 }}</li>
      <li>예금: {{ assetData.deposit || 0 }}</li>
      <li>주식: {{ assetData.stock || 0 }}</li>
      <li>부동산: {{ assetData.property || 0 }}</li>
      <li>소비 유형: {{ assetData.consume || 'N/A' }}</li>
      <li>대출 금액: {{ assetData.loanAmount || 0 }}</li>
      <li>대출 목적: {{ assetData.loanPurpose || 'N/A' }}</li>
      <li>대출 기간: {{ assetData.period || 0 }}개월</li>
      <li>생성일: {{ formatDate(assetData.createDate) }}</li>
      <li>수정일: {{ formatDate(assetData.updateDate) }}</li>
    </ul>
  </div>
</template>

<script setup>
//src/components/AssetPage/ListItem.vue

import { defineProps } from 'vue'

const props = defineProps({
  assetData: {
    type: Object,
    required: true
  }
})

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}
</script>
