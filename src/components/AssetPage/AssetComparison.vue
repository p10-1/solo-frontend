<template>
  <div class="asset-comparison">
    <h3>자산 비교</h3>
    <canvas id="assetComparison"></canvas>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Chart } from 'chart.js'

const props = defineProps({
  comparisonData: {
    type: Object,
    required: true
  }
})

onMounted(() => {
  const ctx = document.getElementById('assetComparison').getContext('2d')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['평균', '나'], // x축 레이블
      datasets: [
        {
          label: '자산 비교', // 여기서 label을 추가
          data: [props.comparisonData.average, props.comparisonData.user],
          backgroundColor: ['#4caf50', '#FF6384']
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false // 비율을 유지하지 않고 부모 크기에 맞추기
    }
  })
})
</script>

<style scoped>
.asset-comparison {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}
</style>
