<template>
  <div class="asset-distribution">
    <h2 class="asset-distribution__title">자산 비중</h2>
    <!-- 자산의 최고 비율 표시 -->
    <p v-if="highestAssetType" class="asset-distribution__highlight">
      보유 자산 중 {{ assetNames[highestAssetType] }}이 제일 많아요!
    </p>
    <div class="asset-distribution__content">
      <div class="asset-distribution__chart">
        <canvas ref="chartCanvas"></canvas>
        <!-- 차트 렌더링 -->
      </div>
      <div class="asset-distribution__list">
        <ul class="asset-types">
          <li v-for="asset in sortedAssetDetails" :key="asset.name" class="asset-type">
            <!-- 자산 색상 표시 -->
            <span
              class="asset-color"
              :style="{ backgroundColor: getAssetColor(asset.name) }"
            ></span>

            <strong>{{ assetNames[asset.name] }} </strong>
            <!-- 자산명 -->
            <span class="asset-percentage">{{ calculatePercentage(asset.total) }}% </span>
            <!-- 자산 비율 -->

            <span class="asset-amount">{{ formatNumber(asset.total) }}원</span>
            <!-- 자산 금액 -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
//src/components/AssetPage/Distribution.vue

import { ref, computed, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  assetDetails: {
    type: Object,
    required: true
  }
})

const chartCanvas = ref(null) // 차트를 렌더링할 캔버스 참조
let chart = null // 차트 인스턴스

// 자산 이름 매핑
const assetNames = {
  cash: '현금자산',
  deposit: '예적금',
  stock: '주식',
  property: '부동산'
}

// 자산 색상 매핑
const assetColors = {
  cash: '#FF6384',
  deposit: '#36A2EB',
  stock: '#FFCE56',
  property: '#4BC0C0'
}

// 총 자산 금액 계산
const totalAsset = computed(() => {
  return Object.values(props.assetDetails).reduce((sum, asset) => sum + asset.total, 0)
})

// 자산을 금액 순으로 정렬
const sortedAssetDetails = computed(() => {
  return Object.entries(props.assetDetails)
    .map(([name, details]) => ({ name, ...details }))
    .sort((a, b) => b.total - a.total)
})

// 자산이 가장 많은 타입 계산
const highestAssetType = computed(() => {
  return sortedAssetDetails.value[0]?.name
})

// 숫자를 포맷하는 함수
const formatNumber = (num) => {
  return num.toLocaleString()
}

// 자산의 비율 계산
const calculatePercentage = (value) => {
  if (totalAsset.value === 0) return '0.00'
  return ((value / totalAsset.value) * 100).toFixed(2)
}

// 자산별 색상 반환
const getAssetColor = (assetName) => {
  return assetColors[assetName] || '#9966FF'
}

// 차트 생성 함수
const createChart = () => {
  if (!chartCanvas.value || sortedAssetDetails.value.length === 0) return

  const ctx = chartCanvas.value.getContext('2d') // 차트를 그릴 컨텍스트 얻기
  chart = new Chart(ctx, {
    type: 'doughnut', // 도넛형 차트 설정
    data: {
      labels: sortedAssetDetails.value.map((asset) => assetNames[asset.name]), // 라벨 설정
      datasets: [
        {
          data: sortedAssetDetails.value.map((asset) => asset.total), // 자산 금액 설정
          backgroundColor: sortedAssetDetails.value.map((asset) => getAssetColor(asset.name)) // 자산 색상 설정
        }
      ]
    },
    options: {
      responsive: true, // 반응형 차트
      plugins: {
        legend: {
          display: false // 범례 숨김
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || ''
              const value = context.parsed
              const percentage = calculatePercentage(value)
              return `${label}: ${formatNumber(value)}원 (${percentage}%)` // 툴팁에 자산 정보 표시
            }
          }
        }
      }
    }
  })
}

onMounted(createChart) // 컴포넌트가 마운트될 때 차트 생성

// 자산 정보가 변경되면 차트 다시 생성
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
