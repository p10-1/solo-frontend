<template>
  <div
    class="kb-product-card"
    :class="{ hovered: isHovered }"
    @mouseover="toggleHover(true)"
    @mouseleave="toggleHover(false)"
  >
    <h2 class="product-name">{{ product.finPrdtNm }}</h2>
    <p class="company-name">{{ product.korCoNm }}</p>
    <p v-if="isHovered" class="interest-rate">{{ product.mtrtInt }}</p>
    <!-- 호버 시 이자율 표시 -->
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isHovered: false // 카드 호버 상태
    }
  },
  methods: {
    toggleHover(state) {
      this.isHovered = state // 호버 상태 토글
    }
  }
}
</script>
<style scoped>
.kb-product-card {
  border: 1px solid #ddd; /* 카드 테두리 */
  border-radius: 8px; /* 둥근 모서리 */
  padding: 12px; /* 패딩 조정 */
  margin: 8px; /* 카드 간격 조정 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  transition:
    transform 0.3s,
    box-shadow 0.3s; /* 호버 효과 */
  width: calc(16.66% - 16px); /* 카드 너비 조정 (한 줄에 6개) */
  flex: 0 0 auto; /* Flexbox 설정 */
}

.kb-product-card.hovered {
  transform: scale(1.1); /* 호버 시 확대 효과 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* 강조된 그림자 효과 */
}

.product-name {
  font-size: 1.2em; /* 제품 이름 크기 조정 */
  margin-bottom: 6px; /* 아래 여백 조정 */
}

.company-name {
  font-weight: bold; /* 회사 이름 두껍게 */
  margin-bottom: 6px; /* 아래 여백 조정 */
}

.interest-rate {
  color: #666; /* 이자율 색상 */
  margin-top: 6px; /* 위 여백 조정 */
  transition: opacity 0.3s; /* 부드러운 전환 효과 */
}
</style>
