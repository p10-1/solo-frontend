<template>
  <div class="asset-comparison">
    <h3>{{ assetTypeTitle }} 비교</h3>
    <div class="comparison-chart">
      <div class="bar average" :style="{ width: `${averagePercentage}%` }">
        <span>평균: {{ averageAmount.toLocaleString() }}원</span>
      </div>
      <div class="bar user" :style="{ width: `${userPercentage}%` }">
        <span>나: {{ userAmount.toLocaleString() }}원</span>
      </div>
    </div>
    <div class="comparison-labels">
      <div>평균: {{ averagePercentage }}%</div>
      <div>나: {{ userPercentage }}%</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  assetType: {
    type: String,
    required: true
  },
  comparisonData: {
    type: Object,
    required: true
  }
})

const assetTypeTitle = computed(() => {
  const titles = {
    cash: '현금자산',
    deposit: '예적금',
    stock: '주식',
    property: '부동산'
  }
  return titles[props.assetType] || '자산'
})

const currentComparisonData = computed(
  () => props.comparisonData[props.assetType] || { average: 0, user: 0 }
)

const userAmount = computed(() => currentComparisonData.value.user)
const averageAmount = computed(() => currentComparisonData.value.average)

const total = computed(() => userAmount.value + averageAmount.value)

const userPercentage = computed(() => ((userAmount.value / total.value) * 100).toFixed(2))
const averagePercentage = computed(() => ((averageAmount.value / total.value) * 100).toFixed(2))
</script>

<style scoped>
.asset-comparison {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #e8e8e8;
  border-radius: 5px;
}

.comparison-chart {
  margin-top: 10px;
}

.bar {
  height: 30px;
  margin-bottom: 5px;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 3px;
}

.average {
  background-color: #36a2eb;
}

.user {
  background-color: #ff6384;
}

.comparison-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
