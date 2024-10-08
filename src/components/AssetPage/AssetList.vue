<template>
  <div class="asset-list">
    <h1 class="asset-list__title">자산 정보</h1>
    <div v-if="loading" class="asset-list__loading">Loading...</div>
    <div v-else-if="error" class="asset-list__error">{{ error }}</div>
    <template v-else-if="processedData">
      <div class="asset-list__grid">
        <div class="asset-list__section asset-list__total">
          <TotalAsset :totalAmount="processedData.totalAsset" />
        </div>
        <div class="asset-list__section asset-list__distribution-slider">
          <button @click="prevSlide" class="slider-btn prev-btn">‹</button>
          <div class="slider-content">
            <transition name="fade" mode="out-in">
              <Distribution
                v-if="currentSlide === 0"
                key="user-distribution"
                :assetDetails="processedData.assetDetails"
                title="내 자산 분포"
              />
              <Distribution
                v-else-if="currentSlide === 1 && processedData.typeAverages"
                key="average-distribution"
                :assetDetails="processedData.typeAverages"
                :title="`${processedData.assetDetails.type || '전체'} 평균 자산 분포`"
              />
            </transition>
          </div>
          <button @click="nextSlide" class="slider-btn next-btn">›</button>
        </div>
        <div class="asset-list__section asset-list__comparison-container">
          <AssetTypeButtons :selectedType="selectedAssetType" @select-type="selectAssetType" />
          <div class="asset-list__comparison-charts">
            <div class="asset-list__chart">
              <AssetComparison
                :userAsset="calculateTotalAssets(processedData.assetDetails)"
                :userType="processedData.assetDetails.type || 'unknown'"
                :selectedAssetType="selectedAssetType"
              />
            </div>
            <div class="asset-list__chart">
              <TimeComparison :assetType="selectedAssetType" :assetData="rawAssetData" />
            </div>
          </div>
        </div>
        <div class="asset-list__section asset-list__loan">
          <LoanInfo :loanData="processedData.loanData" />
        </div>
        <div class="asset-list__section asset-list__recommended-products">
          <Recommendation :loanPeriod="processedData.loanData.period" />
        </div>
      </div>
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

//슬라이드 구현
const currentSlide = ref(0)

const nextSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? 1 : 0
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 1 ? 0 : 1
}

onMounted(() => {
  loadData()
})

// 자산 데이터 및 평균 데이터를 API로부터 로드하는 함수

const fieldMapping = {
  cash: { bank: 'cashBank', account: 'cashAccount', value: 'cash' },
  deposit: { bank: 'depositBank', account: 'depositAccount', value: 'deposit' },
  stock: { bank: 'stockBank', account: 'stockAccount', value: 'stock' },
  insurance: { bank: 'insuranceCompany', account: 'insuranceName', value: 'insurance' }
}

