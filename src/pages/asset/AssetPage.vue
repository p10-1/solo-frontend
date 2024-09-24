<template>
  <div class="asset-page">
    <TotalAsset :totalAmount="13460000" />
    <div class="charts-section">
      <AssetRatioChart :data="assetData" />
      <LoanInfo :loanAmount="-100000000" :payment="-1052" />
    </div>
    <div class="comparison-section">
      <AssetComparison :comparisonData="comparisonData" />
      <TimeComparison :comparisonData="comparisonData" />
    </div>
    <Recommendation />
  </div>
</template>
<script setup>
import TotalAsset from '@/components/AssetPage/TotalAsset.vue'
import AssetRatioChart from '@/components/AssetPage/AssetRatioChart.vue'
import LoanInfo from '@/components/AssetPage/LoanInfo.vue'
import AssetComparison from '@/components/AssetPage/AssetComparison.vue'
import Recommendation from '@/components/AssetPage/Recommendation.vue'
import TimeComparison from '@/components/AssetPage/TimeComparison.vue'
<<<<<<< HEAD

=======
>>>>>>> f352a662ee9479f1e39b4eed1a07780563779666
const assetData = [
  { name: '현금자산', value: 38 },
  { name: '예금', value: 25 },
  { name: '주식', value: 23 },
  { name: '기타', value: 14 }
]
<<<<<<< HEAD

=======
>>>>>>> f352a662ee9479f1e39b4eed1a07780563779666
const comparisonData = {
  average: 40,
  user: 60
}
</script>
<style scoped>
.asset-page {
  background-color: #f8f8f8; /* 페이지 전체 배경색 */
  padding: 20px; /* 페이지 전체 여백 */
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.charts-section,
.comparison-section {
  display: flex;
  gap: 20px;
}
<<<<<<< HEAD

=======
>>>>>>> f352a662ee9479f1e39b4eed1a07780563779666
.charts-section > *,
.comparison-section > * {
  flex: 1;
}
.asset-comparison,
.time-comparison {
  width: 400px; /* 차트 크기 고정 */
  height: 400px; /* 차트 크기 고정 */
}
</style>
