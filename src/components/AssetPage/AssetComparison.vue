<template>
  <div class="asset-comparison">
    <!-- 선택된 자산 유형 제목 표시 -->
    <h3>{{ assetTypeTitle }} 비교</h3>
    <div class="comparison-chart">
      <!-- 평균 자산 바 -->
      <div class="bar average" :style="{ width: `${averagePercentage}%` }">
        <span>평균: {{ averageAmount.toLocaleString() }}원</span>
      </div>
      <!-- 사용자 자산 바 -->
      <div class="bar user" :style="{ width: `${userPercentage}%` }">
        <span>나: {{ userAmount.toLocaleString() }}원</span>
      </div>
    </div>
    <!-- 비교 레이블 -->
    <div class="comparison-labels">
      <div>평균: {{ averagePercentage }}%</div>
      <div>나: {{ userPercentage }}%</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// props 정의
const props = defineProps({
  assetType: String,
  assetData: Object
})

// 자산 유형에 따른 제목 계산
const assetTypeTitle = computed(() => {
  const titles = {
    cash: '현금자산',
    deposit: '예적금',
    stock: '주식',
    property: '부동산'
  }
  return titles[props.assetType] || '자산'
})

// 사용자 자산 금액 계산
const userAmount = computed(() => props.assetData[props.assetType] || 0)

// 평균 자산 금액 계산 (임시로 사용자 금액의 80%로 설정)
const averageAmount = computed(() => {
  return userAmount.value * 0.8
})

// 총 자산 금액 계산
const total = computed(() => userAmount.value + averageAmount.value)

// 사용자 자산 비율 계산
const userPercentage = computed(() => ((userAmount.value / total.value) * 100).toFixed(2))

// 평균 자산 비율 계산
const averagePercentage = computed(() => ((averageAmount.value / total.value) * 100).toFixed(2))
</script>

<style scoped>
/* 스타일 정의는 여기에 추가 */
</style>
