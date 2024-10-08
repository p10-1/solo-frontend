<template>
  <div class="total-asset">
    <!-- 사용자 이름과 총 자산 타이틀 -->
    <h3>
      <span class="text-accent">{{ userName }}</span
      >님의 총 자산
    </h3>

    <!-- 총 자산 금액 표시 영역 -->
    <div class="asset-amount">
      <!-- 통화 기호 -->
      <span class="currency">₩</span>
      <!-- 애니메이션으로 자산 금액을 표시 -->
      <span class="amount">{{ animatedAmount }}원</span>
    </div>
  </div>
</template>

<script setup>
//src/components/AssetPage/TotalAsset.vue

// 총 자산 컴포넌트
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore' // 사용자 인증 스토어 사용

// 부모 컴포넌트로부터 총 자산 금액을 props로 전달받음
const props = defineProps({
  totalAmount: {
    type: Number,
    required: true
  }
})

// 스토어에서 사용자 이름 가져오기
const authStore = useAuthStore()
const userName = computed(() => authStore.username) // 스토어에서 사용자 이름을 가져옴

const animatedAmount = ref('0')

const animateValue = (start, end, duration) => {
  let startTimestamp = null
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp
    const progress = Math.min((timestamp - startTimestamp) / duration, 1)
    const current = Math.floor(progress * (end - start) + start)
    animatedAmount.value = current.toLocaleString()
    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }
  window.requestAnimationFrame(step)
}

onMounted(() => {
  animateValue(0, props.totalAmount, 1000)
})

watch(
  () => props.totalAmount,
  (newValue, oldValue) => {
    animateValue(oldValue, newValue, 1000)
  }
)
</script>

<style scoped>
.total-asset {
  /* 총 자산 영역을 플렉스 박스로 설정하여 타이틀과 금액을 수평으로 정렬, 
     베이스라인을 기준으로 정렬하고, 필요시 줄바꿈 허용 */
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;

  /* 배경색을 흰색으로 설정하고, 둥근 모서리와 그림자 효과 적용 */
  border-radius: 25px;
  padding: 2rem 1.7rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
}

.total-asset h3 {
  /* 총 자산 타이틀의 글자 크기를 1.4rem으로 설정, 마진을 제거 */
  font-size: 1.4rem;
  margin: 0;
}

.total-asset .asset-amount {
  /* 총 자산 금액의 글자 크기를 1.4rem으로 설정 */
  font-size: 1.4rem;
}
</style>
