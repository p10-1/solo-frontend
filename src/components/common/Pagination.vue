<template>
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <!-- 이전 페이지 버튼 -->
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">이전</a>
      </li>

      <!-- 페이지 번호 버튼 -->
      <li
        class="page-item"
        v-for="page in totalPages"
        :key="page"
        :class="{ active: currentPage === page }"
      >
        <a class="page-link" href="#" @click.prevent="changePage(page)">
          {{ page }}
        </a>
      </li>

      <!-- 다음 페이지 버튼 -->
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">다음</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1 // totalPages 기본값 설정
  }
})

const emit = defineEmits(['page-change'])

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}
</script>

<style scoped>
.page-item.disabled .page-link {
  pointer-events: none;
  color: #6c757d;
}

.page-item.active .page-link {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
}
</style>
