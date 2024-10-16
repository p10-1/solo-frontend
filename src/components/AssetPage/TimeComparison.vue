<template>
  <div class="time-comparison">
    <h2 class="title">
      <span class="text-accent">{{ assetTypeNames[assetType] }} 월별</span> 비교
    </h2>

    <div class="time-comparison__chart-container">
      <canvas ref="chartRef" class="canvas-chart"></canvas>
    </div>

    <div v-if="processedData.length > 0" class="time-comparison__summary">
      <ul class="comparison-info">
        <li>최근 {{ processedData.length }}개월 변화</li>
        <li :class="['time-comparison__trend', trendDirection]">
          <span class="text-accent">
            <i v-if="trendDirection === 'increase'" class="fa-solid fa-circle-arrow-up"></i>
            <i v-else-if="trendDirection === 'decrease'" class="fa-solid fa-circle-arrow-down"></i>
            {{
              trendDirection === 'increase'
                ? '증가'
                : trendDirection === 'decrease'
                  ? '감소'
                  : '유지'
            }}
          </span>
          <span v-if="trendDirection !== 'maintain'" class="time-comparison__percentage">
            (변화율 : {{ formatNumber(trendPercentage) }}%)
          </span>
        </li>
      </ul>
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
  cash: '현금',
  deposit: '예적금',
  stock: '증권',
  insurance: '보험'
}
const formatNumber = (num) => {
  if (isNaN(num) || num === undefined || num === null) {
    return '0'
  }
  return Math.round(num).toLocaleString() // 소수점 값을 반올림하여 정수로 표시
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

  if (lastValue === firstValue) return 'maintain' // 변화율이 0일 경우 '유지'
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

  // 데이터의 최소값과 최대값 계산
  const values = processedData.value.map((data) => data.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)

  // 범위의 10%를 계산
  const range = maxValue - minValue
  const padding = range * 0.2

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
          backgroundColor: '#6846F5',
          borderColor: '#6846F5',
          borderWidth: 1,
          pointRadius: (context) => (context.dataIndex === context.dataset.data.length - 1 ? 5 : 3),
          pointBackgroundColor: (context) =>
            context.dataIndex === context.dataset.data.length - 1 ? '#6846F5' : '#A892FF'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          suggestedMin: Math.max(0, minValue - padding),
          suggestedMax: maxValue + padding,
          ticks: {
            callback: function (value) {
              return formatNumber(value) + '원'
            }
          }
        }
      },
      plugins: {
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              if (context.parsed.y !== null) {
                label += formatNumber(context.parsed.y) + '원'
              }
              return label
            }
          }
        },
        legend: {
          display: false // 범례를 숨깁니다. 필요하다면 true로 설정하세요.
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
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
  position: relative;
  width: 100%;
  min-height: 17rem;
  border-radius: 25px;
  padding: 2rem 1.7rem 1.5rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}
.time-comparison .canvas-chart {
  width: auto;
  height: 310px !important;
}
.time-comparison .comparison-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 10px 0;
  margin-top: 1rem;
}
.time-comparison .comparison-info li {
  font-size: 1.08rem;
  font-weight: 500;
  letter-spacing: -1px;
  color: #333;
}
.time-comparison .comparison-info li:last-child {
  text-align: right;
}
.time-comparison .comparison-info .text-accent {
  font-size: 1.5rem;
  font-weight: 600;
}
.time-comparison__percentage {
  margin-top: 7px;
  font-size: 0.87rem;
  display: block;
  color: #888;
}
</style>
