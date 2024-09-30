<template>
  <div class="time-comparison">
    <h2>{{ assetTypeNames[assetType] }} 추세 분석</h2>
    <canvas ref="chartRef"></canvas>
    <div v-if="trendData.length > 0" class="trend-summary">
      <p>최근 {{ trendData.length + 1 }}개월 추세:</p>
      <p :class="trendDirection">
        {{ trendDirection === 'increase' ? '상승' : '하락' }} 추세 (변화율: {{ trendPercentage }}%)
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  assetType: {
    type: String,
    required: true
  },
  assetData: {
    type: Array,
    required: true
  }
})

const chartRef = ref(null)
let chartInstance = null

const assetTypeNames = {
  cash: '현금자산',
  deposit: '예적금',
  stock: '주식',
  property: '부동산'
}

const parseJsonArray = (jsonString) => {
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    console.error('Failed to parse JSON string:', jsonString)
    return []
  }
}

const trendData = computed(() => {
  return props.assetData
    .map((data) => ({
      date: new Date(data.createDate),
      value: parseJsonArray(data[props.assetType]).reduce((sum, val) => sum + Number(val), 0)
    }))
    .sort((a, b) => a.date - b.date) // 날짜순 정렬
})

const trendDirection = computed(() => {
  if (trendData.value.length < 2) return 'neutral'
  const firstValue = trendData.value[0].value
  const lastValue = trendData.value[trendData.value.length - 1].value
  return lastValue > firstValue ? 'increase' : 'decrease'
})

const trendPercentage = computed(() => {
  if (trendData.value.length < 2) return 0
  const firstValue = trendData.value[0].value
  const lastValue = trendData.value[trendData.value.length - 1].value
  return (((lastValue - firstValue) / firstValue) * 100).toFixed(2)
})

const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  if (!chartRef.value || trendData.value.length === 0) return

  const ctx = chartRef.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: trendData.value.map((data) => data.date.toLocaleDateString()),
      datasets: [
        {
          label: `${assetTypeNames[props.assetType]} 가치`,
          data: trendData.value.map((data) => data.value),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(
                value
              )
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW'
                }).format(context.parsed.y)
              }
              return label
            }
          }
        }
      }
    }
  })
}

onMounted(createChart)

watch([() => props.assetType, () => props.assetData], createChart, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.time-comparison {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.trend-summary {
  margin-top: 20px;
  font-size: 1.1em;
}

.increase {
  color: #4caf50;
}

.decrease {
  color: #f44336;
}

.neutral {
  color: #757575;
}
</style>
