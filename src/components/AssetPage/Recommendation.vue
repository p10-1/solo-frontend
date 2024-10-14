<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <section class="recommend-container">
    <h2 class="comment-title">
      "<span class="text-accent">{{ authStore.userInfo.userName }}</span
      >"님의 <span class="text-accent">자산 형성</span>을 도와줄
      <span class="text-accent">금융 상품</span>을 가져왔어요
      <span class="text-accent"><i class="fa-regular fa-face-smile"></i></span>
    </h2>
    <section class="recommend-content">
      <div v-if="loading" class="loading">
        <i class="fa-solid fa-spinner margin-bottom-1rem"></i>
        로딩 중...
      </div>

      <div v-else-if="error" class="error">
        <i class="fa-solid fa-xmark argin-bottom-1rem"></i>
        {{ error }}
      </div>

      <!-- recommendedProducts 배열을 순회하며 각 상품을 카드로 표시 -->
      <div v-else class="recommend-contents">
        <dl class="comment-robot">
          <dt>
            <span class="robot-icon">
              <i class="fa-solid fa-graduation-cap"></i>
            </span>
          </dt>
          <dd>
            <div class="robot-role">자산 멘토 Tip</div>
            <P class="comment">
              <b class="text-accent">{{ authStore.userInfo.userName }}</b
              >님이 가지고 계신 <b class="text-accent">대출</b>과 <b class="text-accent">기간</b>을
              비교했을 때 <b class="text-accent">이자율</b>이 높은 상품 추천드려요!
            </P>
          </dd>
        </dl>
        <ul class="recommend-list">
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
    </section>
  </section>
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
</script>

<style scoped>
.recommend-content {
  padding: 2rem 1.5rem;
  border-radius: 28px;
  background-color: #f7d095;
}

/* 상품추천 */
.recommend-list {
  display: flex;
  flex-wrap: wrap;
  gap: 17px;
}
.recommend-list .product-card {
  width: calc(50% - 8.5px);
  min-height: 8rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px #e9b566;
  border-radius: 25px;
  padding: 2rem 1.7rem;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}
.product-card .badge {
  background-color: #f7d095;
  color: #333 !important;
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

/* 코멘트 로봇 */
.comment-robot dd {
  background-color: #fff;
  box-shadow: 0px 0px 15px #e9b566;
}
.comment-robot .robot-icon {
  color: #e9b566;
  box-shadow: 0px 0px 15px #e9b566;
}
.comment-robot .robot-role {
  color: #e9b566;
}
.recommend-content .comment-robot .comment {
  line-height: 1.45rem;
  font-size: 1.05rem;
}
</style>
