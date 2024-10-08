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
  /* 자산 타입 버튼을 가로로 나열하고 중앙에 정렬, 상단에 20px의 여백 추가 */
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

button {
  /* 각 버튼에 좌우 5px 간격, 내부에 10px 20px의 패딩 추가, 테두리와 둥근 모서리 적용 */
  margin: 0 5px;
  padding: 10px 20px;
  border: 1px solid #ddd; /* 테두리를 연한 회색(#ddd)으로 설정 */
  border-radius: 20px; /* 버튼의 모서리를 둥글게 처리 */
  background-color: #f8f9fa; /* 버튼의 배경색을 연한 회색으로 설정 */
  cursor: pointer; /* 커서를 포인터로 변경 */
  transition: all 0.3s ease; /* 버튼 상태가 변할 때 부드러운 전환 효과 적용 */
}

button:hover,
button.active {
  /* 버튼에 마우스를 올리거나 선택된 상태일 때 배경색을 파란색(#007bff)으로 변경하고, 텍스트 색상을 흰색으로 변경 */
  background-color: #007bff;
  color: white;
}
</style>
