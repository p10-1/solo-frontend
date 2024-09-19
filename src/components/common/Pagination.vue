<template>
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <li
        v-for="page in pageRange"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <a class="page-link" href="#" @click.prevent="$emit('page-change', page)">{{ page }}</a>
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

const pageRange = computed(() => {
  const range = []
  for (let i = 1; i <= Math.max(1, props.totalPages); i++) {
    range.push(i)
  }
  return range
})
</script>
