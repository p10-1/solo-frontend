<template>
  <div class="total-asset">
    <h2>{{ userName }}님의 총 자산: {{ formattedTotalAmount }}원</h2>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  totalAmount: {
    type: Number,
    required: true
  }
})
const authStore = useAuthStore()
const userName = computed(() => authStore.username)

const formattedTotalAmount = computed(() => {
  return props.totalAmount.toLocaleString()
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
