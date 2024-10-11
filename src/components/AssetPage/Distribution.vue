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
            <span class="asset-percentage"
              >{{ Math.round(calculatePercentage(asset.total)) }}%</span
            >

            <!-- 자산 금액 표시 -->
            <span class="asset-amount">{{ formatNumber(Math.round(asset.total)) }}원</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 추가 -->
    <div class="asset-evaluation">
      <h4>자산 평가</h4>
      <p>{{ assetEvaluation }}</p>
    </div>
  </div>
</template>

<script setup>
//src/components/AssetPage/Distribution.vue

import { ref, computed } from 'vue'
import ChartComponent from '@/components/common/ChartComponent.vue'

//추가
const props = defineProps({
  assetDetails: {
    type: Object,
    required: true
    // 예: { cash: { total: 1000000 }, deposit: { total: 2000000 }, stock: { total: 1500000 }, insurance: { total: 500000 } }
  },
  title: {
    type: String,
    default: '자산 분포'
    // 예: '내 자산 분포', '위험 추구형 평균 자산 분포', '전체 사용자 평균 자산 분포'
  },
  userType: {
    type: String,
    required: true
    // 예: '위험 추구형', '안정 추구형', '자산 분산형', '대출 우선형'
  },
  comparisonType: {
    type: String,
    required: true
    // 'personal', 'typeAverage', 'overallAverage' 중 하나
  },
  userAssetDetails: {
    type: Object,
    default: () => ({})
    // 사용자의 실제 자산 정보. assetDetails와 같은 구조
  }
})
//추가
const getIdealRatios = (userType) => {
  switch (userType) {
    case '위험 추구형':
      return { safe: 0.5, risk: 0.5 }
    case '자산 분산형':
      return { safe: 0.6, risk: 0.4 }
    case '안정 추구형':
      return { safe: 0.8, risk: 0.2 }
    case '대출 우선형':
      return { safe: 1.0, risk: 0.0 }
    default:
      return { safe: 0.6, risk: 0.4 }
  }
}

// 로그 추가
console.log('Distribution component received props:')
console.log('title:', props.title)
console.log('userType:', props.userType)
console.log('assetDetails:', props.assetDetails)

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

const highestAssetType = computed(() => {
  return sortedAssetDetails.value[0]?.name
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

const chartData = computed(() => {
  return {
    labels: sortedAssetDetails.value.map((asset) => assetNames[asset.name]),
    datasets: [
      {
        data: sortedAssetDetails.value.map((asset) => asset.total || 0),
        backgroundColor: sortedAssetDetails.value.map((asset) => getAssetColor(asset.name))
      }
    ]
  }
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


//추가
const calculateAssetRatios = (assets) => {
  const safeAsset =
    (assets.cash?.total || 0) + (assets.deposit?.total || 0) + (assets.insurance?.total || 0)
  const riskAsset = assets.stock?.total || 0
  const totalAsset = safeAsset + riskAsset
  return {
    safeRatio: safeAsset / totalAsset,
    riskRatio: riskAsset / totalAsset
  }
}
//추가
const assetEvaluation = computed(() => {
  const { safeRatio, riskRatio } = calculateAssetRatios(props.assetDetails)
  const idealRatios = getIdealRatios(props.userType)
  const difference = (safeRatio - idealRatios.safe) * 100

  let evaluation = `현재 안전자산 비중은 ${(safeRatio * 100).toFixed(1)}%, 위험자산 비중은 ${(riskRatio * 100).toFixed(1)}%입니다. `

  if (Math.abs(difference) < 5) {
    evaluation += `${props.userType}에 적합한 비율과 유사합니다.`
  } else if (difference > 0) {
    evaluation += `현재 안전자산 비중이 ${props.userType}에 비해 ${Math.abs(difference).toFixed(1)}% 높습니다. 위험자산 비중을 높이는 것을 고려해보세요.`
  } else {
    evaluation += `현재 위험자산 비중이 ${props.userType}에 비해 ${Math.abs(difference).toFixed(1)}% 높습니다. 안전자산 비중을 높이는 것을 고려해보세요.`
  }

  return evaluation
})
</script>

<style scoped>
.asset-distribution {
  border-radius: 25px;
  padding: 2rem 1.7rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
}

.asset-type {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.asset-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.asset-percentage {
  font-weight: bold;
  margin-right: 8px;
  min-width: 40px;
}

.asset-name {
  flex: 1;
  margin-right: 8px;
}

.asset-amount {
  font-size: 0.8rem;
  color: #666;
}

.asset-evaluation {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.asset-evaluation h4 {
  color: #495057;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .asset-distribution {
    padding: 1.5rem 1.2rem;
  }

  .asset-type {
    font-size: 0.8rem;
  }
}
</style>
