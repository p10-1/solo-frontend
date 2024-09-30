<template>
  <div class="recommendation">
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
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  assetType: {
    type: String,
    required: true
  },
  assetData: {
    type: Object,
    required: true
  }
})
const recommendedProduct = computed(() => {
  const { cash, deposit, stock, property } = props.assetData
  const total = cash + deposit + stock + property

  if (stock / total > 0.5) return '주식형 펀드'
  if (property / total > 0.7) return '리츠 (REITs)'
  if ((cash + deposit) / total > 0.6) return '고금리 예금 상품'
  return '분산 투자 ETF'
})

const recommendedPolicy = computed(() => {
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
  justify-content: space-between;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}
.recommend-product,
.recommend-policy {
  width: 48%;
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
}
</style>
