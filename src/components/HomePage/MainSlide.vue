<template>
  <div class="main-slide-box">
    <swiper
      :pagination="{ clickable: true }"
      :modules="modules"
      v-bind="swiperOptions"
      class="mySwiper"
    >
      <swiper-slide v-for="(slide, index) in slides" :key="index">
        <router-link to="asset">
          <div class="asset-distribution">
            <h3 class="main-title">{{ slide.title }}</h3>
            <div class="card-content">
              <div class="asset-chart-container">
                <ChartComponent type="doughnut" :data="slide.chartData" :options="chartOptions" />
              </div>
              <div class="asset-legend">
                <div class="total-asset">
                  <span class="total-label">총 자산</span>
                  <span class="total-amount"
                    ><span class="text-accent">{{ formatNumber(slide.totalAsset) }}</span
                    >원</span
                  >
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
import { Pagination } from 'swiper/modules'
import ChartComponent from '@/components/common/ChartComponent.vue'
import { fetchAssetData, fetchAssetComparison } from '@/api/assetApi'
import 'swiper/css'
import 'swiper/css/pagination'

const assetData = ref(null)
const comparisonData = ref(null)
const userType = ref('')
const modules = [Pagination]

const assetNames = {
  cash: '현금',
  deposit: '예적금',
  stock: '증권',
  insurance: '보험'
}

const assetColors = {
  cash: '#FFCC00',
  deposit: '#CFDF4B',
  stock: '#A17FF0',
  insurance: '#5F7DFF'
}

const loadAssetData = async () => {
  try {
    const data = await fetchAssetData()
    console.log('Fetched user asset data:', data)
    if (data && data.length > 0) {
      assetData.value = processAndSortAssetData(data[0], '사용자 자산')
      userType.value = data[0].type || '전체'
    }
    const comparison = await fetchAssetComparison(userType.value)
    console.log('Fetched comparison data:', comparison)
    comparisonData.value = comparison
  } catch (error) {
    console.error('데이터 로드 중 오류 발생:', error)
  }
}

const calculatePercentage = (value, total) => {
  if (total === 0 || isNaN(value)) return 0
  return Math.round((value / total) * 100)
}

const processAndSortAssetData = (data, slideType) => {
  console.log(`1. ${slideType} - 원본 데이터:`, data)

  let processedData = {}
  let total = 0

  if (slideType === '사용자 자산') {
    const assetTypes = ['cash', 'deposit', 'stock', 'insurance']
    assetTypes.forEach((type) => {
      let typeTotal = 0
      if (Array.isArray(data[type])) {
        typeTotal = data[type].reduce((sum, val) => sum + Number(val), 0)
      } else if (typeof data[type] === 'string') {
        const values = JSON.parse(data[type] || '[]')
        typeTotal = values.reduce((sum, val) => sum + Number(val), 0)
      } else if (typeof data[type] === 'number') {
        typeTotal = data[type]
      }
      processedData[type] = { total: typeTotal }
      total += typeTotal
    })
  } else {
    processedData = { ...data }
    total = Object.values(data).reduce((sum, value) => sum + Number(value), 0)
  }

  console.log(`2. ${slideType} - 처리된 데이터:`, processedData)

  const sortedAssets = Object.entries(processedData)
    .map(([name, details]) => ({
      name,
      total: typeof details === 'object' ? details.total : details,
      percentage: calculatePercentage(typeof details === 'object' ? details.total : details, total)
    }))
    .sort((a, b) => b.total - a.total)
    .filter((asset) => asset.total > 0)

  console.log(`3. ${slideType} - 정렬 및 필터링된 자산:`, sortedAssets)

  return { sortedAssets, total }
}

const createChartData = (sortedAssets) => {
  return {
    labels: sortedAssets.map((asset) => assetNames[asset.name]),
    datasets: [
      {
        data: sortedAssets.map((asset) => ({
          value: asset.total,
          percentage: asset.percentage
        })),
        backgroundColor: sortedAssets.map((asset) => getAssetColor(asset.name))
      }
    ]
  }
}

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
          const value = context.raw.value
          const percentage = context.raw.percentage
          return `${label}: ${formatNumber(value)}원 (${formatNumber(percentage)}%)`
        }
      }
    }
  }
}

const formatNumber = (num) => {
  if (isNaN(num) || num === undefined || num === null) {
    return '0'
  }
  return Math.round(num).toLocaleString()
}

const getAssetColor = (assetName) => {
  return assetColors[assetName] || '#9966FF'
}

const slides = computed(() => {
  if (!assetData.value || !comparisonData.value) return []

  console.log('슬라이드 데이터 계산 시작')
  console.log('assetData:', assetData.value)
  console.log('comparisonData:', comparisonData.value)

  const userAssetSlide = {
    title: '내 자산 분포',
    chartData: createChartData(assetData.value.sortedAssets),
    filteredAssetDetails: assetData.value.sortedAssets,
    totalAsset: assetData.value.total,
    highlight: '보유 자산 중 현금이 제일 많아요!'
  }
  console.log('사용자 자산 슬라이드:', userAssetSlide)

  const typeAverageProcessed = processAndSortAssetData(
    comparisonData.value?.typeAverage || {},
    '유형별 평균'
  )
  const typeAverageSlide = {
    title: `${userType.value} 평균 자산 분포`,
    chartData: createChartData(typeAverageProcessed.sortedAssets),
    filteredAssetDetails: typeAverageProcessed.sortedAssets,
    totalAsset: typeAverageProcessed.total
  }
  console.log('유형별 평균 자산 슬라이드:', typeAverageSlide)

  const overallAverageProcessed = processAndSortAssetData(
    comparisonData.value?.overallAverage || {},
    '전체 평균'
  )
  const overallAverageSlide = {
    title: '전체 평균 자산 분포',
    chartData: createChartData(overallAverageProcessed.sortedAssets),
    filteredAssetDetails: overallAverageProcessed.sortedAssets,
    totalAsset: overallAverageProcessed.total
  }
  console.log('전체 평균 자산 슬라이드:', overallAverageSlide)

  return [userAssetSlide, typeAverageSlide, overallAverageSlide]
})

onMounted(() => {
  loadAssetData()
})
</script>

<style scoped>
/* 자산 분포 컨테이너 스타일 */
.total-asset {
  margin-bottom: 15px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-asset .total-label {
  font-size: 1.18rem;
  font-weight: 500;
  color: #333;
}

.total-asset .total-amount {
  font-size: 1.3rem;
  color: #333;
  font-weight: 500;
}
.total-asset .total-amount .text-accent {
  font-weight: 700;
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
  padding-right: 1.5rem;
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
  margin-bottom: 12px;
  /* 자산 항목 간의 간격 조정 */
  padding-bottom: 10px;
  border-bottom: 1px dashed #eae6ff;
}

.asset-legend ul.asset-type:last-child {
  margin-bottom: 0;
  border-bottom: 0;
  padding-bottom: 0;
}

/* 자산 이름 스타일 */
.asset-legend .asset-name {
  flex: 0 0 28%;
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
