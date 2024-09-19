<template>
  <div class="asset-comparison">
    <h3>자산 비교</h3>
    <canvas ref="assetComparisonCanvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
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

const assetComparisonCanvas = ref(null)

onMounted(() => {
  if (props.comparisonData && props.comparisonData.average && props.comparisonData.user) {
    const ctx = assetComparisonCanvas.value.getContext('2d')
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['평균', '나'],
        datasets: [
          {
            label: '자산 비교',
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
  } else {
    console.warn('No comparison data available')
  }
})
</script>

<style scoped>
.asset-comparison {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}

.asset-comparison canvas {
  max-width: 400px;
  height: 400px;
}
</style>
