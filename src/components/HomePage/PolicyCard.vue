<template>
  <div class="slider-container">
    <div class="slider" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(policy, index) in policies" :key="index" class="slider-card" @click="goToPolicy">
        <h3>청년 정책 알아보기</h3>
        <h5 class="policy-title">{{ policy.polyBizSjnm }}</h5>
        <p class="policy-description">{{ policy.polyItcnCn }}</p>
        <button class="btn btn-primary btn-sm mt-3" @click.stop="goToPolicy">더 알아보기</button>
      </div>
    </div>
    <!-- 첫 번째 아이템에서는 좌측 버튼을 비활성화 -->
    <button @click="prevSlide" class="prev-btn" :disabled="currentIndex === 0">‹</button>
    <!-- 마지막 아이템에서는 우측 버튼을 비활성화 -->
    <button @click="nextSlide" class="next-btn" :disabled="currentIndex === policies.length - 1">
      ›
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { recommendPolicies } from '@/api/policyApi'

const router = useRouter()
const policies = ref([])
const currentIndex = ref(0)

const fetchPolicies = async () => {
  try {
    policies.value = await recommendPolicies()
  } catch (error) {
    console.error('정책을 가져오는 데 실패했습니다:', error)
  }
}

const goToPolicy = () => {
  router.push('/policy')
}

const nextSlide = () => {
  if (currentIndex.value < policies.value.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

let slideInterval
const startAutoSlide = () => {
  slideInterval = setInterval(nextSlide, 3000)
}

onMounted(() => {
  fetchPolicies()
  startAutoSlide()
})

onUnmounted(() => {
  clearInterval(slideInterval)
})
</script>

<style scoped>
.btn {
  background-color: #6846f5;
  color: white;
}
.btn:hover {
  background-color: #6143d6;
  color: white;
}
.slider-container {
  position: relative;
  width: 500px; /* 컴포넌트 크기 키움 */
  overflow: hidden;
  margin: auto;
}

.slider {
  background-color: white;
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

.policy-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 10px 0;
  color: #333;
}

.policy-description {
  font-size: 1rem;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.prev-btn,
.next-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #6846f5;
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
