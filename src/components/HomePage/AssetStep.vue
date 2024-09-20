<template>
  <div class="asset-risk-chart">
    <h2>"대상 솔루션"의 자산 관리 현황</h2>
    <canvas id="riskChart"></canvas>
    <div class="risk-details">
      <div v-for="(risk, index) in risks" :key="index" class="risk-item">
        <span :style="{ color: risk.color }">{{ risk.label }}: {{ risk.percentage }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Doughnut } from 'chart.js'

export default {
  extends: Doughnut,
  data() {
    return {
      risks: [
        { label: '고혈압', percentage: 46.4, color: '#FF6384' },
        { label: '고지혈증', percentage: 46.4, color: '#36A2EB' },
        { label: '당뇨병', percentage: 28.4, color: '#FFCE56' },
        { label: '심혈관질환', percentage: 28.4, color: '#4BC0C0' },
        { label: '뇌혈관질환', percentage: 28.4, color: '#9966FF' }
      ]
    }
  },
  mounted() {
    this.renderChart(
      {
        labels: this.risks.map((risk) => risk.label),
        datasets: [
          {
            data: this.risks.map((risk) => risk.percentage),
            backgroundColor: this.risks.map((risk) => risk.color),
            hoverBackgroundColor: this.risks.map((risk) => risk.color)
          }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    )
  }
}
</script>

<style scoped>
.asset-risk-chart {
  width: 80%;
  margin: auto;
}

.risk-details {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.risk-item {
  font-size: 16px;
  font-weight: bold;
}
</style>
