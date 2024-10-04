<template>
  <div>
    <h2 class="title">뉴스 목록</h2>
    <NewsList />
  </div>
</template>

<script setup>
import NewsList from '@/components/NewsPage/NewsList.vue'
</script>

<!-- <template>
  <div>
    <h1 class="mb-4">금융 뉴스 페이지</h1>

    <SearchBar @search="handleSearch" placeholder="뉴스 검색..." />

    <NewsList :news-items="newsItems" />

    <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SearchBar from '@/components/common/SearchBar.vue'
import NewsList from '@/components/NewsPage/NewsList.vue'
</script>  -->
