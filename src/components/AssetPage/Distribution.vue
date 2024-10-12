<template>
  <div class="asset-distribution">
    <!-- 자산 분포를 설명하는 타이틀 -->
    <h3 class="main-title">{{ title }}</h3>
    <div class="asset-content">
      <div v-if="highestAssetType" class="asset-highlight margin-top-1rem">
        <i class="fa-solid fa-circle-info"></i>
        보유 자산 중 <b>{{ assetNames[highestAssetType] }}</b
        >이 제일 많아요!
      </div>

      <!-- 도넛 차트를 보여주는 섹션 -->
      <div class="asset-chart">
        <!-- ChartComponent를 사용하여 도넛 차트 표시 -->
        <ChartComponent type="doughnut" :data="chartData" :options="chartOptions" />

        <!-- 자산 종류별로 색상과 데이터를 표시하는 범례 -->
        <div class="asset-legend">
          <!-- 자산 총액이 0이 아닌 자산만 표시 -->
          <ul v-for="asset in filteredAssetDetails" :key="asset.name" class="asset-type">
            <!-- 자산 색상 표시 (자산 종류에 따라 동적으로 색상 설정) -->
            <li class="asset-name">
              <span
                :style="{ backgroundColor: getAssetColor(asset.name) }"
                class="type-color"
              ></span>
              <span class="asset-name"></span>{{ assetNames[asset.name] }}
            </li>
            <li class="asset-percentage">{{ Math.round(calculatePercentage(asset.total)) }}%</li>
            <li class="asset-amount">
              <span class="text-accent">{{ formatNumber(Math.round(asset.total)) }} </span>원
            </li>
          </ul>
        </div>
      </div>
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

// 자산 이름 매핑
const assetNames = {
  cash: '현금자산',
  deposit: '예적금',
  stock: '증권',
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
// const calculateAssetRatios = (assets) => {
//   const safeAsset =
//     (assets.cash?.total || 0) + (assets.deposit?.total || 0) + (assets.insurance?.total || 0)
//   const riskAsset = assets.stock?.total || 0
//   const totalAsset = safeAsset + riskAsset
//   return {
//     safeRatio: safeAsset / totalAsset,
//     riskRatio: riskAsset / totalAsset
//   }
// }
// const assetEvaluation = computed(() => {
//   const { safeRatio, riskRatio } = calculateAssetRatios(props.assetDetails)
//   const idealRatios = getIdealRatios(props.userType)
//   const difference = safeRatio - idealRatios.safe

//   const getRelativeDescription = (diff) => {
//     if (Math.abs(diff) < 0.2) return null // 20% 미만 차이는 언급하지 않음
//     if (Math.abs(diff) < 0.3) return diff > 0 ? '높은' : '낮은'
//     return diff > 0 ? '매우 높은' : '매우 낮은'
//   }

//   const safeDescription = getRelativeDescription(difference)
//   const riskDescription = getRelativeDescription(-difference)

//   let evaluation = ''

//   if (safeDescription) {
//     evaluation += `현재 안전자산 비중이 ${props.userType}의 평균에 비해 ${safeDescription} 편이에요. `
//   }

//   if (!safeDescription && !riskDescription) {
//     evaluation = `현재 자산 분배가 ${props.userType}의 평균과 큰 차이가 없습니다. `
//   }

//   if (Math.abs(difference) < 0.2) {
//     evaluation += `전반적으로 ${props.userType}에 적합한 자산 분배를 하고 계시네요. 현재의 균형을 잘 유지해 보세요.`
//   } else if (difference > 0) {
//     if (difference > 0.4) {
//       evaluation += `안전자산 비중이 상당히 높습니다. 일부 안전자산을 위험자산으로 전환하는 것을 고려해보시는 건 어떨까요? 이는 잠재적으로 더 높은 수익을 얻을 기회를 제공할 수 있습니다.`
//     } else {
//       evaluation += `위험자산 비중을 조금 높이는 것을 고려해보시는 건 어떨까요? 이는 장기적으로 더 높은 수익을 얻을 수 있는 기회를 제공할 수 있습니다.`
//     }
//   } else {
//     if (difference < -0.4) {
//       evaluation += `위험자산 비중이 상당히 높습니다. 일부 위험자산을 안전자산으로 전환하는 것을 고려해보시는 건 어떨까요? 이는 자산을 보호하고 리스크를 줄이는 데 도움이 될 수 있습니다.`
//     } else {
//       evaluation += `안전자산 비중을 조금 높이는 것을 고려해보시는 건 어떨까요? 이는 자산을 안정적으로 관리하는 데 도움이 될 수 있습니다.`
//     }
//   }

//   return evaluation.trim()
// })
</script>

<style scoped>
.asset-distribution {
  border-radius: 25px;
  padding: 2rem 1.7rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
}
.asset-highlight {
  font-size: 1rem;
  color: #555;
  letter-spacing: -0.7px;
  font-weight: 500;
  padding: 12px 16px;
  word-break: keep-all;
  border-radius: 12px;
  background-color: #fffbec;
  color: var(--font-secondary, #475067);
}
.asset-highlight i {
  color: #f7d095;
  margin-right: 2px;
}
.asset-legend .asset-type {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #cfc6fd;
}
.asset-type .asset-name {
  flex: 0 0 45%;
  font-size: 1rem;
  letter-spacing: -1px;
  font-weight: 500;
}
.asset-legend .asset-name .type-color {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-right: 5px;
}
.asset-type .asset-percentage {
  flex: 0 0 10%;
  font-weight: bold;
  padding: 3px 10px;
  background-color: #f3f3ff;
  border-radius: 20%;
}
.asset-type .asset-amount {
  text-align: right;
  flex: 0 0 30%;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.8px;
  color: #333;
}
.asset-type .asset-amount .text-accent {
  font-weight: 700;
}

/* .asset-evaluation {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.asset-evaluation h4 {
  color: #495057;
  margin-bottom: 10px;
} */

@media (max-width: 768px) {
  .asset-distribution {
    padding: 1.5rem 1.2rem;
  }

  .asset-type {
    font-size: 0.8rem;
  }
}
</style>
