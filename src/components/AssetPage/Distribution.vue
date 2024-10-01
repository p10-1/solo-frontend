<template>
  <div class="asset-distribution">
    <h2 class="asset-distribution__title">자산 비중</h2>
    <p v-if="highestAssetType" class="asset-distribution__highlight">
      보유 자산 중 {{ assetNames[highestAssetType] }}이 제일 많아요!
    </p>
    <div class="asset-distribution__content">
      <div class="asset-distribution__chart">
        <canvas ref="chartCanvas"></canvas>
      </div>
      <div class="asset-distribution__list">
        <ul class="asset-types">
          <li v-for="asset in sortedAssetDetails" :key="asset.name" class="asset-type">
            <span
              class="asset-color"
              :style="{ backgroundColor: getAssetColor(asset.name) }"
            ></span>

            <strong>{{ assetNames[asset.name] }} </strong>
            <span class="asset-percentage">{{ calculatePercentage(asset.total) }}% </span>

            <span class="asset-amount">{{ formatNumber(asset.total) }}원</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  assetDetails: {
    type: Object,
    required: true
  }
})

const chartCanvas = ref(null)
let chart = null

const assetNames = {
  cash: '현금자산',
  deposit: '예적금',
  stock: '주식',
  property: '부동산'
}

const assetColors = {
  cash: '#FF6384',
  deposit: '#36A2EB',
  stock: '#FFCE56',
  property: '#4BC0C0'
}

const totalAsset = computed(() => {
  return Object.values(props.assetDetails).reduce((sum, asset) => sum + asset.total, 0)
})

const sortedAssetDetails = computed(() => {
  return Object.entries(props.assetDetails)
    .map(([name, details]) => ({ name, ...details }))
    .sort((a, b) => b.total - a.total)
})

const highestAssetType = computed(() => {
  return sortedAssetDetails.value[0]?.name
})

const formatNumber = (num) => {
  return num.toLocaleString()
}

const calculatePercentage = (value) => {
  if (totalAsset.value === 0) return '0.00'
  return ((value / totalAsset.value) * 100).toFixed(2)
}

const getAssetColor = (assetName) => {
  return assetColors[assetName] || '#9966FF' // 기본 색상
}

const createChart = () => {
  if (!chartCanvas.value || sortedAssetDetails.value.length === 0) return

  const ctx = chartCanvas.value.getContext('2d')
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: sortedAssetDetails.value.map((asset) => assetNames[asset.name]),
      datasets: [
        {
          data: sortedAssetDetails.value.map((asset) => asset.total),
          backgroundColor: sortedAssetDetails.value.map((asset) => getAssetColor(asset.name))
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || ''
              const value = context.parsed
              const percentage = calculatePercentage(value)
              return `${label}: ${formatNumber(value)}원 (${percentage}%)`
            }
          }
        }
      }
    }
  })
}

onMounted(createChart)

watch(
  () => props.assetDetails,
  () => {
    if (chart) {
      chart.destroy()
    }
    createChart()
  },
  { deep: true }
)
</script>

<style scoped>
.asset-distribution {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
}

.asset-distribution__title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.asset-distribution__highlight {
  font-size: 1.1rem;
  color: #4a4a4a;
  text-align: center;
  margin-bottom: 20px;
}

.asset-distribution__content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.asset-distribution__chart {
  width: 50%;
  max-width: 400px;
}

.asset-distribution__list {
  width: 45%;
}

.asset-types {
  list-style-type: none;
  padding-left: 0;
}

.asset-type {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 1rem;
}

.asset-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
}

.asset-amount {
  margin-left: 10px;
  font-weight: bold;
}

.asset-percentage {
  margin-left: 5px;
  color: #666;
}

@media (max-width: 768px) {
  .asset-distribution__content {
    flex-direction: column;
    align-items: center;
  }

  .asset-distribution__chart,
  .asset-distribution__list {
    width: 100%;
  }

  .asset-distribution__list {
    margin-top: 20px;
  }
}
</style>
