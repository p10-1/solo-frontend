<template>
  <div class="recommended-products">
    <h2>추천 상품</h2>
    <div v-if="loading">로딩 중...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-for="product in recommendedProducts" :key="product.finPrdtCd" class="product-card">
        <h3>{{ product.finPrdtNm }}</h3>
        <p>{{ product.korCoNm }}</p>
        <div v-if="product.options && product.options.length > 0">
          <p>이자율: {{ product.options[0].intrRate }}%</p>
          <p>최고우대금리: {{ product.options[0].intrRate2 }}%</p>
          <p>저축 기간: {{ product.options[0].saveTrm }}개월</p>
        </div>
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
  margin-top: 20px;
}

.product-card {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}
</style>
