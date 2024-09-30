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
        v-if="processedData"
        :assetType="selectedAssetType"
        :comparisonData="processedData.comparisonData"
      />
      <TimeComparison
        :assetType="selectedAssetType"
        :timeData="processedData.timeComparisonData[selectedAssetType]"
      />
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

    const processedData = computed(() => {
      if (!rawAssetData.value) return null

      const data = rawAssetData.value
      const assetTypes = ['cash', 'deposit', 'stock', 'property']

      const processedAssetData = {}
      assetTypes.forEach((type) => {
        processedAssetData[type] = {
          values: parseJsonArray(data[type]),
          banks: parseJsonArray(data[type + 'Bank']),
          accounts: parseJsonArray(data[type + 'Account'])
        }
      })

      const totalAsset = assetTypes.reduce(
        (total, type) =>
          total + processedAssetData[type].values.reduce((sum, val) => sum + Number(val), 0),
        0
      )

      const assetDetails = assetTypes.map((type) => ({
        name: type,
        total: processedAssetData[type].values.reduce((sum, val) => sum + Number(val), 0),
        details: processedAssetData[type].values.map((value, index) => ({
          bank: processedAssetData[type].banks[index],
          account: processedAssetData[type].accounts[index],
          value: Number(value)
        }))
      }))

      const assetRatioData = assetDetails.map((asset) => ({
        name: asset.name,
        value: asset.total
      }))

      // Implement comparison, time comparison, and recommendation logic here
      const comparisonData = {}
      const timeComparisonData = {}
      assetTypes.forEach((type) => {
        const total = processedAssetData[type].values.reduce((sum, val) => sum + Number(val), 0)
        comparisonData[type] = {
          average: total * 0.9, // This is a placeholder. Replace with actual average calculation.
          user: total
        }
        timeComparisonData[type] = {
          previousMonth: total * 0.95, // This is a placeholder. Replace with actual previous month data.
          currentMonth: total
        }
      })

      return {
        totalAsset,
        assetDetails,
        assetRatioData,
        comparisonData,
        timeComparisonData,
        loanData: {
          amount: Number(data.loanAmount),
          purpose: data.loanPurpose,
          period: Number(data.period),
          interest: Number(data.interest)
        },
        recommendationData: {
          consume: data.consume
          // Add more recommendation data as needed
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
      selectAssetType
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
