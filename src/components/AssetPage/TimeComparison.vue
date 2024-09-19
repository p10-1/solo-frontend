<template>
  <div class="time-comparison">
    <h3>지난달과 비교</h3>
    <div>
      <span>평균</span>
      <span>나</span>
    </div>
    <canvas id="timeComparison"></canvas>
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
  const ctx = document.getElementById('timeComparison').getContext('2d')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['평균', '나'], // x축 레이블
      datasets: [
        {
          label: '지난달과 비교 비교', // 여기서 label을 추가
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
.time-comparison {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}
</style>
