<template>
  <div class="asset-type-buttons">
    <!-- 각 자산 유형에 대한 버튼 생성 -->
    <button
      v-for="type in assetTypes"
      :key="type.value"
      @click="selectType(type.value)"
      :class="{ active: type.value === selectedType }"
    >
      {{ type.name }}
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// props 정의: 현재 선택된 자산 유형
const props = defineProps({
  selectedType: String
})

// 이벤트 정의: 자산 유형 선택 시 발생
const emit = defineEmits(['select-type'])

// 자산 유형 목록
const assetTypes = [
  { name: '현금자산', value: 'cash' },
  { name: '예적금', value: 'deposit' },
  { name: '주식', value: 'stock' },
  { name: '부동산', value: 'property' }
]

// 자산 유형 선택 핸들러
const selectType = (type) => {
  emit('select-type', type)
}
</script>

<style scoped>
.asset-type-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

button {
  margin: 0 5px;
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover,
button.active {
  background-color: #007bff;
  color: white;
}
</style>
