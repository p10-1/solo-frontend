<template>
  <div class="total-asset">
    <!-- 사용자 이름과 총 자산 금액 표시 -->
    <h2>{{ userName }}님의 총 자산: {{ formattedTotalAmount }}원</h2>
  </div>
</template>

<script setup>
//src/components/AssetPage/TotalAsset.vue

// 총 자산 컴포넌트
import { computed } from 'vue'
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

// 총 자산 금액을 통화 포맷으로 변환
const formattedTotalAmount = computed(() => {
  return props.totalAmount.toLocaleString() // 숫자를 세 자리마다 쉼표로 구분
})

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
