<template>
  <div class="asset-distribution">
    <!-- 자산 분포 차트의 타이틀 -->
    <h3 class="main-title">{{ title }}</h3>

    <!-- 자산 분포를 나타내는 콘텐츠 영역 -->
    <div class="asset-content">
      <!-- 도넛 차트를 표시하는 영역 -->
      <div class="asset-chart">
        <!-- 차트 컴포넌트. type은 'doughnut'으로 설정, 차트 데이터를 chartData로 전달 -->
        <ChartComponent type="doughnut" :data="chartData" :options="chartOptions" />

        <!-- 자산 종류에 따른 범례를 표시 -->
        <div class="asset-legend">
          <!-- 필터링된 자산 세부 사항을 순회하여 각 자산을 범례로 표시 -->
          <div v-for="asset in filteredAssetDetails" :key="asset.name" class="asset-type">
            <!-- 자산 색상 (자산 이름에 따라 동적으로 배경색 설정) -->
            <span
              class="asset-color"
              :style="{ backgroundColor: getAssetColor(asset.name) }"
            ></span>

            <!-- 자산 이름 -->
            <span class="asset-name">{{ assetNames[asset.name] }}</span>

            <!-- 자산 비율 -->
            <span class="asset-percentage">{{ calculatePercentage(asset.total) }}%</span>

            <!-- 자산 금액 -->
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
  /* 자산 분포 카드 스타일: 둥근 모서리, 패딩 적용, 흰색 배경과 그림자 효과 추가 */
  border-radius: 25px;
  padding: 2rem 1.7rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
}

.asset-type {
  /* 자산 범례 항목: 수평 정렬, 항목 간 아래쪽에 8px의 간격 추가, 글자 크기 0.9rem */
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.asset-color {
  /* 자산 색상 원: 10px 크기의 둥근 원으로 표시, 오른쪽에 8px의 간격 추가 */
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.asset-percentage {
  /* 자산 비율 텍스트: 굵은 글자, 오른쪽에 8px의 간격 추가, 최소 너비 40px 설정 */
  font-weight: bold;
  margin-right: 8px;
  min-width: 40px;
}

.asset-name {
  /* 자산 이름 텍스트: 오른쪽에 8px 간격 추가, 남은 공간을 채움 */
  flex: 1;
  margin-right: 8px;
}

.asset-amount {
  /* 자산 금액 텍스트: 글자 크기를 0.8rem으로 설정하고, 색상을 회색(#666)으로 지정 */
  font-size: 0.8rem;
  color: #666;
}

@media (max-width: 768px) {
  .asset-distribution {
    /* 작은 화면에서는 패딩을 줄여 공간을 더 효율적으로 사용 */
    padding: 1.5rem 1.2rem;
  }

  .asset-type {
    /* 작은 화면에서는 글자 크기를 0.8rem로 줄임 */
    font-size: 0.8rem;
  }
}
</style>
