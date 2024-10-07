<!-- <template>
  <div class="asset-type-distribution">
    <h2 class="asset-type-distribution__title">자산 유형별 분포</h2>
    <div class="asset-type-distribution__content">
      <div class="asset-type-distribution__chart">
        <ChartComponent type="doughnut" :data="chartData" :options="chartOptions" />
      </div>
      <div class="asset-type-distribution__legend">
        <div v-for="assetType in assetTypes" :key="assetType.type" class="asset-type">
          <span class="asset-color" :style="{ backgroundColor: assetType.color }"></span>
          <span class="asset-name">{{ assetType.name }}</span>
          <span class="asset-percentage">{{ calculatePercentage(assetType.type) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import ChartComponent from '@/components/common/ChartComponent.vue'


export default {
  components: {
    ChartComponent
  },
  setup() {
    const assetTypes = ref([
      { type: 'risk', name: '위험 추구형', color: '#FF6384' },
      { type: 'balanced', name: '자산 분산형', color: '#36A2EB' },
      { type: 'safe', name: '안정 추구형', color: '#FFCE56' },
      { type: 'loan', name: '대출 우선형', color: '#4BC0C0' }
    ])

    // 이 부분은 실제 데이터를 가져오는 로직으로 대체되어야 합니다.
    const assetTypeData = ref({
      risk: 25,
      balanced: 30,
      safe: 35,
      loan: 10
    })

    const chartData = computed(() => ({
      labels: assetTypes.value.map((type) => type.name),
      datasets: [
        {
          data: assetTypes.value.map((type) => assetTypeData.value[type.type]),
          backgroundColor: assetTypes.value.map((type) => type.color)
        }
      ]
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    }

    const calculatePercentage = (type) => {
      const total = Object.values(assetTypeData.value).reduce((sum, value) => sum + value, 0)
      return ((assetTypeData.value[type] / total) * 100).toFixed(2)
    }

    return {
      assetTypes,
      chartData,
      chartOptions,
      calculatePercentage
    }
  }
}
</script>

<style scoped>
.asset-type-distribution {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.asset-type-distribution__title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 15px;
}

.asset-type-distribution__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.asset-type-distribution__chart {
  width: 50%;
  height: 300px;
}

.asset-type-distribution__legend {
  width: 45%;
}

.asset-type {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.asset-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.asset-name {
  flex: 1;
}

.asset-percentage {
  font-weight: bold;
}
</style> -->
