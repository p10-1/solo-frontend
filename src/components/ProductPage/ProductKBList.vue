<template>
  <div class="kb-product-list">
    <h2 class="title">
      "<span class="text-accent">ㅇㅇ</span>" 님을 위한
      <span class="text-accent">맞춤 추천 상품</span>이에요
      <span class="text-accent"><i class="fa-regular fa-face-smile"></i></span>
    </h2>
    <div v-if="loading" class="loading margin-top-3rem">
      <i class="fa-solid fa-spinner margin-bottom-1rem"></i>
      <br />로딩 중...
    </div>
    <div v-else-if="error" class="error">
      <i class="fa-solid fa-xmark argin-bottom-1rem"></i>
      {{ error }}
    </div>
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
  margin-top: -2rem;
}

.kb-product-list .title {
  text-align: center;
  line-height: 2.5rem;
  margin: 2rem 1rem 1.5rem;
  padding: 0;
  border: none;
  word-break: keep-all;
}

.kb-product-list .product-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 17px;
  background: #f3f3ff;
  padding: 2rem 1.5rem;
  min-height: 3rem;
  border-radius: 28px;
}
</style>
