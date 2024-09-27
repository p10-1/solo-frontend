<template>
  <div>
    <h1>정책 목록</h1>
    <div class="search-bar">
      <!-- SearchBar 컴포넌트 사용 -->
      <SearchBar v-model="keyword" @search="searchPolicies" />
      <!-- <button @click="viewAllPolicies" class="btn btn-secondary">전체보기</button> -->
    </div>
    <ul>
      <PolicyItem v-for="policy in list" :key="policy.bizId" :policy="policy" />
    </ul>

    <!-- Pagination 컴포넌트 사용 -->
    <Pagination :currentPage="pageNum" :totalPages="totalPage" @page-change="changePage" />
  </div>
</template>

<script>
import { fetchPolicies } from '@/api/policyApi'
import PolicyItem from '@/components/PolicyPage/PolicyItem.vue'
import Pagination from '@/components/common/PaginationComp.vue'
import SearchBar from '@/components/common/SearchBar.vue'

export default {
  components: {
    PolicyItem,
    Pagination,
    SearchBar
  },
  data() {
    return {
      list: [],
      pageNum: 1,
      totalPage: 0,
      keyword: '',
      amount: 10
    }
  },
  methods: {
    async loadPolicies() {
      console.log('현재 페이지:', this.pageNum, '검색어:', this.keyword)
      const data = await fetchPolicies(this.pageNum, this.keyword)
      console.log('내부에서 호출: ', data)
      this.list = data.list || [] // 정책 데이터 초기화
      this.totalPage = data.totalPage || 0 // 총 페이지 수 초기화
      this.pageNum = data.pageNum || 1 // 현재 페이지 초기화
    },
    async searchPolicies(searchTerm) {
      console.log('검색어: ', searchTerm)
      this.keyword = searchTerm // 검색어 설정
      this.currentPage = 1 // 첫 페이지로 설정
      this.$router.push({
        path: '/policy',
        query: { keyword: this.keyword, page: this.pageNum }
      })
      await this.loadPolicies() // 정책 데이터 가져오기
    },
    async changePage(page) {
      console.log('부모 페이지: ', page)
      this.pageNum = page // 현재 페이지 업데이트
      this.$router.push({
        path: '/policy',
        query: { keyword: this.keyword, page: this.pageNum }
      })
      await this.loadPolicies() // 새로운 페이지의 정책 데이터를 가져옴
    }
  },
  mounted() {
    // 쿼리 파라미터에서 검색어와 페이지 정보를 읽어옴
    const query = this.$route.query
    this.keyword = query.keyword || ''
    this.pageNum = parseInt(query.page) || 1
    this.loadPolicies()
  },
  watch: {
    // 쿼리 파라미터가 변경될 때마다 loadPolicies를 호출
    '$route.query': {
      handler() {
        this.keyword = this.$route.query.keyword || ''
        this.pageNum = parseInt(this.$route.query.page) || 1
        this.loadPolicies()
      },
      immediate: true // 컴포넌트가 마운트될 때도 호출
    }
  }
}
</script>

<style scoped>
/* 스타일링 추가 */
</style>
