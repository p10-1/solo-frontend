<template>
  <div class="asset-list">
    <h1>자산 정보</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else-if="processedData">
      <TotalAsset :totalAmount="processedData.totalAsset" />
      <div class="asset-details">
        <Distribution :assetDetails="processedData.assetDetails" />
      </div>
      <AssetTypeButtons :selectedType="selectedAssetType" @select-type="selectAssetType" />
      <div class="comparison-row">
        <AssetComparison
          v-if="processedData.comparisonData"
          :assetType="selectedAssetType"
          :comparisonData="processedData.comparisonData"
        />
        <TimeComparison :assetType="selectedAssetType" :assetData="rawAssetData" />
      </div>
      <LoanInfo :loanData="processedData.loanData" />
      <Recommendation
        :assetType="selectedAssetType"
        :recommendationData="processedData.recommendationData"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchAssetData, fetchAssetAverages } from '@/api/assetApi'
import TotalAsset from '@/components/AssetPage/TotalAsset.vue'
import Distribution from '@/components/AssetPage/Distribution.vue'
import AssetTypeButtons from '@/components/AssetPage/AssetTypeButtons.vue'
import AssetComparison from '@/components/AssetPage/AssetComparison.vue'
import TimeComparison from '@/components/AssetPage/TimeComparison.vue'
import LoanInfo from '@/components/AssetPage/LoanInfo.vue'
import Recommendation from '@/components/AssetPage/Recommendation.vue'

const loading = ref(true)
const error = ref(null)
const rawAssetData = ref(null)
const assetAverages = ref(null)

const selectedAssetType = ref('cash')
const loadData = async () => {
  try {
    loading.value = true
    const [assetData, averages] = await Promise.all([fetchAssetData(), fetchAssetAverages()])
    rawAssetData.value = assetData
    assetAverages.value = averages
  } catch (err) {
    console.error('Failed to fetch data:', err)
    error.value = 'Failed to load data. Please try again later.'
  } finally {
    loading.value = false
  }
}

const parseJsonArray = (jsonString) => {
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    console.error('Failed to parse JSON string:', jsonString)
    return []
  }
}
// processAssetData 함수 추가
const processAssetData = (data, assetTypes) => {
  const processed = {}
  assetTypes.forEach((type) => {
    processed[type] = {
      values: parseJsonArray(data[type]),
      banks: parseJsonArray(data[type + 'Bank']),
      accounts: parseJsonArray(data[type + 'Account'])
    }
  })
  return processed
}

const processedData = computed(() => {
  if (!rawAssetData.value || rawAssetData.value.length === 0) return null

  const currentData = rawAssetData.value[0]
  const previousData = rawAssetData.value[1] || currentData

  const assetTypes = ['cash', 'deposit', 'stock', 'property']

  const currentAssetData = processAssetData(currentData, assetTypes)
  const previousAssetData = processAssetData(previousData, assetTypes)

  const calculateTotal = (assetData) =>
    assetTypes.reduce(
      (total, type) => total + assetData[type].values.reduce((sum, val) => sum + Number(val), 0),
      0
    )

  const totalAsset = calculateTotal(currentAssetData)

  const assetDetails = {}
  assetTypes.forEach((type) => {
    assetDetails[type] = {
      total: currentAssetData[type].values.reduce((sum, val) => sum + Number(val), 0),
      details: currentAssetData[type].values.map((value, index) => ({
        bank: currentAssetData[type].banks[index],
        account: currentAssetData[type].accounts[index],
        value: Number(value)
      }))
    }
  })

  const comparisonData = {}
  const timeComparisonData = {}
  assetTypes.forEach((type) => {
    const currentTotal = currentAssetData[type].values.reduce((sum, val) => sum + Number(val), 0)
    const previousTotal = previousAssetData[type].values.reduce((sum, val) => sum + Number(val), 0)
    comparisonData[type] = {
      average: assetAverages.value ? assetAverages.value[type] : 0,
      user: currentTotal
    }
    timeComparisonData[type] = {
      previousMonth: previousTotal,
      currentMonth: currentTotal
    }
  })

  return {
    totalAsset,
    assetDetails,
    comparisonData,
    timeComparisonData,
    loanData: {
      amount: Number(currentData.loanAmount),
      purpose: currentData.loanPurpose,
      period: Number(currentData.period),
      interest: Number(currentData.interest)
    },
    recommendationData: {
      consume: currentData.consume
    }
  }
})

const selectAssetType = (type) => {
  selectedAssetType.value = type
}

onMounted(loadData)
</script>

<style scoped>
.asset-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.asset-details {
  margin-top: 20px;
}

.comparison-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
}

.comparison-row > * {
  flex: 1;
  min-width: 0; /* 이는 flex item이 컨테이너를 넘어가는 것을 방지합니다 */
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.error {
  color: #ff4d4f;
}

@media (max-width: 768px) {
  .comparison-row {
    flex-direction: column;
  }
}
</style>
