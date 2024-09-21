<template>
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <li
        v-for="page in pageRange"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['page-change'])

const pageRange = computed(() => {
  const range = []
  for (let i = 1; i <= Math.max(1, props.totalPages); i++) {
    range.push(i)
  }
  return range
})

const changePage = (page) => {
  if (page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  list-style: none;
  padding: 0;
}

.page-item {
  margin: 0 5px;
}

.page-item a {
  padding: 8px 12px;
  text-decoration: none;
  color: #007bff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.page-item.active a {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
</style>
