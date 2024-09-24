<template>
  <div class="kb-product-list">
    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div class="product-cards">
      <ProductKBItem
        v-for="product in products"
        :key="product.productNo"
        :product="product"
        @mouseover="onMouseOver"
        @mouseleave="onMouseLeave"
      />
    </div>
  </div>
</template>

<script>
import { fetchKbProducts } from '@/api/productApi' // fetchKbProducts 함수 경로
import ProductKBItem from './ProductKBItem.vue'

export default {
  components: {
    ProductKBItem
  },
  data() {
    return {
      products: [], // 제품 목록
      loading: true, // 로딩 상태
      error: null, // 에러 상태
      hoveredCard: null // 현재 마우스를 올린 카드
    }
  },
  async mounted() {
    await this.loadProducts() // 컴포넌트 마운트 시 데이터 로드
  },
  methods: {
    async loadProducts() {
      try {
        this.products = await fetchKbProducts() // 데이터 가져오기
      } catch (error) {
        this.error = '상품을 가져오는 데 실패했습니다. 다시 시도해주세요.' // 에러 처리
      } finally {
        this.loading = false // 로딩 완료
      }
    },
    onMouseOver(productNo) {
      this.hoveredCard = productNo // 마우스를 올린 카드 번호 저장
    },
    onMouseLeave() {
      this.hoveredCard = null // 마우스가 떠났을 때 초기화
    }
  }
}
</script>

<style scoped>
.kb-product-list {
  display: flex;
  flex-direction: column; /* 세로로 정렬 */
}

.loading {
  text-align: center; /* 중앙 정렬 */
}

.error {
  color: red; /* 에러 메시지 색상 */
  text-align: center; /* 중앙 정렬 */
}

.product-cards {
  display: flex; /* 가로로 펼치기 */
  flex-wrap: wrap; /* 카드가 여러 줄로 나열되도록 */
  justify-content: space-around; /* 카드 간격 조정 */
}
</style>
