<template>
  <div class="chart-container" :style="{ height: height }">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['bar', 'line', 'doughnut'].includes(value)
  },
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  },
  height: {
    type: String,
    default: '400px'
  }
})

const chartRef = ref(null)
let chartInstance = null

const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) {
    console.error('Failed to get context for canvas')
    return
  }

  console.log('Creating new chart with data:', props.data)

  chartInstance = new Chart(ctx, {
    type: props.type,
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      ...props.options
    }
  })
}

onMounted(createChart)

watch([() => props.type, () => props.data, () => props.options], createChart, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
}
</style>
