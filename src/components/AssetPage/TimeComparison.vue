<template>
  <div class="time-comparison">
    <h2>시간 비교</h2>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  assetType: {
    type: String,
    required: true
  },
  timeData: {
    type: Object,
    required: true
  }
})

const chartRef = ref(null)
let chartInstance = null

const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  if (!chartRef.value || !props.timeData) return

  const ctx = chartRef.value.getContext('2d')

  const { previousMonth, currentMonth } = props.timeData

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['저번 달', '이번 달'],
      datasets: [
        {
          label: `${props.assetType} 자산 가치`,
          data: [previousMonth, currentMonth],
          backgroundColor: ['#4caf50', '#2196f3']
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

onMounted(createChart)

watch([() => props.assetType, () => props.timeData], createChart, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.time-comparison {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
