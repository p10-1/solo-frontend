<template>
  <div class="asset-comparison">
    <!-- 선택된 자산 유형에 따라 동적으로 타이틀을 표시 -->
    <h2 class="asset-comparison__title">{{ selectedAssetTypeName }} 비교</h2>

    <!-- 자산 비교 차트를 표시하는 영역 -->
    <div v-if="comparisonData" class="asset-comparison__chart-container">
      <!-- 차트 컴포넌트 (예: 바 차트)와 데이터를 전달 -->
      <ChartComponent type="bar" :data="chartData" :options="chartOptions" height="300px" />
    </div>

    <!-- 자산 데이터 요약 정보 -->
    <div v-if="comparisonData" class="asset-comparison__summary">
      <!-- 사용자 자산 유형을 표시 -->
      <p>자산 유형: {{ userType }}</p>
      <!-- 전체 평균 자산을 표시 -->
      <p>
        전체 평균 {{ selectedAssetTypeName }} 자산:
        {{ formatCurrency(comparisonData.overallAverage[selectedAssetType]) }}
      </p>
      <!-- 사용자 유형별 평균 자산을 표시 -->
      <p>
        {{ userType }} 평균 {{ selectedAssetTypeName }} 자산:
        {{ formatCurrency(comparisonData.typeAverage[selectedAssetType]) }}
      </p>
      <!-- 사용자의 자산 데이터를 표시 -->
      <p>내 {{ selectedAssetTypeName }} 자산: {{ formatCurrency(selectedUserAsset) }}</p>
    </div>

    <!-- 오류 발생 시 표시되는 메시지 -->
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
  /* 자산 비교 컴포넌트의 배경을 흰색으로 설정하고, 모서리를 둥글게 처리, 약간의 그림자와 내부 패딩 적용 */
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.asset-comparison__title {
  /* 타이틀 폰트 크기를 1.5rem으로 설정, 색상을 짙은 회색(#333)으로 설정, 아래쪽에 20px 간격 추가, 텍스트를 중앙 정렬 */
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.asset-comparison__chart-container {
  /* 차트 컨테이너의 높이를 300px로 설정하고, 아래쪽에 20px 간격 추가 */
  height: 300px;
  margin-bottom: 20px;
}

.asset-comparison__summary {
  /* 자산 요약 정보를 담는 섹션에 연한 회색 배경을 적용하고, 모서리를 둥글게 처리, 15px 패딩 적용 */
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 15px;
}

.asset-comparison__error {
  /* 오류 메시지 텍스트 색상을 빨간색으로 설정하고, 중앙에 정렬 */
  color: red;
  text-align: center;
}

@media (max-width: 768px) {
  .asset-comparison__chart-container {
    /* 화면 너비가 768px 이하일 때 차트 컨테이너 높이를 250px로 줄임 */
    height: 250px;
  }

  .asset-comparison__title {
    /* 화면 너비가 좁을 때 타이틀 폰트 크기를 1.3rem으로 줄임 */
    font-size: 1.3rem;
  }
}
</style>
