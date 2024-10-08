<template>
  <div class="asset-distribution">
    <!-- 자산 분포를 설명하는 타이틀 -->
    <h3>{{ title }}</h3>

    <!-- 자산 내용을 담은 컨테이너 -->
    <div class="asset-content">
      <!-- 가장 많은 자산이 있는 경우 강조 메시지 표시 -->
      <div v-if="highestAssetType" class="asset-highlight">
        보유 자산 중 {{ assetNames[highestAssetType] }}이 제일 많아요!
      </div>

      <!-- 도넛 차트를 보여주는 섹션 -->
      <div class="asset-chart">
        <!-- ChartComponent를 사용하여 도넛 차트 표시 -->
        <ChartComponent type="doughnut" :data="chartData" :options="chartOptions" />

        <!-- 자산 종류별로 색상과 데이터를 표시하는 범례 -->
        <div class="asset-legend">
          <!-- 자산 총액이 0이 아닌 자산만 표시 -->
          <div v-for="asset in filteredAssetDetails" :key="asset.name" class="asset-type">
            <!-- 자산 색상 표시 (자산 종류에 따라 동적으로 색상 설정) -->
            <span
              class="asset-color"
              :style="{ backgroundColor: getAssetColor(asset.name) }"
            ></span>

            <!-- 자산 이름 표시 -->
            <span class="asset-name">{{ assetNames[asset.name] }}</span>

            <!-- 자산 비율 표시 -->
            <span class="asset-percentage">{{ calculatePercentage(asset.total) }}%</span>

            <!-- 자산 금액 표시 -->
            <span class="asset-amount">{{ formatNumber(asset.total) }}원</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 추가 슬롯을 위한 영역 (필요한 경우 추가 콘텐츠를 삽입할 수 있음) -->
    <slot name="extra"></slot>
  </div>
</template>

<script setup>
//src/components/AssetPage/Distribution.vue

import { ref, computed } from 'vue'
import ChartComponent from '@/components/common/ChartComponent.vue'

const props = defineProps({
  assetDetails: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: '자산 분포'
  }
})

console.log('Distribution received assetDetails:', props.assetDetails)
console.log('Distribution received title:', props.title)

// 자산 이름 매핑
const assetNames = {
  cash: '현금자산',
  deposit: '예적금',
  stock: '주식',
  insurance: '보험'
}

// 자산 색상 매핑
const assetColors = {
  cash: '#FF6384',
  deposit: '#36A2EB',
  stock: '#FFCE56',
  insurance: '#4BC0C0'
}

// computed 속성들
const totalAsset = computed(() => {
  const total = Object.values(props.assetDetails).reduce(
    (sum, asset) => sum + (asset.total || 0),
    0
  )
  // console.log('Total asset:', total)
  return total
})

const sortedAssetDetails = computed(() => {
  const sorted = Object.entries(props.assetDetails)
    .map(([name, details]) => ({ name, ...details }))
    .sort((a, b) => b.total - a.total)
  // console.log('Sorted asset details:', sorted)
  return sorted
})

const filteredAssetDetails = computed(() => {
  const filtered = sortedAssetDetails.value.filter((asset) => asset.total > 0)
  // console.log('Filtered asset details:', filtered)
  return filtered
})

const highestAssetType = computed(() => {
  const highest = sortedAssetDetails.value[0]?.name
  // console.log('Highest asset type:', highest)
  return highest
})

// 숫자를 포맷하는 함수
const formatNumber = (num) => {
  if (isNaN(num) || num === undefined || num === null) {
    return '0' // Default to 0 when the value is NaN, undefined, or null
  }
  return num.toLocaleString()
}

// 자산의 비율 계산
const calculatePercentage = (value) => {
  if (totalAsset.value === 0 || isNaN(value)) return '0.00' // Avoid NaN
  return ((value / totalAsset.value) * 100).toFixed(2)
}

// 자산별 색상 반환
const getAssetColor = (assetName) => {
  return assetColors[assetName] || '#9966FF'
}

// chartData computed 속성
const chartData = computed(() => {
  const data = {
    labels: sortedAssetDetails.value.map((asset) => assetNames[asset.name]),
    datasets: [
      {
        data: sortedAssetDetails.value.map((asset) => asset.total || 0),
        backgroundColor: sortedAssetDetails.value.map((asset) => getAssetColor(asset.name))
      }
    ]
  }
  // console.log('Chart data:', data)
  return data
})

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
          const value = context.raw || 0 // Use 0 if value is undefined
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
  /* 자산 분포 컨테이너에 둥근 모서리, 패딩, 배경색, 그리고 그림자 효과 적용 */
  border-radius: 25px;
  padding: 2rem 1.7rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
}

.asset-type {
  /* 자산 종류를 가로로 나열하고, 가운데 정렬, 아래쪽에 8px 간격 추가 */
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.asset-color {
  /* 자산 색상을 표시하는 작은 원을 생성 (10px 크기, 둥근 모서리) */
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.asset-percentage {
  /* 자산 비율을 굵은 글자로 표시하고, 오른쪽에 8px 간격 추가, 최소 너비 설정 */
  font-weight: bold;
  margin-right: 8px;
  min-width: 40px;
}

.asset-name {
  /* 자산 이름을 표시하고 오른쪽에 8px 간격 추가 */
  flex: 1;
  margin-right: 8px;
}

.asset-amount {
  /* 자산 금액의 글자 크기를 조금 작게 설정하고, 색상을 회색으로 설정 */
  font-size: 0.8rem;
  color: #666;
}

@media (max-width: 768px) {
  .asset-distribution {
    /* 작은 화면에서는 패딩을 줄여 공간을 효율적으로 사용 */
    padding: 1.5rem 1.2rem;
  }

  .asset-type {
    /* 작은 화면에서 글자 크기를 줄여 가독성을 높임 */
    font-size: 0.8rem;
  }
}
</style>
