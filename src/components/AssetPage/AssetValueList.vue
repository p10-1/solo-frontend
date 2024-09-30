<template>
  <div class="asset-value-list">
    <h3>자산 비율</h3>
    <ul class="asset-types">
      <li v-for="asset in assetDetails" :key="asset.name" class="asset-type">
        <strong>{{ assetNames[asset.name] }} : </strong>
        <span class="asset-amount">{{ formatNumber(asset.total) }}원</span>
        <span class="asset-percentage">({{ calculatePercentage(asset.total) }}%)</span>
        <!-- <ul class="asset-details">
          <li v-for="(detail, index) in asset.details" :key="index">
            {{ detail.bank }} - {{ detail.account }}: {{ formatNumber(detail.value) }}원
          </li>
        </ul> -->
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  assetDetails: {
    type: Object,
    required: true
  }
})

const assetNames = {
  cash: '현금자산',
  deposit: '예적금',
  stock: '주식',
  property: '부동산'
}

const totalAsset = computed(() => {
  return Object.values(props.assetDetails).reduce((sum, asset) => sum + asset.total, 0)
})

const formatNumber = (num) => {
  return num.toLocaleString()
}

const calculatePercentage = (value) => {
  if (totalAsset.value === 0) return '0.00'
  return ((value / totalAsset.value) * 100).toFixed(2)
}
</script>

<style scoped>
.asset-value-list {
  margin-top: 20px;
}

.asset-types {
  list-style-type: none;
  padding-left: 0;
}

.asset-type {
  margin-bottom: 15px;
  font-size: 1.1em;
}

.asset-details {
  list-style-type: none;
  padding-left: 20px;
  margin-top: 5px;
  font-size: 0.9em;
}

.asset-details li {
  margin-bottom: 3px;
}
</style>
