<template>
  <h2 class="comment-title">
    "<span class="text-accent">ㅇㅇ</span>"님의 자산을 <span class="text-accent">분석</span>했어요
    <span class="text-accent"><i class="fa-regular fa-face-smile-wink"></i></span>
  </h2>
  <div class="asset-list">
    <div v-if="loading" class="loading">
      <i class="fa-solid fa-spinner margin-bottom-1rem"></i><br />
      Loading...
    </div>
    <div v-else-if="error" class="error">
      <i class="fa-solid fa-xmark argin-bottom-1rem"></i><br />{{ error }}
    </div>
    <template v-else-if="processedData">
      <div class="asset-list__grid">
        <!-- 섹션: 전체 자산 금액을 표시하는 TotalAsset 컴포넌트 -->
        <TotalAsset :totalAmount="processedData.totalAsset" />

        <!-- 섹션: 자산 분포 및 평균과의 비교를 위한 슬라이더 -->
        <div class="asset-list__distribution-slider">
          <!-- 이전 슬라이드 버튼 -->
          <button @click="prevSlide" class="slider-btn prev-btn">‹</button>

          <!-- 슬라이더 콘텐츠 영역 -->
          <div class="slider-content">
            <!-- 페이드 효과로 슬라이드 전환 -->
            <transition name="fade" mode="out-in">
              <!-- 첫 번째 슬라이드: 사용자 자산 분포를 나타냄 -->
              <Distribution
                v-if="currentSlide === 0"
                key="user-distribution"
                :assetDetails="processedData.assetDetails"
                title="내 자산 분포"
              >
                <!-- 추가 콘텐츠 영역: 가장 많은 자산 종류 표시 -->
                <template #extra>
                  <div v-if="highestAssetType" class="asset-highlight">
                    보유 자산 중 {{ assetNames[highestAssetType] }}이 제일 많아요!
                  </div>
                </template>
              </Distribution>

              <!-- 두 번째 슬라이드: 유형별 평균 자산 분포를 나타냄 -->
              <DistributionAverage
                v-else-if="currentSlide === 1 && processedData.typeAverages"
                key="type-average-distribution"
                :assetDetails="processedData.typeAverages"
                :title="`${processedData.assetDetails.type || '전체'} 평균 자산 분포`"
              />

              <!-- 세 번째 슬라이드: 전체 사용자 평균 자산 분포 -->
              <DistributionAverage
                v-else-if="currentSlide === 2 && processedData.overallAverages"
                key="overall-average-distribution"
                :assetDetails="processedData.overallAverages"
                title="전체 사용자 평균 자산 분포"
              />
            </transition>
          </div>

          <!-- 다음 슬라이드 버튼 -->
          <button @click="nextSlide" class="slider-btn next-btn">›</button>
        </div>

        <!-- 섹션: 자산 비교 차트 영역 -->
        <div class="asset-list__comparison-container">
          <!-- 자산 종류 버튼 -->
          <AssetTypeButtons :selectedType="selectedAssetType" @select-type="selectAssetType" />

          <!-- 자산 비교 차트 -->
          <div class="asset-list__comparison-charts">
            <!-- 사용자 자산과 선택된 자산 종류 간 비교 -->
            <div class="asset-list__chart">
              <AssetComparison
                :userAsset="calculateTotalAssets(processedData.assetDetails)"
                :userType="processedData.assetDetails.type || 'unknown'"
                :selectedAssetType="selectedAssetType"
              />
            </div>

            <!-- 시간에 따른 자산 변화 비교 -->
            <div class="asset-list__chart">
              <TimeComparison :assetType="selectedAssetType" :assetData="rawAssetData" />
            </div>
          </div>
        </div>

        <!-- 섹션: 대출 정보 -->
        <div class="asset-list__loan">
          <!-- 대출 정보가 있는 경우 LoanInfo 컴포넌트로 대출 정보 표시 -->
          <template v-if="hasLoanData">
            <LoanInfo :loanData="processedData.loanData" />
          </template>
          <!-- 대출 정보가 없는 경우 안내 메시지 표시 -->
          <div v-else class="no-more">
            <i class="fa-solid fa-xmark argin-bottom-1rem"></i><br />
            대출이 존재하지 않습니다.
          </div>
        </div>

        <!-- 섹션: 추천 상품 -->
        <div class="asset-list__recommended-products">
          <!-- 대출 정보가 있는 경우 대출 기간에 따른 추천 상품 표시 -->
          <template v-if="hasLoanData">
            <Recommendation :loanPeriod="processedData.loanData.period" />
          </template>
          <div v-else class="no-more">
            <i class="fa-solid fa-xmark argin-bottom-1rem"></i><br />
            대출 정보가 없어 추천 상품이 없습니다.
          </div>
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
import DistributionAverage from '@/components/AssetPage/DistributionAverage.vue'

