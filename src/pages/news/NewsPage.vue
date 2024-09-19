<template>
  <div class="news-page">
    <h1 class="mb-4">금융 뉴스</h1>

    <SearchBar @search="handleSearch" placeholder="뉴스 검색..." />

    <NewsList :news-items="newsItems" />

    <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import SearchBar from '@/components/common/SearchBar.vue'
import NewsList from '@/components/NewsPage/NewsList.vue'
import Pagination from '@/components/common/Pagination.vue'

const currentPage = ref(1)
const totalPages = ref(5)
const searchTerm = ref('')
const newsItems = ref([])

// JSON 서버에서 뉴스 데이터를 가져오는 함수
const fetchNews = async () => {
  try {
    const response = await axios.get('http://localhost:3000/financial_news', {
      params: {
        _page: currentPage.value,
        _limit: 5,
        q: searchTerm.value // 검색어 적용
      }
    })
    newsItems.value = response.data
    totalPages.value = Math.ceil(response.headers['x-total-count'] / 5) // 전체 페이지 수 계산
  } catch (error) {
    console.error('Error fetching news:', error)
  }
}

// 검색 처리 함수
const handleSearch = (term) => {
  searchTerm.value = term
  currentPage.value = 1 // 검색 시 첫 페이지로 이동
  fetchNews() // 새로운 검색어로 데이터 가져오기
}

// 페이지 변경 처리 함수
const changePage = (page) => {
  currentPage.value = page
}

// 컴포넌트가 마운트될 때 데이터를 가져옴
onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
.news-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
