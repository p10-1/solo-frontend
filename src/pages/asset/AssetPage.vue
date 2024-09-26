<template>
  <div v-if="loading" class="loading">Loading...</div>
  <div v-else-if="error" class="error">{{ error }}</div>
  <div v-else-if="assetData" class="asset-page">
    <TotalAsset :totalAmount="calculateTotalAsset()" />
    <div class="charts-section">
      <AssetRatioChart :data="processedAssetData" />
      <LoanInfo :loanAmount="assetData.loanAmount" :payment="calculateMonthlyPayment()" />
    </div>
    <!-- <div class="comparison-section">
      <AssetComparison :comparisonData="comparisonData" />
      <TimeComparison :comparisonData="comparisonData" />
    </div> -->
    <Recommendation />
    <ListItem :assetData="assetData" />
  </div>
  <div v-else class="no-data">No asset data available</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import TotalAsset from '@/components/AssetPage/TotalAsset.vue'
import AssetRatioChart from '@/components/AssetPage/AssetRatioChart.vue'
import LoanInfo from '@/components/AssetPage/LoanInfo.vue'
import AssetComparison from '@/components/AssetPage/AssetComparison.vue'
import Recommendation from '@/components/AssetPage/Recommendation.vue'
import TimeComparison from '@/components/AssetPage/TimeComparison.vue'
import ListItem from '@/components/AssetPage/ListItem.vue'

const loading = ref(true)
const error = ref(null)
const assetData = ref(null)

const processedAssetData = computed(() => {
  if (!assetData.value) return []
  console.log('Processing asset data:', assetData.value)
  return [
    { name: '현금자산', value: assetData.value.cash || 0 },
    { name: '예금', value: assetData.value.deposit || 0 },
    { name: '주식', value: assetData.value.stock || 0 },
    { name: '부동산', value: assetData.value.property || 0 }
  ]
})

const calculateTotalAsset = () => {
  if (!assetData.value) return 0
  const total =
    (assetData.value.cash || 0) +
    (assetData.value.deposit || 0) +
    (assetData.value.stock || 0) +
    (assetData.value.property || 0)
  console.log('Calculated total asset:', total)
  return total
}

const calculateMonthlyPayment = () => {
  // 여기에 월별 납부금액 계산 로직을 추가하세요
  // 예: 대출 금액, 기간, 이자율 등을 고려하여 계산
  return assetData.value?.loanAmount ? 1052 : 0 // 임시 값
}

const comparisonData = ref({
  average: 40,
  user: 60
})

const fetchAssetData = async () => {
  try {
    const response = await axios.get('/api/asset')
    console.log('API response:', response.data)
    assetData.value = response.data
    loading.value = false
  } catch (err) {
    console.error('Error fetching asset data:', err)
    error.value = 'Failed to fetch asset data: ' + err.message
    loading.value = false
  }
}

onMounted(fetchAssetData)
</script>

<style scoped>
.asset-page {
  /* 기존 스타일 유지 */
}
.loading,
.error,
.no-data {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}
</style>
