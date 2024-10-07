<template>
  <div class="asset-type-buttons">
    <!-- 자산 타입 선택 버튼들 -->
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
import { ref } from 'vue'

const props = defineProps({
  selectedType: String // 선택된 자산 타입
})

const emit = defineEmits(['select-type']) // 부모에게 타입 선택 이벤트를 전달

// 자산 타입 리스트
const assetTypes = ref([
  { name: '현금자산', value: 'cash' },
  { name: '예적금', value: 'deposit' },
  { name: '주식', value: 'stock' },
  { name: '보험', value: 'insurance' }
])

// 타입 선택 함수
const selectType = (type) => {
  emit('select-type', type) // 부모 컴포넌트에 선택된 타입 전달
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
