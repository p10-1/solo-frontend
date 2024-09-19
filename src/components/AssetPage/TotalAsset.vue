<template>
  <div class="total-asset">
    <h2>KB님의 총 자산은 {{ totalAmount.toLocaleString() }}원입니다</h2>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const totalAmount = ref(0)

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/assets')
    totalAmount.value = response.data.totalAmount
  } catch (error) {
    console.error('Error fetching total asset data:', error)
  }
})
</script>

<style scoped>
.total-asset {
  text-align: center;
  background-color: #fff9e6;
  padding: 20px;
  font-size: 1.5em;
  border-radius: 8px;
}
</style>
