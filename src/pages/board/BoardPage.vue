<template>
  <div>
    <h1>게시글 목록 페이지</h1>
    <BoardList />
  </div>
</template>

<script setup>
import BoardList from '@/components/CommunityPage/BoardList.vue'
</script>

<style scoped>
/* 필요에 따라 스타일을 추가하세요 */
</style>

<!-- <template>
  <div class="community-page">
    <h1 class="mb-4">커뮤니티</h1>

    <SearchBar @search="handleSearch" v-if="!showWriteForm && !showPostDetail" />
    <BoardList
      :posts="posts"
      @post-click="openPostDetail"
      v-if="!showWriteForm && !showPostDetail"
    />
    <div
      class="d-flex justify-content-between align-items-center mt-4"
      v-if="!showWriteForm && !showPostDetail"
    >
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @prev-page="prevPage"
        @next-page="nextPage"
      />
      <WriteButton @write-click="showWriteForm = true" />
    </div>

    <WriteForm v-if="showWriteForm" @submit="handleSubmit" @cancel="showWriteForm = false" />
    <BoardDetail v-if="showPostDetail" :post="selectedPost" @back="showPostDetail = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SearchBar from '@/components/common/SearchBar.vue'
import Pagination from '@/components/common/Pagination.vue'
import WriteButton from '@/components/CommunityPage/WriteButton.vue'
import WriteForm from '@/components/CommunityPage/WriteForm.vue'
import BoardDetail from '@/components/CommunityPage/BoardDetail.vue'
import BoardList from '@/components/CommunityPage/BoardList.vue'

const currentPage = ref(1)
const totalPages = ref(10)
const showWriteForm = ref(false)
const showPostDetail = ref(false)
const selectedPost = ref(null)

const posts = ref([
  {
    id: 1,
    title: '인기글 1번의 제목',
    author: 'KB',
    date: '6일전',
    views: 123,
    comments: 12,
    likes: 12,
    content: '인기글 1번의 내용...'
  },
  {
    id: 2,
    title: '인기글 2번의 제목',
    author: '윤재',
    date: '4일전',
    views: 100,
    comments: 8,
    likes: 15,
    content: '인기글 2번의 내용...'
  }
  // ... 기타 게시글
])

const handleSearch = (searchTerm) => {
  console.log('Searching for:', searchTerm)
  // 여기에 검색 로직을 구현하세요
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
  // 페이지 변경 시 데이터를 새로 불러오는 로직을 여기에 추가하세요
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
  // 페이지 변경 시 데이터를 새로 불러오는 로직을 여기에 추가하세요
}

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
</style> -->
