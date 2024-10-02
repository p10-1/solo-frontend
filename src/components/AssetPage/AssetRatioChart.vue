<!-- <template>
  <div class="asset-ratio-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

// props 정의: 차트에 표시할 데이터
const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

// 차트 캔버스에 대한 참조
const chartCanvas = ref(null)
// 차트 인스턴스를 저장할 변수
let chart = null

// 차트 생성 함수
const createChart = () => {
  if (!chartCanvas.value || !props.data || props.data.length === 0) return

  const ctx = chartCanvas.value.getContext('2d')
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: props.data.map((item) => item.name),
      datasets: [
        {
          data: props.data.map((item) => item.value),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

// 컴포넌트가 마운트되면 차트 생성
onMounted(createChart)

// data prop이 변경될 때마다 차트 업데이트
watch(
  () => props.data,
  (newData) => {
    if (chart) {
      chart.destroy()
    }
    if (newData && newData.length > 0) {
      createChart()
    }
  },
  { deep: true }
)
</script>

<style scoped>
.asset-ratio-chart {
  width: 100%;
  max-width: 400px;
}

h3 {
  text-align: center;
  margin-bottom: 15px;
}
</style> -->
