<template>
  <div class="asset-value-list">
    <h3>자산 비율</h3>
    <ul>
      <!-- 각 자산 유형에 대한 정보 표시 -->
      <li v-for="(value, key) in assetValues" :key="key">
        <span class="asset-type">{{ assetNames[key] }}:</span>
        <span class="asset-value">{{ formatNumber(value) }}원</span>
        <span class="asset-percentage">({{ calculatePercentage(value) }}%)</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// props 정의: 자산 데이터
const props = defineProps({
  assetData: {
    type: Object,
    required: true
  }
})

// 자산 유형 이름 매핑
const assetNames = {
  cash: '현금자산',
  deposit: '예적금',
  stock: '주식',
  property: '부동산'
}

// 자산 값 계산
const assetValues = computed(() => {
  return {
    cash: props.assetData.cash || 0,
    deposit: props.assetData.deposit || 0,
    stock: props.assetData.stock || 0,
    property: props.assetData.property || 0
  }
})

// 총 자산 계산
const totalAsset = computed(() => {
  return Object.values(assetValues.value).reduce((sum, value) => sum + value, 0)
})

// 숫자 포맷 함수
const formatNumber = (num) => {
  return num.toLocaleString()
}

// 퍼센티지 계산 함수
const calculatePercentage = (value) => {
  if (totalAsset.value === 0) return '0.00'
  return ((value / totalAsset.value) * 100).toFixed(2)
}
</script>

<style scoped>
/* 스타일 정의 */
</style>
