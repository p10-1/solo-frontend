<template>
  <div class="asset-comparison">
    <h2 class="asset-comparison__title">{{ assetTypeTitle }} 비교</h2>
    <div class="asset-comparison__chart-container">
      <ChartComponent type="bar" :data="chartData" :options="chartOptions" height="300px" />
    </div>
    <div class="asset-comparison__summary">
      <p class="asset-comparison__summary-text">평균 대비 차이:</p>
      <p :class="['asset-comparison__trend', trendDirection]">
        {{ trendDirection === 'increase' ? '높음' : '낮음' }}
        <span class="asset-comparison__percentage"
          >(차이: {{ Math.abs(differencePercentage) }}%)</span
        >
      </p>
    </div>
  </div>
</template>
<script setup>
//src/components/AssetPage/AssetComparison.vue
import { computed } from 'vue'
import ChartComponent from '@/components/common/ChartComponent.vue'

const props = defineProps({
  assetType: {
    // 자산 종류를 받아옴
    type: String,
    required: true
  },
  comparisonData: {
    // 비교 데이터 (평균 및 사용자 데이터)
    type: Object,
    required: true
  }
})

// 자산 종류에 따른 제목 설정

const assetTypeTitle = computed(() => {
  const titles = {
    cash: '현금자산',
    deposit: '예적금',
    stock: '주식',
    property: '부동산'
  }
  return titles[props.assetType] || '자산'
})

// 비교할 데이터를 설정 (사용자와 평균 데이터)

const currentComparisonData = computed(
  () => props.comparisonData[props.assetType] || { average: 0, user: 0 }
)

const userAmount = computed(() => currentComparisonData.value.user)
const averageAmount = computed(() => currentComparisonData.value.average)
// 두 자산의 합계

// 사용자의 자산과 평균 자산을 비교한 결과 메시지 생성

const differencePercentage = computed(() => {
  const difference = userAmount.value - averageAmount.value
  return ((difference / averageAmount.value) * 100).toFixed(2)
})

const trendDirection = computed(() => {
  return userAmount.value > averageAmount.value ? 'increase' : 'decrease'
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)
}

/// 차트를 생성하는 함수
const chartData = computed(() => ({
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
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
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
}))
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
