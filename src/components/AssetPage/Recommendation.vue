<template>
  <div class="recommended-products">
    <!-- 추천 상품 섹션 제목 -->
    <h2 class="title">추천 상품</h2>

    <!-- 로딩 중일 때 표시되는 메시지 -->
    <div v-if="loading">로딩 중...</div>

    <!-- 에러가 발생했을 때 표시되는 메시지 -->
    <div v-else-if="error">{{ error }}</div>

    <!-- 추천 상품 리스트 -->
    <div v-else>
      <!-- recommendedProducts 배열을 순회하며 각 상품을 카드로 표시 -->
      <div v-for="product in recommendedProducts" :key="product.finPrdtCd" class="product-card">
        <!-- 상품명 -->
        <h3>{{ product.finPrdtNm }}</h3>

        <!-- 회사명 -->
        <p>{{ product.korCoNm }}</p>

        <!-- 상품의 옵션이 있는 경우 이자율, 최고우대금리, 저축 기간을 표시 -->
        <div v-if="product.options && product.options.length > 0">
          <p>이자율: {{ product.options[0].intrRate }}%</p>
          <p>최고우대금리: {{ product.options[0].intrRate2 }}%</p>
          <p>저축 기간: {{ product.options[0].saveTrm }}개월</p>
        </div>

        <!-- 옵션 정보가 없는 경우 기본 메시지 표시 -->
        <p v-else>이자율 정보를 불러오는 중...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRecommend, fetchOption } from '@/api/productApi'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const recommendedProducts = ref([])
const loading = ref(false)
const error = ref(null)

const fetchRecommendedProducts = async () => {
  loading.value = true
  error.value = null
  try {
    const products = await getRecommend(authStore.userInfo.userId)
    recommendedProducts.value = await Promise.all(
      products.map(async (product) => {
        const options = await fetchOption(product.finPrdtCd)
        return { ...product, options }
      })
    )
  } catch (err) {
    error.value = '추천 상품을 불러오는데 실패했습니다.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchRecommendedProducts)

// watch(() => props.loanPeriod, fetchRecommendedProducts)
</script>

<style scoped>
.recommended-products {
  /* 추천 상품 섹션의 상단에 20px의 여백 추가 */
  margin-top: 20px;
}

.product-card {
  /* 상품 카드를 1px 두께의 회색(#ddd) 테두리로 감싸고, 10px의 패딩과 4px의 둥근 모서리 적용 */
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px; /* 카드들 사이에 10px 간격 추가 */
  border-radius: 4px;
}
</style>
