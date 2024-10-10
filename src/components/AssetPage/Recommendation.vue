<template>
  <div class="recommend-container">
    <h2 class="title">추천 상품</h2>
    <div class="recommend-content">
      <div v-if="loading" class="loading">
        <i class="fa-solid fa-spinner margin-bottom-1rem"></i>
        로딩 중...
      </div>

      <div v-else-if="error" class="error">
        <i class="fa-solid fa-xmark argin-bottom-1rem"></i>
        {{ error }}
      </div>

      <!-- recommendedProducts 배열을 순회하며 각 상품을 카드로 표시 -->
      <ul v-else class="recommend-list">
        <li v-for="product in recommendedProducts" :key="product.finPrdtCd" class="product-card">
          <span class="badge">{{ product.korCoNm }}</span>
          <h4 class="card-title text-align-left link">{{ product.finPrdtNm }}</h4>
          <!-- 상품의 옵션이 있는 경우 이자율, 최고우대금리, 저축 기간을 표시 -->
          <div v-if="product.options && product.options.length > 0" class="card-content">
            <ul>
              <li>
                이자율:
                <span class="text-accent">{{ product.options[0].intrRate }}</span>
                %
              </li>
              <li>
                최고우대금리:
                <span class="text-accent">{{ product.options[0].intrRate2 }}</span>
                %
              </li>
              <li>
                저축 기간:
                <span class="text-accent">{{ product.options[0].saveTrm }}</span>
                개월
              </li>
            </ul>
          </div>
          <div v-else class="loading">
            <i class="fa-solid fa-spinner margin-bottom-1rem"></i><br />
            이자율 정보를 불러오는 중...
          </div>
        </li>
      </ul>
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
.recommend-content {
  padding: 2rem 1.5rem;
  border-radius: 28px;
  background-color: #e4deff;
}
.recommend-list {
  display: flex;
  flex-wrap: wrap;
  gap: 17px;
}
.recommend-list .product-card {
  width: calc(50% - 8.5px);
  min-height: 8rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px #cfc6fd;
  border-radius: 25px;
  padding: 2rem 1.7rem;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}
.recommend-list .product-card .card-title {
  font-size: 1.22rem;
  word-break: keep-all;
  line-height: 1.6rem;
  letter-spacing: -1px;
  margin-bottom: 10px;
}
.recommend-list .product-card .card-content {
  border-top: 1px dashed #e4deff;
  padding-top: 10px;
  font-size: 0.9rem;
  color: #333;
  font-weight: 400;
  word-break: keep-all;
  line-height: 24px;
  letter-spacing: -1px;
  font-weight: 400;
  margin: 10px 0 0;
  white-space: pre-line;
}
.recommend-list .product-card .text-accent {
  font-weight: 700;
  margin-left: 5px;
}
</style>
