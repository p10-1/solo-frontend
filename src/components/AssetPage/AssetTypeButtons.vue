<template>
  <div class="asset-type-buttons">
    <!-- 자산 타입 선택 버튼들 -->
    <!-- v-for 디렉티브를 사용하여 assetTypes 배열을 순회하며 버튼을 생성 -->
    <!-- 각 버튼은 자산 타입을 나타내며 클릭 시 selectType 메소드를 호출하여 선택된 타입을 변경 -->
    <button
      v-for="type in assetTypes"
      :key="type.value"
      @click="selectType(type.value)"
      :class="{ active: type.value === selectedType }"
    >
      <!-- 선택된 자산 타입이면 'active' 클래스를 추가 -->
      <!-- 버튼 클릭 시 해당 타입을 선택하는 메소드 호출 -->
      <!-- 각 버튼에 고유 key 값으로 자산 타입의 value 속성을 사용 -->
      <!-- 버튼 내부에 자산 타입의 이름을 표시 -->
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
}
.asset-type-buttons button {
  min-width: 100px;
  text-align: center;
  padding: 0.8rem 1rem;
  border-radius: 25px;
  /* background-color: #cfc6fd; */
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
