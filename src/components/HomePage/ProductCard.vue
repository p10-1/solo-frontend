<template>
  <div class="slider-container">
    <div class="slider" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(product, index) in products" :key="index" class="slider-card">
        <h3>{{ product.finPrdtNm }}</h3>
        <p>{{ product.korCoNm }}</p>
        <p>{{ product.mtrtInt }}</p>
      </div>
    </div>
    <!-- 첫 번째 아이템에서는 좌측 버튼을 비활성화 -->
    <button @click="prevSlide" class="prev-btn" :disabled="currentIndex === 0">‹</button>
    <!-- 마지막 아이템에서는 우측 버튼을 비활성화 -->
    <button @click="nextSlide" class="next-btn" :disabled="currentIndex === products.length - 1">
      ›
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { getRecommend } from '@/api/productApi.js'

const products = ref([])
const currentIndex = ref(0)
const authStore = useAuthStore()

const fetchRecommendProducts = async () => {
  try {
    products.value = await getRecommend(authStore.userInfo.userId)
    console.log(products.value)
  } catch (error) {
    console.error('추천 상품을 가져오는 데 실패했습니다:', error)
  }
}

const nextSlide = () => {
  if (currentIndex.value < products.value.length - 1) {
    currentIndex.value++
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

onMounted(() => {
  fetchRecommendProducts()
})
</script>

<style scoped>
.slider-container {
  position: relative;
  width: 500px; /* 컴포넌트 크기 키움 */
  overflow: hidden;
  margin: auto;
}

.slider {
  display: flex;
  transition: transform 0.5s ease;
}

.slider-card {
  min-width: 100%;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 30px; /* 패딩을 더 줘서 여유롭게 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.prev-btn,
.next-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.prev-btn:disabled,
.next-btn:disabled {
  cursor: not-allowed;
  opacity: 0.3; /* 비활성화 상태에서는 투명도 감소 */
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}

.prev-btn:hover:not(:disabled),
.next-btn:hover:not(:disabled) {
  opacity: 1; /* 활성화된 버튼은 hover 시 완전히 보이도록 */
}
</style>
