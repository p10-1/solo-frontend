<template>
  <div class="asset-comparison">
    <!-- Dynamically show the title based on selected asset type -->
    <h2 class="asset-comparison__title">{{ selectedAssetTypeName }} 비교</h2>

    <!-- Chart -->
    <div v-if="comparisonData" class="asset-comparison__chart-container">
      <ChartComponent type="bar" :data="chartData" :options="chartOptions" height="300px" />
    </div>

    <!-- Asset data summary -->
    <div v-if="comparisonData" class="asset-comparison__summary">
      <p>자산 유형: {{ userType }}</p>
      <p>
        전체 평균 {{ selectedAssetTypeName }} 자산:
        {{ formatCurrency(comparisonData.overallAverage[selectedAssetType]) }}
      </p>
      <p>
        {{ userType }} 평균 {{ selectedAssetTypeName }} 자산:
        {{ formatCurrency(comparisonData.typeAverage[selectedAssetType]) }}
      </p>
      <p>내 {{ selectedAssetTypeName }} 자산: {{ formatCurrency(selectedUserAsset) }}</p>
    </div>

    <!-- Error message -->
    <div v-if="error" class="asset-comparison__error">
      <p>에러 발생: {{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
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
  stock: '주식',
  insurance: '보험'
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
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      },
      {
        label: `${props.userType} 평균`,
        data: typeAverageData,
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      },
      {
        label: '내 자산',
        data: userData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  }
})

// 차트 옵션 설정
const chartOptions = computed(() => ({
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => formatCurrency(value)
      }
    }
  }
}))

// 통화 형식 변환 함수
const formatCurrency = (value) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)
}
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

.asset-comparison__error {
  color: red;
  text-align: center;
}

@media (max-width: 768px) {
  .asset-comparison__chart-container {
    height: 250px;
  }

  .asset-comparison__title {
    font-size: 1.3rem;
  }
}
</style>
