<template>
  <div class="asset-ratio-chart">
    <h3>자산 비율</h3>
    <div class="chart-container">
      <canvas id="assetRatio"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

onMounted(() => {
  const ctx = document.getElementById('assetRatio').getContext('2d')
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: props.data.map((d) => d.name),
      datasets: [
        {
          data: props.data.map((d) => d.value),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }
      ]
    },
    options: {
      responsive: true, // 반응형 차트
      maintainAspectRatio: false // 비율 유지 여부
    }
  })
})
</script>

<style scoped>
.asset-ratio-chart {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}

.chart-container {
  width: 400px; /* 원하는 너비 */
  height: 400px; /* 원하는 높이 */
  position: relative;
}
</style>
