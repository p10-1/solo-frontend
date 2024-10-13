<template>
  <h2 class="comment-title">
    "<span class="text-accent">{{ authStore.userInfo.userName }}</span
    >"님의 자산을 <span class="text-accent">분석</span>했어요
    <span class="text-accent"><i class="fa-regular fa-face-smile-wink"></i></span>
  </h2>
  <section class="asset-list">
    <div v-if="loading" class="loading">
      <i class="fa-solid fa-spinner margin-bottom-1rem"></i>
      Loading...
    </div>
    <div v-else-if="error" class="error">
      <i class="fa-solid fa-xmark argin-bottom-1rem"></i>{{ error }}
    </div>
    <template v-else-if="processedData">
      <section class="asset-container">
        <div class="asset-top-content">
          <TotalAsset :totalAmount="processedData.totalAsset" class="margin-bottom-1rem" />
          <!-- 섹션: 자산 분포 및 평균과의 비교를 위한 슬라이더 -->
          <!-- <div class="asset-list__distribution-slider"> -->
          <!-- 이전 슬라이드 버튼 -->
          <div class="asset-statistics">
            <div class="asset-top-item">
              <Distribution
                :assetDetails="processedData.assetDetails"
                :title="'내 자산 분포'"
                :userType="processedData.assetDetails.type"
                comparisonType="personal"
                :userAssetDetails="processedData.assetDetails"
              />
            </div>
            <div class="asset-top-item">
              <AssetComment
                :assetDetails="processedData.assetDetails"
                :userType="processedData.assetDetails.type"
                comparisonType="personal"
                :userAssetDetails="processedData.assetDetails"
                customTitle=" 현재 내 자산은 ?"
              />
              <!-- <AssetComment
                :assetDetails="processedData.typeAverages"
                :userType="processedData.assetDetails.type"
                comparisonType="typeAverage"
                :userAssetDetails="processedData.assetDetails"
                :customTitle="`${processedData.assetDetails.type} 유형 평균과 비교 하면은 ?`"
              /> -->
              <AssetComment
                :assetDetails="processedData.overallAverages"
                userType="전체"
                comparisonType="overallAverage"
                :userAssetDetails="processedData.assetDetails"
                customTitle="전체 사용자 평균과 비교 하면 ?"
              />
            </div>

            <div class="asset-top-item">
              <swiper v-if="processedData" :navigation="true" :modules="modules" class="yourSwiper">
                <!-- 유형별 평균 자산 분포 슬라이드 -->
                <swiper-slide v-if="processedData.typeAverages">
                  <Distribution
                    :assetDetails="processedData.typeAverages"
                    :title="`${processedData.assetDetails.type || '전체'} 평균 자산 분포`"
                    :userType="processedData.assetDetails.type"
                    comparisonType="typeAverage"
                    :userAssetDetails="processedData.assetDetails"
                  />
                </swiper-slide>

                <!-- 전체 사용자 평균 자산 분포 슬라이드 -->
                <swiper-slide v-if="processedData.overallAverages">
                  <Distribution
                    :assetDetails="processedData.overallAverages"
                    title="전체 사용자 평균 자산 분포"
                    userType="전체"
                    comparisonType="overallAverage"
                    :userAssetDetails="processedData.assetDetails"
                  />
                </swiper-slide>
              </swiper>
            </div>
          </div>
        </div>
        <!-- 유형별 평균 자산 분포 -->
        <!-- <Distribution
          v-if="processedData.typeAverages"
          :assetDetails="processedData.typeAverages"
          :title="`${processedData.assetDetails.type || '전체'} 평균 자산 분포`"
        /> -->

        <!-- 전체 사용자 평균 자산 분포 -->
        <!-- <Distribution
          v-if="processedData.overallAverages"
          :assetDetails="processedData.overallAverages"
          title="전체 사용자 평균 자산 분포"
        /> -->

        <!-- 다음 슬라이드 버튼 -->
        <!-- <button @click="nextSlide" class="slider-btn next-btn">›</button> -->
        <!-- </div> -->

        <!-- 섹션: 자산 비교 차트 영역 -->
        <section class="asset-comparison-container">
          <div class="asset-comparison-content">
            <!-- 자산 종류 버튼 -->
            <AssetTypeButtons
              :selectedType="selectedAssetType"
              @select-type="selectAssetType"
              class="margin-top-3rem margin-bottom-1rem"
            />
            <!-- 자산 비교 차트 -->
            <div class="asset-comparison-charts">
              <!-- 사용자 자산과 선택된 자산 종류 간 비교 -->
              <div class="asset-chart">
                <AssetComparison
                  :userAsset="calculateTotalAssets(processedData.assetDetails)"
                  :userType="processedData.assetDetails.type || 'unknown'"
                  :selectedAssetType="selectedAssetType"
                />
              </div>
              <!-- 시간에 따른 자산 변화 비교 -->
              <div class="asset-chart">
                <TimeComparison :assetType="selectedAssetType" :assetData="rawAssetData" />
              </div>
            </div>
          </div>
        </section>
      </section>

      <!-- 섹션: 대출 정보 -->
      <div class="margin-top-3rem">
        <h2 class="title">대출 정보</h2>
        <dl v-if="processedData.loanData.purpose !== '전세자금'" class="radio-form margin-top-2rem">
          <dt>상환 방법</dt>
          <dd>
            <input
              type="radio"
              id="equal-principal-interest"
              value="equal-principal-interest"
              v-model="repaymentMethod"
            />
            <label
              for="equal-principal-interest"
              class="button-radio"
              :class="{ active: repaymentMethod === 'equal-principal-interest' }"
            >
              원리금 균등상환
            </label>
          </dd>
          <dd>
            <input
              type="radio"
              id="equal-principal"
              value="equal-principal"
              v-model="repaymentMethod"
            />
            <label
              for="equal-principal"
              class="button-radio"
              :class="{ active: repaymentMethod === 'equal-principal' }"
              >원금 균등상환</label
            >
          </dd>
        </dl>
        <!-- 대출 정보가 있는 경우 LoanInfo 컴포넌트로 대출 정보 표시 -->
        <section v-if="hasLoanData" class="laon-container">
          <div class="loan-info">
            <LoanInfo :loanData="processedData.loanData" />
          </div>
          <div class="loan-guide">
            <LoanGuide :loanData="processedData.loanData" :repaymentMethod="repaymentMethod" />
          </div>
        </section>
        <!-- 대출 정보가 없는 경우 안내 메시지 표시 -->
        <section v-else class="no-more">
          <i class="fa-solid fa-xmark argin-bottom-1rem"></i>
          대출이 존재하지 않습니다.
        </section>

        <!-- 섹션: 추천 상품 -->
        <!-- 대출 정보가 있는 경우 대출 기간에 따른 추천 상품 표시 -->
        <section v-if="hasLoanData" class="margin-top-3rem">
          <Recommendation :loanPeriod="processedData.loanData.period" />
        </section>
        <section v-else class="no-more">
          <i class="fa-solid fa-xmark argin-bottom-1rem"></i>
          대출 정보가 없어 추천 상품이 없습니다.
        </section>
      </div>
    </template>
  </section>
