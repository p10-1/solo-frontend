<template>
  <div class="asset-type-buttons">
    <button
      v-for="type in assetTypes"
      :key="type.value"
      @click="selectType(type.value)"
      :class="{ active: type.value === props.selectedType }"
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
  { name: '현금', value: 'cash' },
  { name: '예적금', value: 'deposit' },
  { name: '증권', value: 'stock' },
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
}
.asset-type-buttons button {
  min-width: 100px;
  text-align: center;
  padding: 0.8rem 1rem;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  color: #222;
  letter-spacing: -1px;
  transition: all 0.6s;
  cursor: pointer;
}
.asset-type-buttons button.active {
  background-color: #6846f5;
  color: #fff;
}
</style>
