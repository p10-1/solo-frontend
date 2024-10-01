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
//src/components/AssetPage/AssetComparison.vue
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'

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

const chartRef = ref(null) // 차트를 렌더링할 canvas 참조
let chartInstance = null // 차트 인스턴스

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

const total = computed(() => userAmount.value + averageAmount.value)
// 사용자의 자산 비율 계산

const userPercentage = computed(() => ((userAmount.value / total.value) * 100).toFixed(2))
const averagePercentage = computed(() => ((averageAmount.value / total.value) * 100).toFixed(2))

// 사용자의 자산과 평균 자산을 비교한 결과 메시지 생성

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

/// 차트를 생성하는 함수
const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy() // 기존 차트를 제거
  }

  const ctx = chartRef.value.getContext('2d') // 차트를 렌더링할 컨텍스트 얻기

  chartInstance = new Chart(ctx, {
    type: 'bar', // 막대형 차트 설정
    data: {
      labels: ['평균', '나'], // 레이블 설정
      datasets: [
        {
          label: assetTypeTitle.value, // 차트 제목
          data: [averageAmount.value, userAmount.value], // 데이터
          backgroundColor: ['#36a2eb', '#ff6384'], // 배경색
          borderColor: ['#36a2eb', '#ff6384'], // 테두리 색상
          borderWidth: 1 // 테두리 두께
        }
      ]
    },
    options: {
      responsive: true, // 반응형 차트 설정
      scales: {
        y: {
          beginAtZero: true, // y축이 0부터 시작
          ticks: {
            callback: function (value) {
              return formatCurrency(value) // y축 값에 통화 포맷 적용
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false // 범례 숨김
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              if (context.parsed.y !== null) {
                label += formatCurrency(context.parsed.y) // 툴팁에 통화 포맷 적용
              }
              return label
            }
          }
        }
      }
    }
  })
}

onMounted(createChart) // 컴포넌트가 마운트될 때 차트 생성

watch([() => props.assetType, () => props.comparisonData], createChart, { deep: true }) // 자산 유형 및 비교 데이터 변경 시 차트 다시 생성

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy() // 컴포넌트가 언마운트될 때 차트 제거
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
