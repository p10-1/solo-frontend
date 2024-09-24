<template>
  <div class="product-card">
    <h2 class="product-name">{{ product.finPrdtNm }}</h2>
    <p class="company-name">{{ product.korCoNm }}</p>
    <p class="interest-rate">{{ product.mtrtInt }}</p>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd; /* 카드 테두리 */
  border-radius: 8px; /* 둥근 모서리 */
  padding: 16px; /* 패딩 */
  margin: 16px; /* 카드 간격 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  transition: transform 0.2s; /* 호버 효과 */
}

.product-card:hover {
  transform: scale(1.05); /* 호버 시 확대 효과 */
}

.product-name {
  font-size: 1.5em; /* 제품 이름 크기 */
  margin-bottom: 8px; /* 아래 여백 */
}

.company-name {
  font-weight: bold; /* 회사 이름 두껍게 */
  margin-bottom: 8px; /* 아래 여백 */
}

.interest-rate {
  color: #666; /* 이자율 색상 */
}
</style>
