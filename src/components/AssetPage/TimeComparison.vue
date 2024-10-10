<template>
  <div class="time-comparison">
    <!-- 자산 타입에 따라 동적으로 타이틀 표시 -->
    <h2 class="time-comparison__title">{{ assetTypeNames[assetType] }} 월별 비교</h2>

    <!-- 차트 렌더링을 위한 캔버스 -->
    <div class="time-comparison__chart-container">
      <canvas ref="chartRef"></canvas>
    </div>

    <!-- 자산 변동 요약 정보가 있을 경우 표시 -->
    <div v-if="processedData.length > 0" class="time-comparison__summary">
      <p class="time-comparison__summary-text">최근 {{ processedData.length }}개월 변화:</p>
      <p :class="['time-comparison__trend', trendDirection]">
        {{ trendDirection === 'increase' ? '증가' : '감소' }}
        <span class="time-comparison__percentage">(변화율: {{ trendPercentage }}%)</span>
      </p>
    </div>
  </div>
</template>

<script setup>
//src/components/AssetPage/TimeComparison.vue

import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'

// 부모 컴포넌트로부터 자산 타입과 데이터를 props로 받음

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

// 자산 타입 이름 매핑

const assetTypeNames = {
  cash: '현금자산',
  deposit: '예적금',
  stock: '주식',
  insurance: '보험'
}

const parseJsonArray = (jsonString) => {
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    console.error('Failed to parse JSON string:', jsonString)
    return []
  }
}
// 자산 데이터를 처리하여 월별 변동 데이터로 변환

const processedData = computed(() => {
  if (!props.assetData || props.assetData.length === 0) return []

  // 데이터를 날짜순으로 정렬
  const sortedData = [...props.assetData].sort(
    (a, b) => new Date(b.createDate) - new Date(a.createDate)
  )

  // 마지막 날짜(가장 최근 데이터)
  const lastDayData = {
    date: new Date(sortedData[0].createDate),
    value: parseJsonArray(sortedData[0][props.assetType]).reduce((sum, val) => sum + Number(val), 0)
  }

  // 나머지 데이터를 월별로 집계
  const monthlyData = sortedData.slice(1).reduce((acc, data) => {
    const date = new Date(data.createDate)
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
    if (!acc[monthKey]) {
      acc[monthKey] = {
        date: new Date(date.getFullYear(), date.getMonth(), 1),
        value: 0
      }
    }
    acc[monthKey].value += parseJsonArray(data[props.assetType]).reduce(
      (sum, val) => sum + Number(val),
      0
    )
    return acc
  }, {})

  // 월별 데이터를 배열로 변환하고 마지막 날짜 데이터를 추가
  return [lastDayData, ...Object.values(monthlyData)].sort((a, b) => a.date - b.date)
})

const trendDirection = computed(() => {
  if (processedData.value.length < 2) return 'neutral'
  const firstValue = processedData.value[0].value
  const lastValue = processedData.value[processedData.value.length - 1].value
  return lastValue > firstValue ? 'increase' : 'decrease'
})

const trendPercentage = computed(() => {
  if (processedData.value.length < 2) return 0
  const firstValue = processedData.value[0].value
  const lastValue = processedData.value[processedData.value.length - 1].value
  return (((lastValue - firstValue) / firstValue) * 100).toFixed(2)
})

// 차트 생성 함수
const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy() // 기존 차트가 있으면 제거
  }

  if (!chartRef.value || processedData.value.length === 0) return

  const ctx = chartRef.value.getContext('2d')

  // 라인 차트 생성
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: processedData.value.map((data) =>
        data.date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' })
      ),
      datasets: [
        {
          label: `${assetTypeNames[props.assetType]}`,
          data: processedData.value.map((data) => data.value),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
          pointRadius: (context) => (context.dataIndex === context.dataset.data.length - 1 ? 5 : 3),
          pointBackgroundColor: (context) =>
            context.dataIndex === context.dataset.data.length - 1 ? 'red' : 'rgb(75, 192, 192)'
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
onMounted(createChart) // 컴포넌트가 마운트되면 차트 생성

// 자산 타입 또는 데이터가 변경될 때 차트 다시 생성
watch([() => props.assetType, () => props.assetData], createChart, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy() // 컴포넌트가 언마운트되면 차트 제거
  }
})
</script>

<style scoped>
.time-comparison {
  /* 시간 비교 카드 스타일: 배경색을 흰색으로 설정하고, 둥근 모서리, 패딩 및 그림자 효과 추가 */
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.time-comparison__title {
  /* 타이틀의 글자 크기를 1.5rem으로 설정하고, 색상은 진한 회색(#333), 아래쪽에 20px 간격 추가, 중앙 정렬 */
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.time-comparison__chart-container {
  /* 차트 컨테이너 높이를 300px로 설정하고, 아래쪽에 20px 간격 추가 */
  height: 300px;
  margin-bottom: 20px;
}

.time-comparison__summary {
  /* 자산 변동 요약을 담는 섹션: 연한 회색 배경, 둥근 모서리 처리, 15px의 패딩 적용 */
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 15px;
}

.time-comparison__summary-text {
  /* 요약 정보 텍스트 스타일: 글자 크기 1.1rem, 중간 회색(#555) 색상, 아래쪽에 10px 간격 */
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 10px;
}

.time-comparison__trend {
  /* 자산 증감 경향을 강조하기 위해 글자 크기를 1.2rem으로 설정하고, 굵은 글씨로 표시 */
  font-size: 1.2rem;
  font-weight: bold;
}

.time-comparison__percentage {
  /* 변화율 텍스트 스타일: 1rem 크기, 기본 굵기 */
  font-size: 1rem;
  font-weight: normal;
}

.increase {
  /* 자산이 증가할 때 텍스트 색상을 초록색(#28a745)으로 설정 */
  color: #28a745;
}

.decrease {
  /* 자산이 감소할 때 텍스트 색상을 빨간색(#dc3545)으로 설정 */
  color: #dc3545;
}

.neutral {
  /* 자산 변화가 없을 때 텍스트 색상을 중간 회색(#6c757d)으로 설정 */
  color: #6c757d;
}

@media (max-width: 768px) {
  .time-comparison__chart-container {
    /* 작은 화면에서 차트 컨테이너 높이를 250px로 줄임 */
    height: 250px;
  }

  .time-comparison__title {
    /* 작은 화면에서는 타이틀 크기를 1.3rem으로 줄임 */
    font-size: 1.3rem;
  }

  .time-comparison__summary-text,
  .time-comparison__trend {
    /* 작은 화면에서는 요약 텍스트와 경향 텍스트의 글자 크기를 1rem으로 줄임 */
    font-size: 1rem;
  }

  .time-comparison__percentage {
    /* 작은 화면에서 변화율 텍스트 크기를 0.9rem으로 줄임 */
    font-size: 0.9rem;
  }
}
</style>
