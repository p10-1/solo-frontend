<template>
  <div class="search-bar mb-4">
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
.search-bar {
  text-align: center;
}

input[type='text'].form-control {
  width: 100%;
  height: 38px;
  line-height: 38px;
  padding: 5px 12px;
  border: 1px solid #ddd;
  vertical-align: top;
  margin: 0 -4px 0 0;
  font-size: 16px;
  font-weight: 500;
}

/* .search-bar {
  display: flex;
}

.search-bar input {
  flex-grow: 1;
  margin-right: 10px;
} */
</style>
