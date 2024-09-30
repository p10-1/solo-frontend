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
  recommendationData: {
    type: Object,
    required: true
  }
})

const isDataAvailable = computed(() => {
  return props.recommendationData && Object.keys(props.recommendationData).length > 0
})

const recommendedProduct = computed(() => {
  if (!isDataAvailable.value) return '데이터 없음'

  const { cash, deposit, stock, property } = props.recommendationData
  const total = (cash || 0) + (deposit || 0) + (stock || 0) + (property || 0)

  if (total === 0) return '자산 정보 없음'

  if ((stock || 0) / total > 0.5) return '주식형 펀드'
  if ((property || 0) / total > 0.7) return '리츠 (REITs)'
  if (((cash || 0) + (deposit || 0)) / total > 0.6) return '고금리 예금 상품'
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
    case 'property':
      return '임대 수익 최적화 및 세금 계획'
    default:
      return '자산 배분 전략 수립'
  }
})
</script>

<style scoped>
.recommendation {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  margin-top: 20px;
}
.recommend-product,
.recommend-policy {
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  margin-top: 10px;
}
.no-data {
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  text-align: center;
  color: #666;
  margin-top: 20px;
}
</style>
