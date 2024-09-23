<template>
  <div>
    <h1>정책 목록</h1>
    <div class="search-bar">
      <!-- SearchBar 컴포넌트 사용 -->
      <SearchBar v-model="keyword" @search="searchPolicies" />
      <!-- <button @click="viewAllPolicies" class="btn btn-secondary">전체보기</button> -->
    </div>
    <ul>
      <PolicyItem v-for="policy in policies" :key="policy.bizId" :policy="policy" />
    </ul>

    <!-- Pagination 컴포넌트 사용 -->
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
  </div>
</template>

<script>
import axios from 'axios'
import PolicyItem from '@/components/PolicyPage/PolicyItem.vue'
import Pagination from '@/components/common/Pagination.vue'
import SearchBar from '@/components/common/SearchBar.vue'

export default {
  components: {
    PolicyItem,
    Pagination,
    SearchBar
  },
  data() {
    return {
      policies: [],
      currentPage: 1,
      totalPages: 0,
      keyword: '',
      pageSize: 10
    }
  },
  methods: {
    async fetchPolicies() {
      try {
        const response = await axios.get('/api/policies', {
          params: {
            page: this.currentPage,
            keyword: this.keyword
          }
        })

        this.policies = response.data.policies
        this.totalPages = response.data.totalPages
        this.currentPage = response.data.currentPage
      } catch (error) {
        console.error('정책을 가져오는 데 실패했습니다:', error)
      }
    },
    async searchPolicies(searchTerm) {
      this.keyword = searchTerm // 검색어 설정
      this.currentPage = 1 // 첫 페이지로 설정
      this.fetchPolicies() // 정책 데이터 가져오기
    },
    changePage(page) {
      this.currentPage = page // 현재 페이지 업데이트
      this.fetchPolicies() // 새로운 페이지의 정책 데이터를 가져옴
    }
    // viewAllPolicies() {
    //   this.keyword = '' // 검색어 초기화
    //   this.currentPage = 1 // 첫 페이지로 설정
    //   this.fetchPolicies() // 전체 정책 데이터 가져오기
    // }
  },
  mounted() {
    this.fetchPolicies() // 컴포넌트가 마운트될 때 정책 데이터 가져오기
  }
}
</script>

<style scoped>
/* 스타일링 추가 */
</style>
