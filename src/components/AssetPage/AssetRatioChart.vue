<template>
  <div class="asset-ratio-chart">
    <h3>자산 비율</h3>
    <div v-if="data && data.length" class="chart-container">
      <canvas ref="assetRatioCanvas"></canvas>
    </div>
    <div v-else>데이터가 없습니다.</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js'

// Chart.js 등록
Chart.register(PieController, ArcElement, Tooltip, Legend)

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const assetRatioCanvas = ref(null)

onMounted(() => {
  if (props.data && props.data.length > 0) {
    const ctx = assetRatioCanvas.value.getContext('2d')
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
        responsive: true,
        maintainAspectRatio: true
      }
    })
  } else {
    console.warn('No asset data available')
  }
})
</script>

<style scoped>
.asset-ratio-chart {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}

.chart-container {
  width: 100%;
  max-width: 400px;
  height: 400px;
  position: relative;
}
</style>
