<template>
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-front page-link" href="#" @click.prevent="changePage(currentPage - 1)"
          >이전</a
        >
      </li>
      <li
        class="page-item"
        v-for="page in totalPages"
        :key="page"
        :class="{ active: currentPage === page }"
      >
        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-next page-link" href="#" @click.prevent="changePage(currentPage + 1)">
          다음
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const props = defineProps({
  currentPage: Number,
  totalPages: Number
})

const emit = defineEmits(['page-change'])

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}
</script>

<style scope>
.pagination {
  margin-top: 2.5rem;
  text-align: center;
}
.pagination li {
  display: inline-block;
}

.pagination li a.page-front {
  width: 70px;
}

.pagination li a.page-next {
  width: 70px;
}

.pagination li a {
  display: inline-block;
  width: 45px;
  height: 45px;
  line-height: 44px;
  border: 1px solid #22222220;
  text-align: center;
  font-size: 17px;
  font-weight: 400;
  margin: 0 4px;
}

.pagination li a:hover {
  background-color: #f8d648;
  border-color: #f8d648;
  font-weight: 700;
}
</style>
