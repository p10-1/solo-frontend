<template>
  <div class="list-item">
    <!-- 자산 상세 정보를 나타내는 제목 -->
    <h3>자산 상세 정보</h3>

    <!-- 자산 데이터를 표시하는 리스트 -->
    <ul>
      <!-- formattedAssetData 객체를 순회하며 각 자산의 key와 value를 리스트 항목으로 표시 -->
      <li v-for="(value, key) in formattedAssetData" :key="key">{{ key }}: {{ value }}</li>
    </ul>
  </div>
</template>

<script setup>
//src/components/AssetPage/ListItem.vue
import { computed } from 'vue'
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
  보험: formatCurrency(props.assetData.insurance || 0),
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
  /* 리스트 아이템에 연한 회색 배경색을 적용하고, 20px 패딩과 둥근 모서리 처리, 상단에 20px 간격 추가 */
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

h3 {
  /* 제목(h3)에 아래쪽 15px 간격을 추가하고, 색상을 진한 회색(#333)으로 설정 */
  margin-bottom: 15px;
  color: #333;
}

ul {
  /* 리스트 스타일을 제거하고, 내부 패딩을 0으로 설정하여 기본적인 리스트 외관 제거 */
  list-style-type: none;
  padding: 0;
}

li {
  /* 각 리스트 항목에 아래쪽에 10px 간격을 추가하고, 텍스트 색상을 중간 회색(#555)으로 설정 */
  margin-bottom: 10px;
  color: #555;
}
</style>
