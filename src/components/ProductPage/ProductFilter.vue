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
import { ref, watch, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'

const productStore = useProductStore()
const props = defineProps({
  productType: {
    type: String,
    required: true
  }
})

const emits = defineEmits(['update:productType'])
const selectedType = ref(props.productType)

// Watch for changes on selectedType to emit updates
watch(selectedType, (newType) => {
  emits('update:productType', newType)
})

// Watch for changes on props.productType to sync with local state
watch(
  () => props.productType,
  (newType) => {
    if (newType !== selectedType.value) {
      selectedType.value = newType
      productStore.setProductType(newType)
    }
  }
)

// On mounted, set the initial selected type from the props
onMounted(() => {
  selectedType.value = props.productType
})
</script>

<style lang="scss" scoped></style>
