<template>
  <div class="main-slide-box">
    <swiper
      :pagination="{ clickable: true }"
      :modules="modules"
      v-bind="swiperOptions"
      class="mySwiper"
    >
      <!-- 각 슬라이드에 대한 반복 (key 추가) -->
      <swiper-slide v-for="(slide, index) in slides" :key="index">
        <router-link to="asset">
          <div class="asset-distribution">
            <h3 class="main-title">{{ slide.title }}</h3>
            <div class="card-content">
              <!-- 도넛 차트 컴포넌트 -->
              <div class="asset-chart-container">
                <ChartComponent type="doughnut" :data="slide.chartData" :options="chartOptions" />
              </div>
              <!-- 자산 상세 정보 목록 -->
              <div class="asset-legend">
                <div class="total-asset">
                  <span class="total-label">총 자산</span>
                  <span class="total-amount">{{ formatNumber(slide.totalAsset) }}원</span>
                </div>
                <ul
                  v-for="asset in slide.filteredAssetDetails"
                  :key="asset.name"
                  class="asset-type"
                >
                  <li class="asset-name">
                    <span
                      :style="{ backgroundColor: getAssetColor(asset.name) }"
                      class="type-color"
                    ></span>
                    {{ assetNames[asset.name] }}
                  </li>
                  <li class="asset-percentage">{{ formatNumber(asset.percentage) }}%</li>
                  <li class="asset-amount">
                    <span class="text-accent">{{ formatNumber(Math.round(asset.total)) }}</span
                    >원
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </router-link>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import ChartComponent from '@/components/common/ChartComponent.vue'
import { fetchAssetData, fetchAssetComparison } from '@/api/assetApi'
import 'swiper/css'
import 'swiper/css/pagination'

// 자산 데이터와 비교 데이터를 저장할 ref
const assetData = ref(null)
const comparisonData = ref(null)
const userType = ref('')
const modules = [Pagination, Autoplay]

// 자산 유형에 대한 한글 이름 매핑
const assetNames = {
  cash: '현금',
  deposit: '예적금',
  stock: '증권',
  insurance: '보험'
}

// 자산 유형별 색상 매핑
const assetColors = {
  cash: '#FFCC00',
  deposit: '#CFDF4B',
  stock: '#A17FF0',
  insurance: '#5F7DFF'
}

// API에서 자산 데이터를 불러오는 함수
const loadAssetData = async () => {
  try {
    const data = await fetchAssetData()
    if (data && data.length > 0) {
      assetData.value = processAssetData(data[0])
      userType.value = data[0].type || '전체'
    }
    const comparison = await fetchAssetComparison(userType.value)
    comparisonData.value = comparison
  } catch (error) {
    // 에러 처리
  }
}
// 자산 데이터를 정렬하는 함수
const sortAssetDetails = (assetDetails) => {
  return Object.entries(assetDetails)
    .map(([name, details]) => ({ name, ...details }))
    .sort((a, b) => b.total - a.total)
    .filter((asset) => asset.total > 0)
}

// 퍼센티지 계산 함수
const calculatePercentage = (value, total) => {
  if (total === 0 || isNaN(value)) return 0
  return Math.round((value / total) * 100) // 소수점 첫째 자리에서 반올림
}

// 평균 데이터 처리 함수
const processAverageData = (data) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0)
  const result = Object.entries(data).map(([name, value]) => ({
    name,
    total: value,
    percentage: calculatePercentage(value, total)
  }))
  return result
}

// 자산 데이터 처리 함수
const processAssetData = (data) => {
  const assetTypes = ['cash', 'deposit', 'stock', 'insurance']
  const processed = {}
  let total = 0
  assetTypes.forEach((type) => {
    const values = JSON.parse(data[type] || '[]')
    const typeTotal = values.reduce((sum, val) => sum + Number(val), 0)
    processed[type] = {
      total: typeTotal,
      details: values.map((value) => ({ value: Number(value) }))
    }
    total += typeTotal
  })
  // 퍼센트 계산 추가
  for (const type in processed) {
    processed[type].percentage = calculatePercentage(processed[type].total, total)
  }
  return processed
}

// 차트 데이터 생성 함수
const createChartData = (data) => {
  const total = Object.values(data).reduce(
    (sum, value) => sum + (typeof value === 'object' ? value.total : value),
    0
  )
  const result = {
    labels: Object.keys(data).map((key) => assetNames[key]),
    datasets: [
      {
        data: Object.entries(data).map(([key, value]) => ({
          value: typeof value === 'object' ? value.total : value,
          percentage: calculatePercentage(typeof value === 'object' ? value.total : value, total)
        })),
        backgroundColor: Object.keys(data).map((key) => assetColors[key])
      }
    ]
  }
  return result
}

// 차트 옵션 설정
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || ''
          const value = context.raw.value || 0
          const percentage = context.raw.percentage || 0
          return `${label}: ${formatNumber(value)}원 (${percentage}%)`
        }
      }
    }
  }
}

