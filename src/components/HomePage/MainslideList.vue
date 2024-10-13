<template>
  <div class="main-slide-box">
    <h2 class="main-title">내 자산 현황</h2>
    <div class="main-slide-contents margin-top-1rem">
      <!-- Swiper 컴포넌트를 사용하여 슬라이드 구현 -->
      <swiper
        :pagination="{ clickable: true }"
        :modules="modules"
        :loop="true"
        :slides-per-view="1"
        :space-between="20"
        :initial-slide="0"
        class="mySwiper"
      >
        <!-- 각 슬라이드에 대한 반복 -->
        <swiper-slide v-for="(slide, index) in slides" :key="index">
          <router-link to="asset">
            <div class="asset-distribution">
              <h3 class="slide-title">{{ slide.title }}</h3>
              <!-- 하이라이트 정보 표시 (있는 경우) -->
              <div v-if="slide.highlight" class="asset-highlight">
                <i class="fa-solid fa-circle-info"></i>
                {{ slide.highlight }}
              </div>
              <div class="asset-content">
                <!-- 도넛 차트 컴포넌트 -->
                <div class="asset-chart-container">
                  <ChartComponent type="doughnut" :data="slide.chartData" :options="chartOptions" />
                </div>
                <!-- 자산 상세 정보 목록 -->
                <div class="asset-legend">
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
                      <span class="text-accent">{{ formatNumber(Math.round(asset.total)) }}</span>
                      원
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, Navigation } from 'swiper/modules'
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
  cash: '현금자산',
  deposit: '예적금',
  stock: '증권',
  insurance: '보험'
}

// 자산 유형별 색상 매핑
const assetColors = {
  cash: '#FF6384',
  deposit: '#36A2EB',
  stock: '#FFCE56',
  insurance: '#4BC0C0'
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

// 숫자 포맷팅 함수
const formatNumber = (num) => {
  if (isNaN(num) || num === undefined || num === null) {
    return '0'
  }
  return num.toLocaleString()
}

// 자산 유형에 따른 색상 반환 함수
const getAssetColor = (assetName) => {
  return assetColors[assetName] || '#9966FF'
}

// 슬라이드 데이터 계산
const slides = computed(() => {
  if (!assetData.value || !comparisonData.value) return []

  const userAssetSlide = {
    title: '내 자산 분포',
    chartData: createChartData(assetData.value || {}),
    filteredAssetDetails: Object.entries(assetData.value || {})
      .map(([name, details]) => ({ name, ...details }))
      .filter((asset) => asset.total > 0),
    highlight: '보유 자산 중 현금자산이 제일 많아요!'
  }

  const typeAverageSlide = {
    title: `${userType.value} 평균 자산 분포`,
    chartData: createChartData(comparisonData.value?.typeAverage || {}),
    filteredAssetDetails: processAverageData(comparisonData.value?.typeAverage || {})
  }

  const overallAverageSlide = {
    title: '전체 평균 자산 분포',
    chartData: createChartData(comparisonData.value?.overallAverage || {}),
    filteredAssetDetails: processAverageData(comparisonData.value?.overallAverage || {})
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
.asset-distribution {
  border-radius: 25px;
  padding: 2rem 1.7rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
}

/* 슬라이드 제목 스타일 */
.slide-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

/* 자산 하이라이트 정보 스타일 */
.asset-highlight {
  font-size: 1rem;
  color: #555;
  letter-spacing: -0.5px;
  font-weight: 500;
  padding: 10px 12px;
  word-break: keep-all;
  border-radius: 12px;
  background-color: #fffbec;
  color: var(--font-secondary, #475067);
  margin-bottom: 15px;
}

/* 자산 콘텐츠 레이아웃 */
.asset-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* 차트 컨테이너 크기 설정 */
.asset-chart-container {
  width: 45%;
  max-width: 300px;
}

/* 자산 범례 스타일 */
.asset-legend {
  width: 45%;
  margin-left: 5%;
}

/* 각 자산 유형 항목 스타일 */
.asset-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #cfc6fd;
}

/* 자산 이름 스타일 */
.asset-name {
  display: flex;
  align-items: center;
}

/* 자산 유형 색상 표시 스타일 */
.type-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

/* 자산 퍼센티지 스타일 */
.asset-percentage {
  font-weight: bold;
  padding: 2px 6px;
  background-color: #f3f3ff;
  border-radius: 10px;
}

/* 자산 금액 스타일 */
.asset-amount {
  font-size: 0.9rem;
  font-weight: 500;
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
