<template>
  <div class="main-slide-box">
    <h2 class="main-title">내 자산 현황</h2>
    <div class="main-slide-contents margin-top-1rem">
      <swiper
        :pagination="{ clickable: true }"
        :modules="modules"
        :loop="true"
        :slides-per-view="1"
        :space-between="20"
        class="mySwiper"
      >
        <swiper-slide v-for="(slide, index) in slides" :key="index">
          <router-link to="asset">
            <div class="main-card">
              <div class="card-body">
                <h3 class="title card-title text-align-left link">내 자산 분포</h3>
                <!-- 도넛 차트를 보여주는 섹션 -->
                <div class="card-content">
                  <ChartComponent
                    type="doughnut"
                    :data="myAssetChartData"
                    :options="chartOptions"
                  />
                  <div class="asset-legend">
                    <!-- 자산 분포 범례 -->
                    <ul
                      v-for="(value, key) in myAssetChartData.labels"
                      :key="key"
                      class="asset-type"
                    >
                      <li class="asset-name">
                        <!-- 자산 종류와 색상 표시 -->
                        <span
                          :style="{ backgroundColor: assetColors[key] }"
                          class="type-color"
                        ></span>
                        {{ value }}
                      </li>
                      <li class="asset-percentage">
                        <!-- 자산 비율 계산 및 표시 -->
                        {{
                          Math.round(calculatePercentage(myAssetChartData.datasets[0].data[key]))
                        }}%
                      </li>
                      <li class="asset-amount">
                        <!-- 자산 총액 표시 -->
                        {{ Math.round(myAssetChartData.datasets[0].data[key]) }} 원
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="asset-content">
                <div class="asset-chart-container">
                  <ChartComponent type="doughnut" :data="slide.chartData" :options="chartOptions" />
                </div>
                <div class="asset-legend">
                  <ul
                    v-for="(asset, assetIndex) in slide.filteredAssetDetails"
                    :key="assetIndex"
                    class="asset-type"
                  >
                    <li class="asset-name">
                      <span
                        :style="{ backgroundColor: getAssetColor(asset.name) }"
                        class="type-color"
                      ></span>
                      {{ assetNames[asset.name] }}
                    </li>
                    <li class="asset-percentage">
                      {{ Math.round(calculatePercentage(asset.total)) }}%
                    </li>
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
import { Pagination, Autoplay } from 'swiper/modules'
import ChartComponent from '@/components/common/ChartComponent.vue'
import { fetchAssetData, fetchAssetComparison } from '@/api/assetApi'
import 'swiper/css'
import 'swiper/css/pagination'

const assetData = ref(null)
const comparisonData = ref(null)
const userType = ref('')
const modules = [Pagination, Autoplay]

const assetNames = {
  cash: '현금자산',
  deposit: '예적금',
  stock: '증권',
  insurance: '보험'
}

const assetColors = {
  cash: '#FF6384',
  deposit: '#36A2EB',
  stock: '#FFCE56',
  insurance: '#4BC0C0'
}

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
    console.error('Failed to load asset data:', error)
  }
}

const processAssetData = (data) => {
  const assetTypes = ['cash', 'deposit', 'stock', 'insurance']
  const processed = {}
  assetTypes.forEach((type) => {
    const values = JSON.parse(data[type] || '[]')
    processed[type] = {
      total: values.reduce((sum, val) => sum + Number(val), 0),
      details: values.map((value) => ({ value: Number(value) }))
    }
  })
  return processed
}

const createChartData = (data) => {
  return {
    labels: Object.keys(data).map((key) => assetNames[key]),
    datasets: [
      {
        data: Object.values(data).map((value) => (typeof value === 'object' ? value.total : value)),
        backgroundColor: Object.keys(data).map((key) => assetColors[key])
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
          const value = context.raw || 0
          const percentage = calculatePercentage(value)
          return `${label}: ${formatNumber(value)}원 (${percentage}%)`
        }
      }
    }
  }
}

const calculatePercentage = (value) => {
  const total = assetData.value
    ? Object.values(assetData.value).reduce((sum, asset) => sum + (asset.total || 0), 0)
    : 0
  if (total === 0 || isNaN(value)) return '0.00'
  return ((value / total) * 100).toFixed(2)
}

const formatNumber = (num) => {
  if (isNaN(num) || num === undefined || num === null) {
    return '0'
  }
  return num.toLocaleString()
}

const getAssetColor = (assetName) => {
  return assetColors[assetName] || '#9966FF'
}

const slides = computed(() => [
  {
    title: '내 자산 분포',
    chartData: createChartData(assetData.value || {}),
    filteredAssetDetails: Object.entries(assetData.value || {})
      .map(([name, details]) => ({ name, ...details }))
      .filter((asset) => asset.total > 0),
    highlight: '보유 자산 중 현금자산이 제일 많아요!'
  },
  {
    title: `${userType.value} 평균 자산 분포`,
    chartData: createChartData(comparisonData.value?.typeAverage || {}),
    filteredAssetDetails: Object.entries(comparisonData.value?.typeAverage || {})
      .map(([name, total]) => ({ name, total }))
      .filter((asset) => asset.total > 0)
  },
  {
    title: '전체 평균 자산 분포',
    chartData: createChartData(comparisonData.value?.overallAverage || {}),
    filteredAssetDetails: Object.entries(comparisonData.value?.overallAverage || {})
      .map(([name, total]) => ({ name, total }))
      .filter((asset) => asset.total > 0)
  }
])

onMounted(() => {
  loadAssetData()
})
</script>

<style scoped>
.main-slide-box .main-card {
  background-color: #f3f3ff;
  padding: 2rem 1.5rem;
  border-radius: 28px;
}
.main-slide-box .main-card .card-title {
}
.main-slide-box .main-card .card-content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  background-color: #fff;
}

.asset-legend {
  width: 45%;
  margin-left: 5%;
}

.asset-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #cfc6fd;
}

.asset-name {
  display: flex;
  align-items: center;
}

.type-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.asset-percentage {
  font-weight: bold;
  padding: 2px 6px;
  background-color: #f3f3ff;
  border-radius: 10px;
}

.asset-amount {
  font-size: 0.9rem;
  font-weight: 500;
}

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
</style>
