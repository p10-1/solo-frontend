<template>
  <div class="list-item">
    <h3>자산 상세 정보</h3>
    <ul>
      <li v-for="(value, key) in formattedAssetData" :key="key">{{ key }}: {{ value }}</li>
    </ul>
  </div>
</template>

<script setup>
//src/components/AssetPage/ListItem.vue

const props = defineProps({
  assetData: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)
}

const formattedAssetData = computed(() => ({
  'User ID': props.assetData.userId || 'N/A',
  현금자산: formatCurrency(props.assetData.cash || 0),
  예금: formatCurrency(props.assetData.deposit || 0),
  주식: formatCurrency(props.assetData.stock || 0),
  부동산: formatCurrency(props.assetData.property || 0),
  '소비 유형': props.assetData.consume || 'N/A',
  '대출 금액': formatCurrency(props.assetData.loanAmount || 0),
  '대출 목적': props.assetData.loanPurpose || 'N/A',
  '대출 기간': `${props.assetData.period || 0}개월`,
  생성일: formatDate(props.assetData.createDate),
  수정일: formatDate(props.assetData.updateDate)
}))
</script>

<style scoped>
.list-item {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

h3 {
  margin-bottom: 15px;
  color: #333;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  color: #555;
}
</style>
