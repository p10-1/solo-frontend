<template>
  <div class="asset-list">
    <!-- 로딩 중일 때 표시 -->
    <div v-if="loading" class="loading">Loading...</div>
    <!-- 에러 발생 시 표시 -->
    <div v-else-if="error" class="error">{{ error }}</div>
    <!-- 데이터 로드 완료 시 표시 -->
    <template v-else-if="assetData">
      <!-- 총 자산 표시 컴포넌트 -->
      <TotalAsset :totalAmount="totalAsset" />
      <div class="asset-details">
        <!-- 자산 목록 표시 컴포넌트 -->
        <AssetValueList :assetData="assetData" />
        <!-- 자산 비율 차트 컴포넌트 -->
        <AssetRatioChart :data="assetRatioData" />
      </div>
      <!-- 대출 정보 컴포넌트 -->
      <LoanInfo :loanAmount="assetData.loanAmount" />
      <!-- 자산 유형 선택 버튼 컴포넌트 -->
      <AssetTypeButtons :selectedType="selectedAssetType" @select-type="selectAssetType" />
      <!-- 자산 비교 컴포넌트 -->
      <AssetComparison :assetType="selectedAssetType" :assetData="assetData" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
// 필요한 컴포넌트들 임포트
import TotalAsset from '@/components/AssetPage/TotalAsset.vue'
import AssetValueList from '@/components/AssetPage/AssetValueList.vue'
import AssetRatioChart from '@/components/AssetPage/AssetRatioChart.vue'
import LoanInfo from '@/components/AssetPage/LoanInfo.vue'
import AssetTypeButtons from '@/components/AssetPage/AssetTypeButtons.vue'
import AssetComparison from '@/components/AssetPage/AssetComparison.vue'

// 상태 변수 정의
const loading = ref(true)
const error = ref(null)
const assetData = ref(null)
const selectedAssetType = ref('cash')

// 총 자산 계산
const totalAsset = computed(() => {
  if (!assetData.value) return 0
  const { cash, deposit, stock, property } = assetData.value
  return (cash || 0) + (deposit || 0) + (stock || 0) + (property || 0)
})

// 데이터 계산
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

// 자산 데이터 가져오기
const fetchAssetData = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/asset')
    assetData.value = response.data
  } catch (err) {
    console.error('Failed to fetch asset data:', err)
    error.value = 'Failed to load asset data. Please try again later.'
  } finally {
    loading.value = false
  }
}

// 자산 유형 선택 핸들러
const selectAssetType = (type) => {
  selectedAssetType.value = type
}

// 컴포넌트 마운트 시 데이터 가져오기
onMounted(fetchAssetData)
</script>

<style scoped>
/* 스타일 정의 */
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

/* 반응형 디자인: 화면 너비가 768px 이하일 때 */
@media (max-width: 768px) {
  .asset-details {
    flex-direction: column;
  }
}
</style>
