<template>
  <h2 class="title">
    "<span class="text-accent">{{ authStore.userInfo.userName }}</span
    >" 님을 위한 <span class="text-accent">KB 추천 상품</span>이에요
    <span class="text-accent"><i class="fa-regular fa-face-smile"></i></span>
  </h2>
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
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()

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
