<template>
  <div class="policy-search">
    <input v-model="searchTerm" placeholder="search" @keyup.enter="search" />
    <button @click="clearSearch">×</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchTerm = ref('')
const emit = defineEmits(['search'])

const search = () => {
  emit('search', searchTerm.value)
}

const clearSearch = () => {
  searchTerm.value = ''
  emit('search', '')
}
</script>
