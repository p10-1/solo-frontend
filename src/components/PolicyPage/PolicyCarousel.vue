<template>
  <div class="policy-carousel">
    <h2>추천 정책</h2>
    <div class="carousel-content">
      <div v-for="policy in visiblePolicies" :key="policy.id" class="carousel-item">
        <h3>{{ policy.title }}</h3>
        <p>{{ policy.description }}</p>
        <button class="apply-button">신청</button>
      </div>
    </div>

    <!-- 화살표 -->
    <button class="carousel-arrow left" @click="prevSlide" :disabled="currentIndex === 0">←</button>
    <button
      class="carousel-arrow right"
      @click="nextSlide"
      :disabled="currentIndex >= policies.length - 4"
    >
      →
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  policies: {
    type: Array,
    required: true
  }
})

const currentIndex = ref(0)

const visiblePolicies = computed(() => {
  return props.policies.slice(currentIndex.value, currentIndex.value + 4)
})

const prevSlide = () => {
  if (currentIndex.value > 0) currentIndex.value--
}

const nextSlide = () => {
  if (currentIndex.value < props.policies.length - 4) currentIndex.value++
}
</script>

<style scoped>
.policy-carousel {
  margin-bottom: 30px; /* 추천 정책 아래에 여백 추가 */
}

.carousel-content {
  display: flex;
  justify-content: space-between; /* 카드들이 옆으로 나열되도록 조정 */
}

.carousel-item {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 20px;
  margin: 0 10px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.apply-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
