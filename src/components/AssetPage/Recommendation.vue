<template>
  <div class="recommendation" v-if="isDataAvailable">
    <h2>맞춤 추천</h2>
    <div class="recommend-product">
      <h3>추천 상품</h3>
      <p>{{ recommendedProduct }}</p>
    </div>
    <div class="recommend-policy">
      <h3>추천 정책</h3>
      <p>{{ recommendedPolicy }}</p>
    </div>
  </div>
  <div v-else class="no-data">데이터를 불러오는 중이거나 사용 가능한 데이터가 없습니다.</div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  assetType: {
    type: String,
    required: true
  },
  assetDetails: {
    type: Object,
    required: true
  }
})

const isDataAvailable = computed(() => {
  return props.assetDetails && Object.keys(props.assetDetails).length > 0
})

const recommendedProduct = computed(() => {
  if (!isDataAvailable.value) return '데이터 없음'

  const { cash, deposit, stock, insurance } = props.assetDetails
  const total = cash.total + deposit.total + stock.total + insurance.total

  if (total === 0) return '자산 정보 없음'

  if (stock.total / total > 0.5) return '주식형 펀드'
  if (insurance.total / total > 0.7) return '리츠 (REITs)'
  if ((cash.total + deposit.total) / total > 0.6) return '고금리 예금 상품'
  return '분산 투자 ETF'
})

const recommendedPolicy = computed(() => {
  if (!isDataAvailable.value) return '데이터 없음'

  switch (props.assetType) {
    case 'cash':
      return '단기 고금리 상품 활용'
    case 'deposit':
      return '계단식 예금으로 유동성 확보'
    case 'stock':
      return '장기 투자 및 정기적 리밸런싱'
    case 'insurance':
      return '보험 포트폴리오 최적화 및 보장 검토'
    default:
      return '자산 배분 전략 수립'
  }
})
</script>

<style scoped>
/* 스타일은 그대로 유지 */
</style>
