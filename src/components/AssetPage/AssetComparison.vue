<template>
  <div class="asset-comparison">
    <!-- 선택된 자산 유형에 따라 동적으로 타이틀을 표시 -->
    <h2 class="title">
      <span class="text-accent">{{ selectedAssetTypeName }} 자산</span> 비교
    </h2>

    <!-- 자산 비교 차트를 표시하는 영역 -->
    <div v-if="comparisonData" class="asset-comparison__chart-container">
      <!-- 차트 컴포넌트 (예: 바 차트)와 데이터를 전달 -->
      <ChartComponent type="bar" :data="chartData" :options="chartOptions" height="300px" />
    </div>

    <!-- 자산 데이터 요약 정보 -->
    <div v-if="comparisonData" class="asset-comparison__summary">
      <ul class="comparison-info">
        <li>
          <span class="text-accent user-type">{{ userType }}</span> 내
          {{ selectedAssetTypeName }} 자산
        </li>
        <li>
          <span class="text-accent">{{ formatCurrency(selectedUserAsset) }}</span
          >원
        </li>
      </ul>
      <ul class="comparison-info">
        <li>전체 <span class="text-accent">평균</span> {{ selectedAssetTypeName }} 자산</li>
        <li>
          <span class="text-accent">{{
            formatCurrency(comparisonData.overallAverage[selectedAssetType])
          }}</span
          >원
        </li>
      </ul>
      <!-- 사용자 유형별 평균 자산을 표시 -->
      <ul class="comparison-info">
        <li>
          <span class="text-accent">{{ userType }} 평균</span> {{ selectedAssetTypeName }} 자산
        </li>
        <li>
          <span class="text-accent">{{
            formatCurrency(comparisonData.typeAverage[selectedAssetType])
          }}</span
          >원
        </li>
      </ul>
    </div>

    <!-- 오류 발생 시 표시되는 메시지 -->
    <div v-if="error" class="error">
      <p>에러 발생: {{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ChartComponent from '@/components/common/ChartComponent.vue'
import { fetchAssetComparison } from '@/api/assetApi'

// Props 정의
const props = defineProps({
  userAsset: {  
    type: Object,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
  selectedAssetType: {
    type: String,
    required: true
  } // Pass this to dynamically adjust for selected asset type
})

const comparisonData = ref(null)
const error = ref(null)

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
// 퍼센티지 계산 함수 추가
const calculatePercentage = (value, total) => {
  if (total === 0 || isNaN(value)) return 0
  return (value / total) * 100
}
// 자산 타입에 따른 이름 반환
const selectedAssetTypeName = computed(() => {
  return assetTypeNames[props.selectedAssetType] || '자산'
})

// 선택된 자산에 따른 사용자 자산 반환
const selectedUserAsset = computed(() => {
  return props.userAsset[props.selectedAssetType] || 1
})

// 자산 타입에 맞춰 데이터를 로드하는 함수
const loadComparisonData = async () => {
  try {
    const response = await fetchAssetComparison(props.userType)
    comparisonData.value = response
  } catch (err) {
    error.value = '데이터를 불러오는 데 실패했습니다.'
  }
}

onMounted(loadComparisonData)

// 차트 데이터 설정
const chartData = computed(() => {
  const labels = [selectedAssetTypeName.value]

  const userData = [selectedUserAsset.value || 1]
  const overallAverageData = [comparisonData.value?.overallAverage[props.selectedAssetType] || 1]
  const typeAverageData = [comparisonData.value?.typeAverage[props.selectedAssetType] || 1]

  return {
    labels,
    datasets: [
      {
        label: '전체 평균',
        data: overallAverageData,
        backgroundColor: '#6846F5'
      },
      {
        label: `${props.userType} 평균`,
        data: typeAverageData,
        backgroundColor: '#CFDF4B'
      },
      {
        label: '내 자산',
        data: userData,
        backgroundColor: '#FFCC00'
      }
    ]
  }
})

// 차트 옵션 설정
// 차트 옵션 설정 수정
const chartOptions = computed(() => ({
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => formatCurrency(value) + `원`
      }
    },
    x: {
      ticks: {
        display: false // This hides the x-axis labels
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.dataset.label || ''
          const value = context.raw
          const total = context.chart.data.datasets.reduce(
            (sum, dataset) => sum + dataset.data[0],
            0
          )
          const percentage = calculatePercentage(value, total)
          const roundedPercentage = Math.round(percentage)
          return `${label}: ${formatCurrency(value)}원 (${roundedPercentage}%)`
        }
      }
    }
  }
}))

// 통화 형식 변환 함수
// 통화 형식 변환 함수 수정
const formatCurrency = (value) => {
  return formatNumber(value)
}
</script>

<style scoped>
.asset-comparison {
  position: relative;
  width: 100%;
  min-height: 17rem;
  border-radius: 25px;
  padding: 2rem 1.7rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}
.asset-comparison .comparison-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px dashed #cfc6fd;
}
.asset-comparison .comparison-info .user-type {
  background-color: #cfdf4b;
  border-radius: 4px;
  color: #333;
  font-weight: 400;
  font-size: 0.85rem;
  padding: 3px 10px;
  vertical-align: inherit;
}
.asset-comparison .comparison-info:last-child {
  margin-bottom: 0;
}
.asset-comparison .comparison-info li {
  font-size: 1.08rem;
  font-weight: 500;
  letter-spacing: -1px;
  color: #333;
}
.asset-comparison .comparison-info .text-accent {
  font-weight: 700;
}
</style>
