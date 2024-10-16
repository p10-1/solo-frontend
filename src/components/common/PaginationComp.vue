<template>
  <nav aria-label="navigation">
    <ul class="pagination margin-top-2rem justify-content-center">
      <li class="" :class="{ disabled: currentPage === 1 }">
        <a class="" href="#" @click.prevent="changePage(currentPage - 1)"
          ><i class="fa-solid fa-chevron-left"></i
        ></a>
      </li>
      <li class="" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
        <a class="" href="#" @click.prevent="changePage(page)">{{ page }}</a>
      </li>
      <li class="" :class="{ disabled: currentPage === totalPages }">
        <a class="" href="#" @click.prevent="changePage(currentPage + 1)"
          ><i class="fa-solid fa-chevron-right"></i
        ></a>
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
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination li a.page-front {
  width: 70px;
  background: none;
}

.pagination li a.page-next {
  width: 70px;
}

.pagination li a {
  display: inline-block;
  width: 45px;
  height: 45px;
  line-height: 45px;
  border: none;
  text-align: center;
  font-size: 17px;
  font-weight: 500;
  color: #cfc6fd !important;
}

.pagination li:hover {
  background: none;
}
.pagination li a:hover {
  font-weight: 600;
  border-radius: 50%;
  color: #6846f5 !important;
  text-decoration: underline;
}

.pagination li.active a {
  background-color: #6846f5;
  font-weight: 700;
  line-height: 45px;
  color: #fff !important;
  border-radius: 50%;
}
</style>
