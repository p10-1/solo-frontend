<template>
  <div class="asset-list">
    <h1>자산 정보</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else-if="assetData">
      <TotalAsset :totalAmount="totalAsset" />
      <div class="asset-details">
        <AssetValueList :assetData="assetData" />
        <AssetRatioChart :data="assetRatioData" />
      </div>
      <AssetTypeButtons :selectedType="selectedAssetType" @select-type="selectAssetType" />
      <AssetComparison :assetType="selectedAssetType" :assetData="assetData" />
      <TimeComparison :assetType="selectedAssetType" :assetData="assetData" />
      <LoanInfo :loanAmount="assetData.loanAmount" />
      <Recommendation :assetType="selectedAssetType" :assetData="assetData" />
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
    const assetData = ref(null)
    const selectedAssetType = ref('cash')

    const totalAsset = computed(() => {
      if (!assetData.value) return 0
      const { cash, deposit, stock, property } = assetData.value
      return (cash || 0) + (deposit || 0) + (stock || 0) + (property || 0)
    })

    const assetRatioData = computed(() => {
      if (!assetData.value) return []
      const total = totalAsset.value
      if (total === 0) return []
      return [
        { name: '현금자산', value: assetData.value.cash || 0 },
        { name: '예적금', value: assetData.value.deposit || 0 },
        { name: '주식', value: assetData.value.stock || 0 },
        { name: '부동산', value: assetData.value.property || 0 }
      ].filter((item) => item.value > 0)
    })
    // 일부 수정 준영님의 코드를 참고 함!

    const loadAssetData = async () => {
      try {
        
        loading.value = true
        assetData.value = await fetchAssetData()
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
      assetData,
      totalAsset,
      assetRatioData,
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
