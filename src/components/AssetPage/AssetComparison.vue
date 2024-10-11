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
        <li>자산 유형</li>
        <li>
          <span class="text-accent">{{ userType }}</span>
        </li>
      </ul>
      <ul class="comparison-info">
        <li>전체 평균 {{ selectedAssetTypeName }} 자산</li>
        <li>
          <span class="text-accent">{{
            formatCurrency(comparisonData.overallAverage[selectedAssetType])
          }}</span
          >원
        </li>
      </ul>
      <!-- 사용자 유형별 평균 자산을 표시 -->
      <ul class="comparison-info">
        <li>{{ userType }} 평균 {{ selectedAssetTypeName }} 자산</li>
        <li>
          <span class="text-accent">{{
            formatCurrency(comparisonData.typeAverage[selectedAssetType])
          }}</span
          >원
        </li>
      </ul>
      <ul class="comparison-info">
        <li>내 {{ selectedAssetTypeName }} 자산</li>
        <li>
          <span class="text-accent">{{ formatCurrency(selectedUserAsset) }}</span
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
  margin-bottom: 1rem;
  border-bottom: 1px dashed #cfc6fd;
}
.asset-comparison .comparison-info li {
  font-size: 1.08rem;
  font-weight: 500;
  letter-spacing: -1px;
  color: #333;
}
.asset-comparison .comparison-info .text-accent {
  font-weight: 600;
}
</style>
