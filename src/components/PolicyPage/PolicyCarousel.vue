<template>
  <div id="policyCarousel" class="carousel slide">
    <div class="carousel-inner" @click="handleCardClick">
      <div
        class="carousel-item"
        v-for="(policy, index) in policies"
        :key="policy.bizId"
        :class="{ active: index === currentIndex }"
      >
        <div class="d-flex justify-content-center">
          <div class="policy-card">
            <h3>청년 정책 알아보기</h3>
            <h5 class="policy-title">{{ policy.polyBizSjnm }}</h5>
            <p class="policy-description">{{ policy.polyItcnCn }}</p>
            <!-- 버튼 클릭 시 /policy 로 이동 -->
            <button class="btn btn-primary btn-sm mt-3" @click.stop="goToPolicy">
              더 알아보기
            </button>
          </div>
        </div>
      </div>
    </div>
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

// "/policy"로 이동하는 함수
const goToPolicy = () => {
  router.push('/policy')
}

// 왼쪽 클릭하면 이전 슬라이드, 오른쪽 클릭하면 다음 슬라이드
const handleCardClick = (event) => {
  const cardWidth = event.currentTarget.clientWidth
  const clickPosition = event.offsetX

  if (clickPosition < cardWidth / 2) {
    prevSlide() // 왼쪽 클릭: 이전 슬라이드
  } else {
    nextSlide() // 오른쪽 클릭: 다음 슬라이드
  }
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % policies.value.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + policies.value.length) % policies.value.length
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
.policy-card {
  width: 500px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease;
}

.policy-card:hover {
  transform: scale(1.05);
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
}

button.btn-sm {
  font-size: 0.875rem;
  padding: 5px 10px;
}
</style>