const loadData = async () => {
  console.log('1. loadData 함수 시작')
  try {
    loading.value = true
    const [assetData, averages] = await Promise.all([fetchAssetData(), fetchAssetAverages()])
    console.log('2. 받은 평균 데이터:', averages)
    rawAssetData.value = assetData
    assetAverages.value = averages
    console.log('3. assetAverages.value 설정됨:', assetAverages.value)
  } catch (err) {
    console.error('데이터 가져오기 실패:', err)
    error.value = '데이터를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.'
  } finally {
    loading.value = false
    console.log('4. loadData 함수 종료')
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
const calculateTotalAssets = (assetDetails) => {
  const totals = {}
  for (const [type, data] of Object.entries(assetDetails)) {
    totals[type] = data.total
  }
  return totals
}
// 자산 데이터를 처리하여 필요한 형태로 변환하는 함수

//따로 함수 처리 ㅎ

const processAssetData = (data, assetTypes) => {
  return assetTypes.reduce((processed, type) => {
    const mapping = fieldMapping[type]
    if (mapping) {
      processed[type] = {
        values: parseJsonArray(data[mapping.value]),
        banks: parseJsonArray(data[mapping.bank]),
        accounts: parseJsonArray(data[mapping.account])
      }
    }
    return processed
  }, {})
}

// 처리된 자산 데이터를 계산하고 반환하는 computed 함수
const processedData = computed(() => {
  if (!rawAssetData.value || rawAssetData.value.length === 0) {
    return {
      totalAsset: 0,
      assetDetails: {
        cash: { total: 0, details: [] },
        deposit: { total: 0, details: [] },
        stock: { total: 0, details: [] },
        insurance: { total: 0, details: [] },
        type: 'unknown'
      },
      comparisonData: {},
      typeAverages: null,
      timeComparisonData: {},
      loanData: { amount: 0, purpose: '', period: 0, interest: 0 }
    }
  }

  const currentData = rawAssetData.value[0] || {}
  const previousData = rawAssetData.value[1] || currentData
  const assetTypes = ['cash', 'deposit', 'stock', 'insurance']

  const currentAssetData = processAssetData(currentData, assetTypes)
  const previousAssetData = processAssetData(previousData, assetTypes)

  const calculateTotal = (assetData) =>
    Object.values(assetData).reduce(
      (total, { values }) => total + values.reduce((sum, val) => sum + Number(val), 0),
      0
    )

  const totalAsset = calculateTotal(currentAssetData)

  const assetDetails = assetTypes.reduce((details, type) => {
    details[type] = {
      total: currentAssetData[type].values.reduce((sum, val) => sum + Number(val), 0),
      details: currentAssetData[type].values.map((value, index) => ({
        bank: currentAssetData[type].banks[index],
        account: currentAssetData[type].accounts[index],
        value: Number(value)
      }))
    }
    return details
  }, {})

  const comparisonData = assetTypes.reduce((data, type) => {
    const currentTotal = currentAssetData[type].values.reduce((sum, val) => sum + Number(val), 0)
    const previousTotal = previousAssetData[type].values.reduce((sum, val) => sum + Number(val), 0)
    data[type] = {
      average: assetAverages.value ? assetAverages.value[type] : 0,
      user: currentTotal
    }
    return data
  }, {})

  const timeComparisonData = assetTypes.reduce((data, type) => {
    data[type] = {
      previousMonth: previousAssetData[type].values.reduce((sum, val) => sum + Number(val), 0),
      currentMonth: currentAssetData[type].values.reduce((sum, val) => sum + Number(val), 0)
    }
    return data
  }, {})

  const typeAverages = assetAverages.value
    ? assetTypes.reduce((averages, type) => {
        averages[type] = { total: assetAverages.value[type] || 0 }
        return averages
      }, {})
    : null

  return {
    totalAsset,
    assetDetails: { ...assetDetails, type: currentData.type || 'unknown' },
    comparisonData,
    typeAverages,
    timeComparisonData,
    loanData: {
      amount: Number(currentData.loanAmount),
      purpose: currentData.loanPurpose,
      period: Number(currentData.period),
      interest: Number(currentData.interest)
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

.asset-list__title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.asset-list__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.asset-list__section {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.asset-list__average-distribution {
  grid-column: 1 / -1;
}
.asset-list__total,
.asset-list__distribution {
  grid-column: 1 / -1;
}

.asset-list__comparison-container {
  grid-column: 1 / -1;
}

.asset-list__comparison-charts {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.asset-list__chart {
  flex: 1;
  min-width: 0;
}

.asset-list__loan,
.asset-list__recommendation {
  grid-column: 1 / -1;
}

.asset-list__loading,
.asset-list__error {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.asset-list__error {
  color: #ff4d4f;
}

@media (max-width: 768px) {
  .asset-list__comparison-charts {
    flex-direction: column;
  }

  .asset-list__chart {
    width: 100%;
  }
}
.asset-list__recommended-products {
  grid-column: 1 / -1;
}
.asset-list__distribution-slider {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.slider-content {
  flex-grow: 1;
  overflow: hidden;
}

.slider-btn {
  font-size: 30px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 15px;
}

.slider-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
