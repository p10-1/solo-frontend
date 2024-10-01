<template>
  <div class="asset-comparison">
    <h3>{{ assetTypeTitle }} 비교</h3>
    <canvas ref="chartRef"></canvas>
    <p class="comparison-result">
      {{ comparisonResult }}
    </p>
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
  comparisonData: {
    type: Object,
    required: true
  }
})

const chartRef = ref(null)
let chartInstance = null

const assetTypeTitle = computed(() => {
  const titles = {
    cash: '현금자산',
    deposit: '예적금',
    stock: '주식',
    property: '부동산'
  }
  return titles[props.assetType] || '자산'
})

const currentComparisonData = computed(
  () => props.comparisonData[props.assetType] || { average: 0, user: 0 }
)

const userAmount = computed(() => currentComparisonData.value.user)
const averageAmount = computed(() => currentComparisonData.value.average)

const total = computed(() => userAmount.value + averageAmount.value)
const userPercentage = computed(() => ((userAmount.value / total.value) * 100).toFixed(2))
const averagePercentage = computed(() => ((averageAmount.value / total.value) * 100).toFixed(2))

const comparisonResult = computed(() => {
  const difference = userAmount.value - averageAmount.value
  const percentDifference = (difference / averageAmount.value) * 100
  if (difference > 0) {
    return `당신의 ${assetTypeTitle.value}은 평균보다 ${percentDifference.toFixed(2)}% 많습니다.`
  } else if (difference < 0) {
    return `당신의 ${assetTypeTitle.value}은 평균보다 ${Math.abs(percentDifference).toFixed(2)}% 적습니다.`
  } else {
    return `당신의 ${assetTypeTitle.value}은 평균과 같습니다.`
  }
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)
}

const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartRef.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['평균', '나'],
      datasets: [
        {
          label: assetTypeTitle.value,
          data: [averageAmount.value, userAmount.value],
          backgroundColor: ['#36a2eb', '#ff6384'],
          borderColor: ['#36a2eb', '#ff6384'],
          borderWidth: 1
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
              return formatCurrency(value)
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              if (context.parsed.y !== null) {
                label += formatCurrency(context.parsed.y)
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

watch([() => props.assetType, () => props.comparisonData], createChart, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.asset-comparison {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background-color: #fff;
}

.asset-comparison__title {
  font-size: 1.5rem;
  margin-bottom: 10px;
  text-align: center;
}

.asset-comparison__subtitle {
  font-size: 1rem;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
}

.asset-comparison__content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.asset-comparison__result {
  margin-top: 20px;
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
}
</style>
