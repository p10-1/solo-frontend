<template>
  <div class="asset-type-buttons">
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
const props = defineProps({
  selectedType: String
})

const emit = defineEmits(['select-type'])

const assetTypes = [
  { name: '현금자산', value: 'cash' },
  { name: '예적금', value: 'deposit' },
  { name: '주식', value: 'stock' },
  { name: '부동산', value: 'property' }
]

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
