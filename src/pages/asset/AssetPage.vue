<template>
  <div
    class="asset-page"
    v-if="totalAmount && assetData.length && comparisonData.average && comparisonData.user"
  >
    <TotalAsset :totalAmount="totalAmount" />
    <div class="charts-section">
      <AssetRatioChart :data="assetData" />
      <LoanInfo :loanAmount="loanData.loanAmount" :payment="loanData.payment" />
    </div>
    <div class="comparison-section">
      <AssetComparison :comparisonData="comparisonData" />
      <TimeComparison :comparisonData="comparisonData" />
    </div>
    <Recommendation />
  </div>
  <div v-else>데이터를 불러오는 중...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import TotalAsset from '@/components/AssetPage/TotalAsset.vue'
import AssetRatioChart from '@/components/AssetPage/AssetRatioChart.vue'
import LoanInfo from '@/components/AssetPage/LoanInfo.vue'
import AssetComparison from '@/components/AssetPage/AssetComparison.vue'
import Recommendation from '@/components/AssetPage/Recommendation.vue'
import TimeComparison from '@/components/AssetPage/TimeComparison.vue'

const totalAmount = ref(0)
const assetData = ref([])
const loanData = ref({ loanAmount: 0, payment: 0 })
const comparisonData = ref({ average: 0, user: 0 })

const fetchAssetData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/assets')
    totalAmount.value = response.data.totalAmount
    assetData.value = response.data.assetData
    loanData.value = {
      loanAmount: response.data.loanAmount,
      payment: response.data.payment
    }
    comparisonData.value = response.data.comparisonData
  } catch (error) {
    console.error('Error fetching asset data:', error)
  }
}

onMounted(() => {
  fetchAssetData()
})
</script>

<style scoped>
.asset-page {
  background-color: #f8f8f8;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.charts-section,
.comparison-section {
  display: flex;
  gap: 20px;
}

.charts-section > * {
  flex: 1;
}

.asset-comparison,
.time-comparison {
  width: 400px;
  height: 400px;
}
</style>
