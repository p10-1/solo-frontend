<template>
  <div class="search-bar mb-4">
    <input
      v-model="searchTerm"
      :placeholder="placeholder"
      class="form-control"
      @keyup.enter="emitSearch"
    />
    <button @click="emitSearch" class="btn btn-primary ml-2">{{ buttonText }}</button>
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
.search-bar {
  display: flex;
}

.search-bar input {
  flex-grow: 1;
  margin-right: 10px;
}
</style>