const loading = ref(true) // 로딩 상태 관리
const error = ref(null) // 에러 상태 관리

const rawAssetData = ref(null) // 자산 데이터 원본
const assetAverages = ref(null) // 평균 자산 데이터
const selectedAssetType = ref('cash') // 선택된 자산 타입 기본값은 'cash'

//슬라이드 구현
const currentSlide = ref(0)
const totalSlides = 3 // 전체 슬라이드 수를 3으로 변경

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides
}

const assetNames = {
  cash: '현금자산',
  deposit: '예적금',
  stock: '주식',
  insurance: '보험'
}
// 자산 데이터 및 평균 데이터를 API로부터 로드하는 함수

const fieldMapping = {
  cash: { bank: 'cashBank', account: 'cashAccount', value: 'cash' },
  deposit: { bank: 'depositBank', account: 'depositAccount', value: 'deposit' },
  stock: { bank: 'stockBank', account: 'stockAccount', value: 'stock' },
  insurance: { bank: 'insuranceCompany', account: 'insuranceName', value: 'insurance' }
}
const highestAssetType = computed(() => {
  if (!processedData.value || !processedData.value.assetDetails) return null
  const sortedAssets = Object.entries(processedData.value.assetDetails).sort(
    ([, a], [, b]) => b.total - a.total
  )
  return sortedAssets[0]?.[0]
})
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
      const values = parseJsonArray(data[mapping.value])
      const banks = parseJsonArray(data[mapping.bank])
      const accounts = parseJsonArray(data[mapping.account])

      processed[type] = {
        values: values.length ? values.map((v) => Number(v) || 0) : [0],
        banks: banks.length ? banks : [''],
        accounts: accounts.length ? accounts : ['']
      }
    }
    return processed
  }, {})
}
const calculateAverage = (values) => {
  const validValues = values.filter((v) => v > 0)
  return validValues.length
    ? validValues.reduce((sum, val) => sum + val, 0) / validValues.length
    : 0
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
        type: '유형을 입력해 주세요'
      },
      comparisonData: {},
      typeAverages: null,
      timeComparisonData: {},
      loanData: { amount: 0, purpose: '', period: 0, interest: 0 },
      overallAverages: null
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
    const values = currentAssetData[type].values
    details[type] = {
      total: values.reduce((sum, val) => sum + val, 0),
      details: values.map((value, index) => ({
        bank: currentAssetData[type].banks[index] || '',
        account: currentAssetData[type].accounts[index] || '',
        value: value
      }))
    }
    return details
  }, {})

  const comparisonData = assetTypes.reduce((data, type) => {
    const currentValues = currentAssetData[type].values
    const previousValues = previousAssetData[type].values
    data[type] = {
      average: assetAverages.value ? assetAverages.value[type] : 0,
      user: calculateAverage(currentValues),
      previousAverage: calculateAverage(previousValues)
    }
    return data
  }, {})

  const timeComparisonData = assetTypes.reduce((data, type) => {
    data[type] = {
      previousMonth: calculateAverage(previousAssetData[type].values),
      currentMonth: calculateAverage(currentAssetData[type].values)
    }
    return data
  }, {})

  const typeAverages = assetAverages.value
    ? assetTypes.reduce((averages, type) => {
        averages[type] = { total: assetAverages.value[type] || 0 }
        return averages
      }, {})
    : null
  // 새로 추가된 부분: overallAverages 계산
  const overallAverages = assetAverages.value
    ? assetTypes.reduce((averages, type) => {
        averages[type] = { total: assetAverages.value[type] || 0 }
        return averages
      }, {})
    : null

  return {
    totalAsset,
    assetDetails: { ...assetDetails, type: currentData.type || '유형을 입력해주세요' },
    comparisonData,
    typeAverages,
    overallAverages, // 여기에 overallAverages 추가
    timeComparisonData,
    loanData: {
      amount: Number(currentData.loanAmount),
      purpose: currentData.loanPurpose,
      period: Number(currentData.period),
      interest: Number(currentData.interest)
    }
  }
})

