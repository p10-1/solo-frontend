<template>
  <div class="asset-list">
    <h1 class="asset-list__title">자산 정보</h1>
    <div v-if="assetStore.loading" class="asset-list__loading">Loading...</div>
    <div v-else-if="assetStore.error" class="asset-list__error">{{ assetStore.error }}</div>
    <template v-else-if="assetStore.processedData">
      <div class="asset-list__grid">
        <div class="asset-list__section asset-list__total">
          <TotalAsset :totalAmount="assetStore.processedData.totalAsset" />
        </div>
        <div class="asset-list__section asset-list__distribution-slider">
          <button @click="prevSlide" class="slider-btn prev-btn">‹</button>
          <div class="slider-content">
            <transition name="fade" mode="out-in">
              <Distribution
                v-if="currentSlide === 0"
                key="user-distribution"
                :assetDetails="assetStore.processedData.assetDetails"
                title="내 자산 분포"
              >
                <template #extra>
                  <div v-if="highestAssetType" class="asset-highlight">
                    보유 자산 중 {{ assetNames[highestAssetType] }}이 제일 많아요!
                  </div>
                </template>
              </Distribution>
              <DistributionAverage
                v-else-if="currentSlide === 1 && assetStore.processedData.typeAverages"
                key="type-average-distribution"
                :assetDetails="assetStore.processedData.typeAverages"
                :title="`${assetStore.processedData.assetDetails.type || '전체'} 평균 자산 분포`"
              />
              <DistributionAverage
                v-else-if="currentSlide === 2 && assetStore.processedData.overallAverages"
                key="overall-average-distribution"
                :assetDetails="assetStore.processedData.overallAverages"
                title="전체 사용자 평균 자산 분포"
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
                :userAsset="calculateTotalAssets(assetStore.processedData.assetDetails)"
                :userType="assetStore.processedData.assetDetails.type || 'unknown'"
                :selectedAssetType="selectedAssetType"
              />
            </div>
            <div class="asset-list__chart">
              <TimeComparison :assetType="selectedAssetType" :assetData="assetStore.rawAssetData" />
            </div>
          </div>
        </div>
        <div class="asset-list__section asset-list__loan">
          <h2 class="section-title">대출 정보</h2>
          <template v-if="hasLoanData">
            <LoanInfo :loanData="assetStore.processedData.loanData" />
          </template>
          <p v-else class="no-loan-message">대출이 존재하지 않습니다.</p>
        </div>
        <div class="asset-list__section asset-list__recommended-products">
          <h2 class="section-title">추천 상품</h2>
          <template v-if="hasLoanData">
            <Recommendation :loanPeriod="assetStore.processedData.loanData.period" />
          </template>
          <p v-else class="no-recommendation-message">대출 정보가 없어 추천 상품이 없습니다.</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
//src/components/AssetPage/AssetList.vue

import { ref, computed, onMounted } from 'vue'
import { useAssetStore } from '@/stores/assetStore'
import TotalAsset from '@/components/AssetPage/TotalAsset.vue'
import Distribution from '@/components/AssetPage/Distribution.vue'
import AssetTypeButtons from '@/components/AssetPage/AssetTypeButtons.vue'
import AssetComparison from '@/components/AssetPage/AssetComparison.vue'
import TimeComparison from '@/components/AssetPage/TimeComparison.vue'
import LoanInfo from '@/components/AssetPage/LoanInfo.vue'
import Recommendation from '@/components/AssetPage/Recommendation.vue'
import DistributionAverage from '@/components/AssetPage/DistributionAverage.vue'

const assetStore = useAssetStore()
const selectedAssetType = ref('cash')
const currentSlide = ref(0)
const totalSlides = 3

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

const highestAssetType = computed(() => {
  if (!assetStore.processedData || !assetStore.processedData.assetDetails) return null
  const sortedAssets = Object.entries(assetStore.processedData.assetDetails).sort(
    ([, a], [, b]) => b.total - a.total
  )
  return sortedAssets[0]?.[0]
})

const hasLoanData = computed(() => {
  if (!assetStore.processedData || !assetStore.processedData.loanData) return false
  const { amount, purpose, period, interest } = assetStore.processedData.loanData
  return amount > 0 || purpose || period > 0 || interest > 0
})

const calculateTotalAssets = (assetDetails) => {
  const totals = {}
  for (const [type, data] of Object.entries(assetDetails)) {
    totals[type] = data.total
  }
  return totals
}

const selectAssetType = (type) => {
  selectedAssetType.value = type
}

onMounted(() => {
  assetStore.loadData()
})
</script>

<style scoped>
.asset-list {
  /* 자산 목록의 최대 너비를 1200px로 설정하고, 중앙 정렬 및 20px의 패딩을 적용 */
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.asset-list__title {
  /* 타이틀 텍스트를 중앙에 정렬하고, 아래쪽에 30px의 여백 추가, 텍스트 색상을 #333으로 설정 */
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.asset-list__grid {
  /* 자산 목록의 그리드 레이아웃을 설정, 하나의 열로 구성하며, 각 항목 사이에 30px의 간격을 둠 */
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.asset-list__section {
  /* 각 자산 목록 섹션에 배경색을 흰색으로 설정하고, 둥근 모서리와 그림자 효과 추가, 20px의 내부 여백 적용 */
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
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

.asset-list__loading,
.asset-list__error {
  /* 로딩 및 에러 메시지를 중앙 정렬하고, 패딩을 20px로 설정, 글자 크기를 18px로 설정 */
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.asset-list__error {
  /* 에러 메시지의 글자 색상을 빨간색(#ff4d4f)으로 설정 */
  color: #ff4d4f;
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

.asset-list__no-loan {
  /* 대출 정보가 없을 때 메시지를 중앙 정렬하고, 배경색을 연한 회색(#f8f9fa)으로 설정, 둥근 모서리 및 글자 색상 적용 */
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #6c757d;
}

.section-title {
  /* 섹션 제목의 아래쪽에 15px의 여백을 추가하고, 글자 색상을 #333으로 설정 */
  margin-bottom: 15px;
  color: #333;
}

.no-loan-message,
.no-recommendation-message {
  /* 대출 정보 또는 추천 상품이 없을 때의 메시지를 중앙 정렬하고, 연한 회색 배경과 둥근 모서리 적용, 텍스트 색상을 회색(#6c757d)으로 설정 */
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #6c757d;
}

.asset-highlight {
  /* 자산 하이라이트 텍스트에 상단 10px의 여백과 굵은 글꼴, 초록색(#4caf50) 텍스트 색상을 적용 */
  margin-top: 10px;
  font-weight: bold;
  color: #4caf50;
}
</style>
