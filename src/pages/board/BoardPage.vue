<template>
  <div class="community-page">
    <h1 class="mb-4">커뮤니티</h1>

    <!-- 검색 바 -->
    <SearchBar @search="handleSearch" v-if="!showWriteForm && !showPostDetail" />

    <!-- 게시글 리스트 -->
    <PostList
      :posts="posts"
      @post-click="openPostDetail"
      v-if="!showWriteForm && !showPostDetail"
    />

    <!-- 페이지네이션 & 글 작성 버튼 -->
    <div
      class="d-flex justify-content-between align-items-center mt-4"
      v-if="!showWriteForm && !showPostDetail"
    >
      <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />
      <WriteButton @write-click="showWriteForm = true" />
    </div>

    <!-- 글 작성 폼 -->
    <WriteForm v-if="showWriteForm" @submit="handleSubmit" @cancel="showWriteForm = false" />

    <!-- 게시글 상세보기 -->
    <PostDetail v-if="showPostDetail" :post="selectedPost" @back="showPostDetail = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import SearchBar from '@/components/common/SearchBar.vue'
import PostList from '@/components/CommunityPage/PostList.vue'
import Pagination from '@/components/common/Pagination.vue'
import WriteButton from '@/components/CommunityPage/WriteButton.vue'
import WriteForm from '@/components/CommunityPage/WriteForm.vue'
import PostDetail from '@/components/CommunityPage/PostDetail.vue'

const currentPage = ref(1)
const totalPages = ref(1)
const posts = ref([])
const showWriteForm = ref(false)
const showPostDetail = ref(false)
const selectedPost = ref(null)
const searchTerm = ref('')

// 게시물 가져오기 함수
const fetchPosts = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/community?_page=${currentPage.value}&_limit=10`
    )
    posts.value = response.data
    const totalPosts = parseInt(response.headers['x-total-count'])
    totalPages.value = isNaN(totalPosts) ? 1 : Math.ceil(totalPosts / 10) // 페이지 수 계산
  } catch (error) {
    console.error('Error fetching posts:', error)
    totalPages.value = 1 // 오류 시 페이지 수 기본값 설정
  }
}

// 컴포넌트가 마운트될 때 게시물 가져오기
onMounted(() => {
  fetchPosts()
})

// 검색 처리 함수
const handleSearch = async (term) => {
  searchTerm.value = term
  try {
    const response = await axios.get(`http://localhost:3000/community?q=${searchTerm.value}`)
    posts.value = response.data
    totalPages.value = 1 // 검색 결과에서는 페이지네이션 적용 X
  } catch (error) {
    console.error('Error searching posts:', error)
  }
}

// 페이지 변경 처리 함수
const changePage = async (page) => {
  currentPage.value = page
  await fetchPosts() // 페이지 변경 시 게시물 다시 로드
}

// 글 작성 처리 함수
const handleSubmit = (postData) => {
  posts.value.unshift({
    id: posts.value.length + 1,
    ...postData,
    date: 'now',
    views: 0,
    comments: 0,
    likes: 0
  })
  showWriteForm.value = false
}

// 게시물 상세보기 열기
const openPostDetail = (post) => {
  selectedPost.value = post
  showPostDetail.value = true
}
</script>

<style scoped>
.community-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
