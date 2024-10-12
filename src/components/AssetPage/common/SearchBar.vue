<template>
  <div class="search-bar margin-top-1rem margin-bottom-1rem">
    <div class="decoration">
      <i class="fa-solid fa-magnifying-glass"></i>
    </div>
    <input
      v-model="searchTerm"
      :placeholder="props.placeholder"
      class="form-control"
      @keyup.enter="emitSearch"
    />
    <button @click="emitSearch" class="search-button btn btn-primary ml-2">
      {{ props.buttonText }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: '검색어를 입력하세요'
  },
  buttonText: {
    type: String,
    default: '검색'
  }
})

const searchTerm = ref('')
const emit = defineEmits(['search'])

const emitSearch = () => {
  emit('search', searchTerm.value)
}
</script>

<style scoped>
input.form-control {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding: 5px 12px;
  padding-left: 38px;
  border: 2px solid #f1eeff;
  background-color: #f3f3ff;
  border-radius: 12px;
  accent-color: #6846f5;
  vertical-align: top;
  font-size: 16px;
  font-weight: 500;
}
</style>
