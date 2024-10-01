<template>
  <div class="total-asset">
    <h2>{{ userName }}님의 총 자산</h2>
    <div class="asset-amount">
      <span class="currency">₩</span>
      <span class="amount">{{ animatedAmount }}</span>
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
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

h2 {
  margin: 0;
  font-size: 1.5em;
  color: #333;
}
</style>
