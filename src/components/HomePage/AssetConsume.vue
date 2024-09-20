<template>
  <div class="asset-consume">
    <h3>비용 없는 소비를 사용하는 다른 고객들은 주로 여기에 소비해요!</h3>
    <canvas id="consumeChart"></canvas>
  </div>
</template>

<script>
import { Bar } from 'chart.js'

export default {
  extends: Bar,
  mounted() {
    this.renderChart(
      {
        labels: ['식비', '여가비', '차비', '자주'],
        datasets: [
          {
            label: '소비 비율',
            backgroundColor: ['#3366FF', '#FFCC33', '#FF6633', '#33CCCC'],
            data: [55, 30, 10, 5]
          }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    )
  }
}
</script>

<style scoped>
.asset-consume {
  width: 100%;
  max-width: 600px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.asset-consume h3 {
  margin-bottom: 20px;
}
</style>
