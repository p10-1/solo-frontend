<template>
  <div class="filter-bar margin-top-1rem margin-bottom-1rem">
    <input type="radio" id="deposit" value="예금" v-model="selectedType" />
    <label :class="{ active: selectedType === '예금' }" for="deposit">예금</label>
    <input type="radio" id="saving" value="적금" v-model="selectedType" />
    <label :class="{ active: selectedType === '적금' }" for="saving">적금</label>
    <input type="radio" id="loan" value="대출" v-model="selectedType" />
    <label :class="{ active: selectedType === '대출' }" for="loan">대출</label>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  productType: {
    type: String,
    required: true
  }
})

const emits = defineEmits(['update:productType'])

const selectedType = ref(props.productType)

watch(selectedType, (newType) => {
  emits('update:productType', newType)
})
</script>

<style lang="scss" scoped></style>