// 대출 정보 존재 여부를 확인하는 computed 속성
const hasLoanData = computed(() => {
  if (!processedData.value || !processedData.value.loanData) return false
  const { amount, purpose, period, interest } = processedData.value.loanData
  return amount > 0 || purpose || period > 0 || interest > 0
})
const selectAssetType = (type) => {
  selectedAssetType.value = type
}

onMounted(async () => {
  await loadData()
})
</script>

<style scoped>
.asset-list__grid {
  /* 자산 목록의 그리드 레이아웃을 설정, 하나의 열로 구성하며, 각 항목 사이에 30px의 간격을 둠 */
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.asset-list__average-distribution {
  /* 자산 분포 섹션이 그리드에서 전체 너비를 차지하도록 설정 */
  grid-column: 1 / -1;
}

.asset-list__total,
.asset-list__distribution {
  /* 전체 자산 및 자산 분포 섹션이 그리드에서 전체 너비를 차지하도록 설정 */
  grid-column: 1 / -1;
}

.asset-list__comparison-container {
  /* 자산 비교 섹션이 그리드에서 전체 너비를 차지하도록 설정 */
  grid-column: 1 / -1;
}

.asset-list__comparison-charts {
  /* 자산 비교 차트를 가로로 배치하고, 차트들 간의 간격을 20px로 설정, 상단에 20px의 여백 추가 */
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.asset-list__chart {
  /* 각 차트 영역이 동일한 비율로 크기를 조절하고, 최소 너비를 0으로 설정해 차트가 작아지더라도 레이아웃이 유지되도록 설정 */
  flex: 1;
  min-width: 0;
}

.asset-list__loan,
.asset-list__recommendation {
  /* 대출 정보 및 추천 상품 섹션이 그리드에서 전체 너비를 차지하도록 설정 */
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .asset-list__comparison-charts {
    /* 화면 너비가 768px 이하일 때, 자산 비교 차트를 세로로 배치 */
    flex-direction: column;
  }

  .asset-list__chart {
    /* 화면 너비가 좁아지면 차트의 너비를 100%로 설정하여 가득 채우도록 설정 */
    width: 100%;
  }
}

.asset-list__recommended-products {
  /* 추천 상품 섹션이 그리드에서 전체 너비를 차지하도록 설정 */
  grid-column: 1 / -1;
}

.asset-list__distribution-slider {
  /* 자산 분포 슬라이더의 버튼과 슬라이더 콘텐츠가 수평으로 정렬되도록 설정 */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.slider-content {
  /* 슬라이더의 콘텐츠가 그리드 영역을 꽉 채우고, 넘치는 콘텐츠는 숨김 처리 */
  flex-grow: 1;
  overflow: hidden;
}

.slider-btn {
  /* 슬라이더 버튼의 크기를 30px로 설정하고, 배경과 테두리 없이 버튼을 표시, 커서가 포인터로 변경되도록 설정 */
  font-size: 30px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 15px;
}

.slider-btn:disabled {
  /* 비활성화된 슬라이더 버튼의 불투명도를 낮추고, 커서가 기본 모양으로 변경되도록 설정 */
  opacity: 0.5;
  cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  /* 슬라이더 페이드 효과의 트랜지션 지속 시간을 0.5초로 설정 */
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  /* 슬라이더 페이드 효과가 시작되거나 종료될 때 투명하게 설정 */
  opacity: 0;
}

.asset-highlight {
  /* 자산 하이라이트 텍스트에 상단 10px의 여백과 굵은 글꼴, 초록색(#4caf50) 텍스트 색상을 적용 */
  margin-top: 10px;
  font-weight: bold;
  color: #4caf50;
}
</style>
