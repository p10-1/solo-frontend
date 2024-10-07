<template>
  <!-- <h2 class="title">자산 비중</h2> -->
  <div class="asset-distribution">
    <div class="asset-content">
      <div v-if="highestAssetType" class="asset-highlight">
        보유 자산 중 {{ assetNames[highestAssetType] }}이 제일 많아요!
      </div>
      <div class="asset-chart">
        <ChartComponent type="doughnut" :data="chartData" :options="chartOptions" />
        <div class="asset-legend">
          <div v-for="asset in sortedAssetDetails" :key="asset.name" class="asset-type">
            <span
              class="asset-color"
              :style="{ backgroundColor: getAssetColor(asset.name) }"
            ></span>
            <span class="asset-name">{{ assetNames[asset.name] }}</span>
            <span class="asset-percentage">{{ calculatePercentage(asset.total) }}%</span>
            <span class="asset-amount">{{ formatNumber(asset.total) }}원</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
//src/components/AssetPage/Distribution.vue

import { ref, computed, onMounted, watch } from 'vue'
import ChartComponent from '@/components/common/ChartComponent.vue'

const props = defineProps({
  assetDetails: {
    type: Object,
    required: true
  }
})

const chartCanvas = ref(null) // 차트를 렌더링할 캔버스 참조
let chart = null // 차트 인스턴스

// 자산 이름 매핑
const assetNames = {
  cash: '현금자산',
  deposit: '예적금',
  stock: '주식',
  insurance: '보험'
}

// 자산 색상 매핑
const assetColors = {
  cash: '#FF6384',
  deposit: '#36A2EB',
  stock: '#FFCE56',
  insurance: '#4BC0C0'
}

// 총 자산 금액 계산
const totalAsset = computed(() => {
  return Object.values(props.assetDetails).reduce((sum, asset) => sum + asset.total, 0)
})

// 자산을 금액 순으로 정렬
const sortedAssetDetails = computed(() => {
  return Object.entries(props.assetDetails)
    .map(([name, details]) => ({ name, ...details }))
    .sort((a, b) => b.total - a.total)
})

// 자산이 가장 많은 타입 계산
const highestAssetType = computed(() => {
  return sortedAssetDetails.value[0]?.name
})

// 숫자를 포맷하는 함수
const formatNumber = (num) => {
  if (num === undefined || num === null) {
    return '0'
  }
  return num.toLocaleString()
}

// 자산의 비율 계산
const calculatePercentage = (value) => {
  if (totalAsset.value === 0) return '0.00'
  return ((value / totalAsset.value) * 100).toFixed(2)
}

// 자산별 색상 반환
const getAssetColor = (assetName) => {
  return assetColors[assetName] || '#9966FF'
}

// 차트 생성 함수
const chartData = computed(() => ({
  labels: sortedAssetDetails.value.map((asset) => assetNames[asset.name]),
  datasets: [
    {
      data: sortedAssetDetails.value.map((asset) => asset.total),
      backgroundColor: sortedAssetDetails.value.map((asset) => getAssetColor(asset.name))
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: function (context) {
          const label = context.label || ''
          const value = context.raw
          const percentage = calculatePercentage(value)
          return `${label}: ${formatNumber(value)}원 (${percentage}%)`
        }
      }
    }
  }
}))
</script>

<style scoped>
.asset-distribution {
  border-radius: 25px;
  padding: 2rem 1.7rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
}

.asset-distribution .asset-content {
}

.asset-distribution__highlight {
}

.asset-distribution__content {
}

.asset-distribution__chart-container {
}

.asset-distribution__legend {
  width: 45%;
}

.asset-type {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.asset-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.asset-percentage {
  font-weight: bold;
  margin-right: 8px;
  min-width: 40px;
}

.asset-name {
  flex: 1;
  margin-right: 8px;
}

.asset-amount {
  font-size: 0.8rem;
  color: #666;
}

@media (max-width: 768px) {
  .asset-distribution__content {
    flex-direction: column;
  }

  .asset-distribution__chart-container,
  .asset-distribution__legend {
    width: 100%;
    max-width: none;
  }

  .asset-distribution__chart-container {
    height: 250px;
    margin-bottom: 20px;
  }
}
</style>
