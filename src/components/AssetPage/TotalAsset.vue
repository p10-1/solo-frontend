<template>
  <div class="total-asset">
    <h3>
      <span class="text-accent">{{ userName }}</span
      >님의 총 자산
    </h3>
    <div class="asset-amount">
      <span class="currency">₩</span>
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
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  border-radius: 25px;
  padding: 2rem 1.7rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
}
.total-asset h3 {
  font-size: 1.4rem;
  margin: 0;
}

.total-asset .asset-amount {
  font-size: 1.4rem;
}
</style>
