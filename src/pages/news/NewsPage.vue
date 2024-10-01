<template>
  <div>
    <h1>뉴스목록 페이지</h1>
    <NewsList />
  </div>
</template>

<script setup>
import NewsList from '@/components/NewsPage/NewsList.vue';
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
import Pagination from '@/components/common/PaginationComp.vue'

const currentPage = ref(1)
const totalPages = ref(5)

// const newsItems = ref([
//   {
//     id: 10,
//     title: '주식시장 호황, 투자자들의 관심 급증',
//     date: '2024.03.15',
//     content:
//       '최근 주식시장이 호황을 맞이하면서 투자자들의 관심이 급증하고 있습니다. 특히 기술주와 친환경 관련 주식들의 상승세가 두드러지고 있습니다.'
//   },
//   {
//     id: 9,
//     title: '가상화폐 시장 동향: 비트코인 가격 상승세',
//     date: '2024.03.14',
//     content:
//       '비트코인을 비롯한 주요 가상화폐의 가격이 상승세를 보이고 있습니다. 전문가들은 기관 투자자들의 참여 증가와 글로벌 경제 불확실성을 주요 원인으로 분석하고 있습니다.'
//   }
//   // ... 더 많은 뉴스 항목
// ])

const handleSearch = (searchTerm) => {
  console.log('Searching for:', searchTerm)
  // 검색 로직 구현
}

const changePage = (page) => {
  currentPage.value = page
  // 페이지 변경 시 데이터 fetch 로직 구현
}
</script>

<style scoped>
.news-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style> -->
