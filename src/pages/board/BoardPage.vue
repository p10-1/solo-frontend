<template>
  <div>
    <h1>게시글 목록</h1>
    <div class="search-bar">
      <SearchBar v-model="keyword" @search="searchPosts" />
    </div>
    <ul>
      <PostItem
        v-for="post in posts"
        :key="post.boardNo"
        :post="post"
        @click="openPostDetail(post)"
      />
    </ul>

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
  </div>
</template>

<script>
import axios from 'axios'
import PostItem from '@/components/BoardPage/PostItem.vue'
import Pagination from '@/components/common/Pagination.vue'
import SearchBar from '@/components/common/SearchBar.vue'

export default {
  components: {
    PostItem,
    Pagination,
    SearchBar
  },
  data() {
    return {
      posts: [],
      currentPage: 1,
      totalPages: 0,
      keyword: '',
      pageSize: 10
    }
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axios.get('/api/board', {
          params: {
            page: this.currentPage,
            keyword: this.keyword,
            pageSize: this.pageSize
          },
          withCredentials: true
        })

        this.posts = response.data.posts
        this.totalPages = response.data.totalPages
        this.currentPage = response.data.currentPage
      } catch (error) {
        console.error('게시글을 가져오는 데 실패했습니다:', error)
      }
    },
    async searchPosts(searchTerm) {
      this.keyword = searchTerm // 검색어 설정
      this.currentPage = 1 // 첫 페이지로 설정
      this.fetchPosts() // 게시글 데이터 가져오기
    },
    changePage(page) {
      this.currentPage = page // 현재 페이지 업데이트
      this.fetchPosts() // 새로운 페이지의 게시글 데이터를 가져옴
    },
    openPostDetail(post) {
      // 게시글 상세 페이지로 이동하는 로직
      this.$router.push({ name: 'PostDetail', params: { id: post.boardNo } })
    }
  },
  mounted() {
    this.fetchPosts() // 컴포넌트가 마운트될 때 게시글 데이터 가져오기
  }
}
</script>

<style scoped>
/* 스타일링 추가 */
.search-bar {
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>
