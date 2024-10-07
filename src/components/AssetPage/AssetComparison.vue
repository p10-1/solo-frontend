<template>
  <div class="asset-comparison">
    <h2 class="asset-comparison__title">자산 비교</h2>
    <div v-if="comparisonData" class="asset-comparison__chart-container">
      <ChartComponent type="bar" :data="chartData" :options="chartOptions" height="300px" />
    </div>
    <div v-if="comparisonData" class="asset-comparison__summary">
      <p>자산 유형: {{ userType }}</p>
      <p>내 총 자산: {{ formatCurrency(calculateTotal(userAsset)) }}</p>
      <p>전체 평균 자산: {{ formatCurrency(calculateTotal(comparisonData.overallAverage)) }}</p>
      <p>
        {{ userType }} 평균 자산: {{ formatCurrency(calculateTotal(comparisonData.typeAverage)) }}
      </p>
    </div>
    <div v-if="error" class="asset-comparison__error">
      <p>에러 발생: {{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import ChartComponent from '@/components/common/ChartComponent.vue'
import { fetchAssetComparison } from '@/api/assetApi'

const props = defineProps({
  userAsset: {
    type: Object,
    required: true
  },
  userType: {
    type: String,
    required: true
  }
})

const comparisonData = ref(null)
const error = ref(null)

const loadComparisonData = async () => {
  try {
    console.log('AssetComparison: Fetching comparison data for type:', props.userType)
    comparisonData.value = await fetchAssetComparison(props.userType)
    console.log('AssetComparison: Received comparison data:', comparisonData.value)

    if (!comparisonData.value || typeof comparisonData.value !== 'object') {
      console.error('Received comparison data is invalid:', comparisonData.value)
    }
  } catch (err) {
    console.error('AssetComparison: Failed to fetch comparison data:', err)
    error.value = err.message
  }
}

onMounted(loadComparisonData)

watch(() => props.userType, loadComparisonData)

const chartData = computed(() => {
  if (!comparisonData.value) {
    console.error('comparisonData is null or undefined')
    return null
  }

  const labels = ['현금', '예금', '주식', '보험']
  const userData = labels.map((label) => props.userAsset[label.toLowerCase()] || 0)
  const overallAverageData = labels.map(
    (label) => comparisonData.value.overallAverage[label.toLowerCase()] || 0
  )
  const typeAverageData = labels.map(
    (label) => comparisonData.value.typeAverage[label.toLowerCase()] || 0
  )

  console.log('Labels:', labels)
  console.log('User Data:', userData)
  console.log('Overall Average Data:', overallAverageData)
  console.log('Type Average Data:', typeAverageData)
  console.log('API Response:', comparisonData.value)
  console.log('User Asset Data:', props.userAsset)

  // If data arrays are all zeros, log a warning
  if (userData.every((value) => value === 0)) {
    console.warn('User data is all zeros')
  }
  if (overallAverageData.every((value) => value === 0)) {
    console.warn('Overall average data is all zeros')
  }
  if (typeAverageData.every((value) => value === 0)) {
    console.warn(`${props.userType} average data is all zeros`)
  }

  return {
    labels,
    datasets: [
      {
        label: '내 자산',
        data: userData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      },
      {
        label: '전체 평균',
        data: overallAverageData,
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      },
      {
        label: `${props.userType} 평균`,
        data: typeAverageData,
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => formatCurrency(value)
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
      }
    }
  }
}))

const calculateTotal = (asset) => {
  return Object.values(asset).reduce((sum, value) => sum + (value || 0), 0)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)
}
</script>

<style scoped>
.asset-comparison {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.asset-comparison__title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.asset-comparison__chart-container {
  height: 300px;
  margin-bottom: 20px;
}

.asset-comparison__summary {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 15px;
}

.asset-comparison__summary-text {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 10px;
}

.asset-comparison__trend {
  font-size: 1.2rem;
  font-weight: bold;
}

.asset-comparison__percentage {
  font-size: 1rem;
  font-weight: normal;
}

.increase {
  color: #28a745;
}

.decrease {
  color: #dc3545;
}

@media (max-width: 768px) {
  .asset-comparison__chart-container {
    height: 250px;
  }

  .asset-comparison__title {
    font-size: 1.3rem;
  }

  .asset-comparison__summary-text,
  .asset-comparison__trend {
    font-size: 1rem;
  }

  .asset-comparison__percentage {
    font-size: 0.9rem;
  }
}
</style>