</template>

<script setup>
//src/components/AssetPage/AssetList.vue

import { ref, computed, onMounted } from 'vue'
import { fetchAssetData, fetchAssetComparison } from '@/api/assetApi'
import { useAuthStore } from '@/stores/authStore'
import TotalAsset from '@/components/AssetPage/TotalAsset.vue'
import Distribution from '@/components/AssetPage/Distribution.vue'
import AssetTypeButtons from '@/components/AssetPage/AssetTypeButtons.vue'
import AssetComparison from '@/components/AssetPage/AssetComparison.vue'
import TimeComparison from '@/components/AssetPage/TimeComparison.vue'
import LoanInfo from '@/components/AssetPage/LoanInfo.vue'
import Recommendation from '@/components/AssetPage/Recommendation.vue'
import LoanGuide from '@/components/AssetPage/LoanGuide.vue'
import AssetComment from '@/components/AssetPage/AssetComment.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
const modules = [Navigation]
const authStore = useAuthStore()
const loading = ref(true) // 로딩 상태 관리
const error = ref(null) // 에러 상태 관리

const rawAssetData = ref(null) // 자산 데이터 원본
const assetAverages = ref(null) // 평균 자산 데이터
const assetStyle = ref(null)

const selectedAssetType = ref('cash') // 선택된 자산 타입 기본값은 'cash'

// //슬라이드 구현
// const currentSlide = ref(0)
// const totalSlides = 3 // 전체 슬라이드 수를 3으로 변경

// const nextSlide = () => {
//   currentSlide.value = (currentSlide.value + 1) % totalSlides
// }

// const prevSlide = () => {
//   currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides
// }

// const assetNames = {
//   cash: '현금자산',
//   deposit: '예적금',
//   stock: '주식',
//   insurance: '보험'
// }
// 자산 데이터 및 평균 데이터를 API로부터 로드하는 함수
const fieldMapping = {
  cash: { bank: 'cashBank', account: 'cashAccount', value: 'cash' },
  deposit: { bank: 'depositBank', account: 'depositAccount', value: 'deposit' },
  stock: { bank: 'stockBank', account: 'stockAccount', value: 'stock' },
  insurance: { bank: 'insuranceCompany', account: 'insuranceName', value: 'insurance' }
}
// const highestAssetType = computed(() => {
//   if (!processedData.value || !processedData.value.assetDetails) return null
//   const sortedAssets = Object.entries(processedData.value.assetDetails).sort(
//     ([, a], [, b]) => b.total - a.total
//   )
//   return sortedAssets[0]?.[0]
// })
const loadData = async () => {
  console.log('1. loadData 함수 시작')
  try {
    loading.value = true
    const assetData = await fetchAssetData()
    console.log('3.assetData: ', assetData[0].type)
    rawAssetData.value = assetData
    console.log('3.rawAssetData: ', rawAssetData.value)
    // assetAverages.value = averages
    const assetDetail = await fetchAssetComparison(assetData[0].type)
    console.log('assetDetail: ', assetDetail)
    assetAverages.value = assetDetail.overallAverage
    assetStyle.value = assetDetail.typeAverage
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

  const typeAverages = assetStyle.value
    ? assetTypes.reduce((averages, type) => {
        averages[type] = { total: assetStyle.value[type] || 0 }
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

const repaymentMethod = ref('equal-principal-interest')

onMounted(async () => {
  await loadData()
})
</script>

<style scoped>
.asset-top-content {
  background-color: #f3f3ff;
  padding: 2rem 1.5rem;
  border-radius: 28px;
}
.asset-top-content .asset-statistics {
  display: flex;
  gap: 1rem;
}
.asset-statistics .asset-top-item {
  width: calc(33.3% - 0.3rem);
}

.asset-comparison-charts {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
  background-color: #e4deff;
  padding: 2rem 1.5rem;
  border-radius: 28px;
}
.asset-comparison-charts .asset-chart {
  width: calc(50% - 0.5rem);
}
.laon-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
  background-color: #f3f3ff;
  padding: 2rem 1.5rem;
  border-radius: 28px;
}
.laon-container > div {
  width: 50%;
}
</style>
