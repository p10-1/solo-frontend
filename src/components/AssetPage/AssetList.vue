<template>
  <div class="asset-list">
    <h1>자산 정보</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else-if="processedData">
      <TotalAsset :totalAmount="processedData.totalAsset" />
      <div class="asset-details">
        <AssetValueList :assetDetails="processedData.assetDetails" />
        <AssetRatioChart :data="processedData.assetRatioData" />
      </div>
      <AssetTypeButtons :selectedType="selectedAssetType" @select-type="selectAssetType" />
      <AssetComparison
        v-if="processedData.comparisonData"
        :assetType="selectedAssetType"
        :comparisonData="processedData.comparisonData"
      />
      <TimeComparison :assetType="selectedAssetType" :assetData="rawAssetData" />
      <LoanInfo :loanData="processedData.loanData" />
      <Recommendation
        :assetType="selectedAssetType"
        :recommendationData="processedData.recommendationData"
      />
    </template>
  </div>
</template>
<script>
// 일부 수정 준영님의 코드를 참고 함!

import { ref, computed, onMounted } from 'vue'
import { fetchAssetData } from '@/api/assetApi'
import TotalAsset from '@/components/AssetPage/TotalAsset.vue'
import AssetValueList from '@/components/AssetPage/AssetValueList.vue'
import AssetRatioChart from '@/components/AssetPage/AssetRatioChart.vue'
import LoanInfo from '@/components/AssetPage/LoanInfo.vue'
import AssetTypeButtons from '@/components/AssetPage/AssetTypeButtons.vue'
import AssetComparison from '@/components/AssetPage/AssetComparison.vue'
import Recommendation from '@/components/AssetPage/Recommendation.vue'
import TimeComparison from '@/components/AssetPage/TimeComparison.vue'

// 일부 수정 준영님의 코드를 참고 함!

export default {
  components: {
    TotalAsset,
    AssetValueList,
    AssetRatioChart,
    LoanInfo,
    AssetTypeButtons,
    AssetComparison,
    Recommendation,
    TimeComparison
  },
  setup() {
    const loading = ref(true)
    const error = ref(null)
    const rawAssetData = ref(null)
    const selectedAssetType = ref('cash')

    const parseJsonArray = (jsonString) => {
      try {
        return JSON.parse(jsonString)
      } catch (e) {
        console.error('Failed to parse JSON string:', jsonString)
        return []
      }
    }

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

    const calculateTotal = (assetData, assetTypes) =>
      assetTypes.reduce(
        (total, type) => total + assetData[type].values.reduce((sum, val) => sum + Number(val), 0),
        0
      )

    const processedData = computed(() => {
      if (!rawAssetData.value || rawAssetData.value.length === 0) return null

      const assetTypes = ['cash', 'deposit', 'stock', 'property']
      const currentData = rawAssetData.value[0]
      const previousData = rawAssetData.value[1] || currentData

      const currentAssetData = processAssetData(currentData, assetTypes)
      const previousAssetData = processAssetData(previousData, assetTypes)

      const totalAsset = calculateTotal(currentAssetData, assetTypes)

      const assetDetails = assetTypes.map((type) => ({
        name: type,
        total: currentAssetData[type].values.reduce((sum, val) => sum + Number(val), 0),
        details: currentAssetData[type].values.map((value, index) => ({
          bank: currentAssetData[type].banks[index],
          account: currentAssetData[type].accounts[index],
          value: Number(value)
        }))
      }))

      const assetRatioData = assetDetails.map((asset) => ({
        name: asset.name,
        value: asset.total
      }))

      const comparisonData = {}
      const timeComparisonData = {}
      assetTypes.forEach((type) => {
        const currentTotal = currentAssetData[type].values.reduce(
          (sum, val) => sum + Number(val),
          0
        )
        const previousTotal = previousAssetData[type].values.reduce(
          (sum, val) => sum + Number(val),
          0
        )
        comparisonData[type] = {
          average: currentTotal * 0.9, // This is a placeholder. Replace with actual average calculation.
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
        assetRatioData,
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

    const loadAssetData = async () => {
      try {
        loading.value = true
        rawAssetData.value = await fetchAssetData()
      } catch (err) {
        console.error('Failed to fetch asset data:', err)
        error.value = 'Failed to load asset data. Please try again later.'
      } finally {
        loading.value = false
      }
    }

    const selectAssetType = (type) => {
      selectedAssetType.value = type
    }

    onMounted(loadAssetData)

    return {
      loading,
      error,
      processedData,
      selectedAssetType,
      selectAssetType,
      rawAssetData
    }
  }
}
</script>

<style scoped>
.asset-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.asset-details {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 20px;
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
  .asset-details {
    flex-direction: column;
  }
}
</style>
