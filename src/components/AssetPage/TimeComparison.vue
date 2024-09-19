<template>
  <div class="time-comparison">
    <h3>시간에 따른 비교</h3>
    <canvas ref="timeComparisonCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

// Chart.js 등록
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({
  comparisonData: {
    type: Object,
    required: true
  }
})

const timeComparisonCanvas = ref(null)
let chartInstance = null

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = timeComparisonCanvas.value.getContext('2d')
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['평균', '나'],
      datasets: [
        {
          label: '시간 비교',
          data: [props.comparisonData.average, props.comparisonData.user],
          backgroundColor: ['#4caf50', '#FF6384']
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true
    }
  })
}

watch(() => props.comparisonData, renderChart)

onMounted(() => {
  renderChart()
})
</script>

<style scoped>
.time-comparison {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}

canvas {
  max-width: 400px;
  height: 400px;
}
</style>
