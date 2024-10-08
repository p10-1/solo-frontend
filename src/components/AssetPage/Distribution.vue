<template>
  <div class="asset-distribution">
    <h3>{{ title || '자산 분포' }}</h3>
    <div class="asset-content">
      <div v-if="highestAssetType" class="asset-highlight">
        보유 자산 중 {{ assetNames[highestAssetType] }}이 제일 많아요!
      </div>
      <div class="asset-chart">
        <ChartComponent type="doughnut" :data="chartData" :options="chartOptions" />
        <div class="asset-legend">
          <!-- Only display assets that have a non-zero total -->
          <div v-for="asset in filteredAssetDetails" :key="asset.name" class="asset-type">
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

import { ref, computed } from 'vue'
import ChartComponent from '@/components/common/ChartComponent.vue'

const props = defineProps({
  assetDetails: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: '자산 분포'
  }
})

console.log('Distribution received assetDetails:', props.assetDetails)
console.log('Distribution received title:', props.title)

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

// computed 속성들
const totalAsset = computed(() => {
  const total = Object.values(props.assetDetails).reduce(
    (sum, asset) => sum + (asset.total || 0),
    0
  )
  // console.log('Total asset:', total)
  return total
})

const sortedAssetDetails = computed(() => {
  const sorted = Object.entries(props.assetDetails)
    .map(([name, details]) => ({ name, ...details }))
    .sort((a, b) => b.total - a.total)
  // console.log('Sorted asset details:', sorted)
  return sorted
})

const filteredAssetDetails = computed(() => {
  const filtered = sortedAssetDetails.value.filter((asset) => asset.total > 0)
  // console.log('Filtered asset details:', filtered)
  return filtered
})

const highestAssetType = computed(() => {
  const highest = sortedAssetDetails.value[0]?.name
  // console.log('Highest asset type:', highest)
  return highest
})

// 숫자를 포맷하는 함수
const formatNumber = (num) => {
  if (isNaN(num) || num === undefined || num === null) {
    return '0' // Default to 0 when the value is NaN, undefined, or null
  }
  return num.toLocaleString()
}

// 자산의 비율 계산
const calculatePercentage = (value) => {
  if (totalAsset.value === 0 || isNaN(value)) return '0.00' // Avoid NaN
  return ((value / totalAsset.value) * 100).toFixed(2)
}

// 자산별 색상 반환
const getAssetColor = (assetName) => {
  return assetColors[assetName] || '#9966FF'
}

// chartData computed 속성
const chartData = computed(() => {
  const data = {
    labels: sortedAssetDetails.value.map((asset) => assetNames[asset.name]),
    datasets: [
      {
        data: sortedAssetDetails.value.map((asset) => asset.total || 0),
        backgroundColor: sortedAssetDetails.value.map((asset) => getAssetColor(asset.name))
      }
    ]
  }
  // console.log('Chart data:', data)
  return data
})

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
          const value = context.raw || 0 // Use 0 if value is undefined
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
  .asset-distribution {
    padding: 1.5rem 1.2rem;
  }

  .asset-type {
    font-size: 0.8rem;
  }
}
</style>
