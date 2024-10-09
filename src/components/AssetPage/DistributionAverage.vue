<template>
  <div class="asset-distribution">
    <h3>{{ title }}</h3>
    <div class="asset-content">
      <div class="asset-chart">
        <ChartComponent type="doughnut" :data="chartData" :options="chartOptions" />
        <div class="asset-legend">
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
import { ref, computed } from 'vue'
import ChartComponent from '@/components/common/ChartComponent.vue'

const props = defineProps({
  assetDetails: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const assetNames = {
  cash: '현금자산',
  deposit: '예적금',
  stock: '주식',
  insurance: '보험'
}

const assetColors = {
  cash: '#FF6384',
  deposit: '#36A2EB',
  stock: '#FFCE56',
  insurance: '#4BC0C0'
}

const totalAsset = computed(() => {
  return Object.values(props.assetDetails).reduce((sum, asset) => sum + (asset.total || 0), 0)
})

const sortedAssetDetails = computed(() => {
  return Object.entries(props.assetDetails)
    .map(([name, details]) => ({ name, ...details }))
    .sort((a, b) => b.total - a.total)
})

const filteredAssetDetails = computed(() => {
  return sortedAssetDetails.value.filter((asset) => asset.total > 0)
})

const formatNumber = (num) => {
  if (isNaN(num) || num === undefined || num === null) {
    return '0'
  }
  return num.toLocaleString()
}

const calculatePercentage = (value) => {
  if (totalAsset.value === 0 || isNaN(value)) return '0.00'
  return ((value / totalAsset.value) * 100).toFixed(2)
}

const getAssetColor = (assetName) => {
  return assetColors[assetName] || '#9966FF'
}

const chartData = computed(() => ({
  labels: sortedAssetDetails.value.map((asset) => assetNames[asset.name]),
  datasets: [
    {
      data: sortedAssetDetails.value.map((asset) => asset.total || 0),
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
          const value = context.raw || 0
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
