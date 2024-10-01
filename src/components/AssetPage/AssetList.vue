<template>
  <div class="asset-list">
    <h1>자산 정보</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <!-- 데이터가 처리된 경우 자산 정보 컴포넌트 렌더링 -->

    <template v-else-if="processedData">
      <!-- 총 자산 정보 표시 -->

      <TotalAsset :totalAmount="processedData.totalAsset" />
      <div class="asset-details">
        <!-- 자산 분포 정보 표시 -->

        <Distribution :assetDetails="processedData.assetDetails" />
      </div>
      <!-- 자산 종류 선택 버튼 -->

      <AssetTypeButtons :selectedType="selectedAssetType" @select-type="selectAssetType" />
      <div class="comparison-row">
        <!-- 자산 비교 컴포넌트 -->

        <AssetComparison
          v-if="processedData.comparisonData"
          :assetType="selectedAssetType"
          :comparisonData="processedData.comparisonData"
        />
        <!-- 시간 기반 자산 비교 컴포넌트 -->
        <TimeComparison :assetType="selectedAssetType" :assetData="rawAssetData" />
      </div>
      <!-- 대출 정보 표시 -->
      <LoanInfo :loanData="processedData.loanData" />
      <!-- 추천 정보 표시 -->
      <Recommendation
        :assetType="selectedAssetType"
        :recommendationData="processedData.recommendationData"
      />
    </template>
  </div>
</template>

<script setup>
//src/components/AssetPage/AssetList.vue

import { ref, computed, onMounted } from 'vue'
import { fetchAssetData, fetchAssetAverages } from '@/api/assetApi'
import TotalAsset from '@/components/AssetPage/TotalAsset.vue'
import Distribution from '@/components/AssetPage/Distribution.vue'
import AssetTypeButtons from '@/components/AssetPage/AssetTypeButtons.vue'
import AssetComparison from '@/components/AssetPage/AssetComparison.vue'
import TimeComparison from '@/components/AssetPage/TimeComparison.vue'
import LoanInfo from '@/components/AssetPage/LoanInfo.vue'
import Recommendation from '@/components/AssetPage/Recommendation.vue'

const loading = ref(true) // 로딩 상태 관리
const error = ref(null) // 에러 상태 관리

const rawAssetData = ref(null) // 자산 데이터 원본
const assetAverages = ref(null) // 평균 자산 데이터
const selectedAssetType = ref('cash') // 선택된 자산 타입 기본값은 'cash'

// 자산 데이터 및 평균 데이터를 API로부터 로드하는 함수

const loadData = async () => {
  try {
    loading.value = true
    // fetchAssetData()와 fetchAssetAverages()를 동시에 호출하여 데이터 로드

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
// 자산 데이터를 처리하여 필요한 형태로 변환하는 함수

const parseJsonArray = (jsonString) => {
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    console.error('Failed to parse JSON string:', jsonString)
    return []
  }
}

// 자산 데이터를 처리하여 필요한 형태로 변환하는 함수
const processAssetData = (data, assetTypes) => {
  const processed = {}
  assetTypes.forEach((type) => {
    processed[type] = {
      values: parseJsonArray(data[type]), // 각 자산 타입의 값을 배열로 처리
      banks: parseJsonArray(data[type + 'Bank']), // 해당 자산의 은행 정보
      accounts: parseJsonArray(data[type + 'Account']) // 해당 자산의 계좌 정보
    }
  })
  return processed
}

// 처리된 자산 데이터를 계산하고 반환하는 computed 함수
const processedData = computed(() => {
  if (!rawAssetData.value || rawAssetData.value.length === 0) return null

  const currentData = rawAssetData.value[0] // 현재 자산 데이터
  const previousData = rawAssetData.value[1] || currentData // 이전 자산 데이터 (없으면 현재 데이터 사용)

  const assetTypes = ['cash', 'deposit', 'stock', 'property'] // 자산 타입 리스트

  const currentAssetData = processAssetData(currentData, assetTypes)
  const previousAssetData = processAssetData(previousData, assetTypes)

  // 자산 합계를 계산하는 함수
  const calculateTotal = (assetData) =>
    assetTypes.reduce(
      (total, type) => total + assetData[type].values.reduce((sum, val) => sum + Number(val), 0),
      0
    )

  const totalAsset = calculateTotal(currentAssetData) // 총 자산 계산

  const assetDetails = {} // 자산 상세 정보
  assetTypes.forEach((type) => {
    assetDetails[type] = {
      total: currentAssetData[type].values.reduce((sum, val) => sum + Number(val), 0),
      details: currentAssetData[type].values.map((value, index) => ({
        bank: currentAssetData[type].banks[index], // 은행 정보
        account: currentAssetData[type].accounts[index], // 계좌 정보
        value: Number(value) // 자산 값
      }))
    }
  })

  const comparisonData = {} // 자산 비교 데이터
  const timeComparisonData = {} // 시간 비교 데이터
  assetTypes.forEach((type) => {
    const currentTotal = currentAssetData[type].values.reduce((sum, val) => sum + Number(val), 0)
    const previousTotal = previousAssetData[type].values.reduce((sum, val) => sum + Number(val), 0)
    comparisonData[type] = {
      average: assetAverages.value ? assetAverages.value[type] : 0, // 평균 자산 값
      user: currentTotal // 사용자 자산 값
    }
    timeComparisonData[type] = {
      previousMonth: previousTotal, // 이전 달 자산
      currentMonth: currentTotal // 현재 달 자산
    }
  })

  return {
    totalAsset,
    assetDetails,
    comparisonData,
    timeComparisonData,
    loanData: {
      amount: Number(currentData.loanAmount), // 대출 금액
      purpose: currentData.loanPurpose, // 대출 목적
      period: Number(currentData.period), // 대출 기간
      interest: Number(currentData.interest) // 이자율
    },
    recommendationData: {
      consume: currentData.consume // 소비 유형
    }
  }
})

// 자산 타입을 선택하는 함수
const selectAssetType = (type) => {
  selectedAssetType.value = type // 선택된 자산 타입 업데이트
}

onMounted(loadData) // 컴포넌트가 마운트될 때 데이터를 로드

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