const formatNumber = (num) => {
  if (isNaN(num) || num === undefined || num === null) {
    return '0'
  }
  return Math.round(num).toLocaleString() // 소수점 값을 반올림하여 정수로 표시
}

// 자산 유형에 따른 색상 반환 함수
const getAssetColor = (assetName) => {
  return assetColors[assetName] || '#9966FF'
}

// 슬라이드 데이터 계산
// 슬라이드 데이터 계산 함수 수정
const slides = computed(() => {
  if (!assetData.value || !comparisonData.value) return []

  const calculateTotalAsset = (data) => {
    return Object.values(data).reduce((sum, asset) => sum + (asset.total || asset), 0)
  }

  const userAssetSlide = {
    title: '내 자산 분포',
    chartData: createChartData(assetData.value || {}),
    filteredAssetDetails: Object.entries(assetData.value || {})
      .map(([name, details]) => ({ name, ...details }))
      .filter((asset) => asset.total > 0),
    highlight: '보유 자산 중 현금이 제일 많아요!',
    totalAsset: calculateTotalAsset(assetData.value || {})
  }

  const typeAverageSlide = {
    title: `${userType.value} 평균 자산 분포`,
    chartData: createChartData(comparisonData.value?.typeAverage || {}),
    filteredAssetDetails: processAverageData(comparisonData.value?.typeAverage || {}),
    totalAsset: calculateTotalAsset(comparisonData.value?.typeAverage || {})
  }

  const overallAverageSlide = {
    title: '전체 평균 자산 분포',
    chartData: createChartData(comparisonData.value?.overallAverage || {}),
    filteredAssetDetails: processAverageData(comparisonData.value?.overallAverage || {}),
    totalAsset: calculateTotalAsset(comparisonData.value?.overallAverage || {})
  }

  return [userAssetSlide, typeAverageSlide, overallAverageSlide]
})

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadAssetData()
})
</script>

<style scoped>
/* 자산 분포 컨테이너 스타일 */
.total-asset {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 2px solid #eae6ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.total-asset .total-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}
.total-asset .total-amount {
  font-size: 1.3rem;
  font-weight: 700;
  color: #6846f5;
}
.asset-distribution {
  width: 100%;
  padding: 1rem 0;
}

/* 자산 콘텐츠 레이아웃 */
.asset-distribution .card-content {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1rem;
  border-radius: 25px;
  background-color: #fff;
  box-shadow: 0px 0px 12px rgba(221, 214, 255, 1);
  margin: 1.2rem 0.5rem 0;
}

/* 차트 컨테이너 크기 설정 */
.asset-chart-container {
  width: 50%;
  max-width: 250px;
}
/* 자산 범례 스타일 */
.asset-distribution .card-content .asset-legend {
  width: 50%;
}
.asset-legend .advice {
  margin-top: -1.5rem;
  margin-bottom: 20px;
}
.asset-legend .advice .guide {
  display: block;
  font-weight: 600;
  color: #b6a8ff;
  letter-spacing: -0.8px;
  margin-bottom: 5px;
}
.asset-legend .advice p {
  font-size: 0.81rem;
  line-height: 1.5;
  color: #666;
  word-break: keep-all;
  margin-bottom: 0;
}

/* 각 자산 유형 항목 스타일 */
.asset-legend ul.asset-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px; /* 자산 항목 간의 간격 조정 */
  padding-bottom: 10px;
  border-bottom: 1px dashed #eae6ff;
}
.asset-legend .asset-type:last-child {
  margin-bottom: 0;
  border-bottom: 0;
  padding-bottom: 0;
}

/* 자산 이름 스타일 */
.asset-legend .asset-name {
  flex: 0 0 30%;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.8px;
}
/* 자산 유형 색상 표시 스타일 */
.asset-legend .asset-name .type-color {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 2px;
}

/* 자산 퍼센티지 스타일 */
.asset-legend .asset-percentage {
  flex: 0 0 10%;
  font-weight: 600;
  padding: 3px 10px;
  background-color: #f3f3ff;
  color: #666;
  border-radius: 20px;
  font-size: 0.85rem;
  line-height: 1rem;
}

/* 자산 금액 스타일 */
.asset-legend .asset-amount {
  text-align: right;
  flex: 0 0 50%;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.8px;
  color: #333;
}
.asset-legend .asset-amount .text-accent {
  font-weight: 700;
}

/* 반응형 디자인: 모바일 화면 대응 */
@media (max-width: 768px) {
  .asset-content {
    flex-direction: column;
  }

  .asset-chart-container,
  .asset-legend {
    width: 100%;
    max-width: none;
    margin-left: 0;
  }

  .asset-chart-container {
    margin-bottom: 20px;
  }
}

/* Swiper 페이지네이션 스타일 커스터마이징 */
:deep(.swiper-pagination-bullet) {
  background: #cfc6fd;
  opacity: 1;
}

:deep(.swiper-pagination-bullet-active) {
  background: #6846f5;
}
</style>
