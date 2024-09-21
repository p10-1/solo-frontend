<template>
  <div class="board-page">
    <h2 class="text-2xl font-bold mb-4">커뮤니티 게시판</h2>

    <!-- Search Input -->
    <div class="mb-4 flex justify-between items-center">
      <input
        v-model="searchTerm"
        @input="handleSearch"
        placeholder="검색어를 입력하세요"
        class="px-4 py-2 border rounded"
      />
    </div>

    <!-- Filter Buttons -->
    <div class="mb-4 flex justify-start items-center space-x-2">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="setActiveFilter(filter.value)"
        :class="[
          'px-4 py-2 border rounded',
          activeFilter === filter.value
            ? 'bg-pink-100 border-pink-600 text-pink-600'
            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
        ]"
      >
        {{ filter.text }}
      </button>
    </div>

    <!-- Table of Posts -->
    <table class="w-full border-collapse border">
      <thead>
        <tr>
          <th class="border p-2">번호</th>
          <th class="border p-2">제목</th>
          <th class="border p-2">작성자</th>
          <th class="border p-2">작성일</th>
          <th class="border p-2">조회수</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(post, index) in filteredPosts"
          :key="post.id"
          @click="goToPostDetail(post.id)"
          class="cursor-pointer hover:bg-gray-100"
        >
          <td class="border p-2">{{ (currentPage - 1) * postsPerPage + index + 1 }}</td>
          <td class="border p-2">{{ post.title }}</td>
          <td class="border p-2">{{ post.author }}</td>
          <td class="border p-2">{{ formatDate(post.date) }}</td>
          <td class="border p-2">{{ post.views }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Loading and Error States -->
    <div v-if="isLoading" class="text-center my-4">로딩 중...</div>
    <div v-if="error" class="text-red-500 text-center my-4">{{ error }}</div>

    <!-- Pagination Component -->
    <Pagination
      :currentPage="currentPage"
      :totalPages="postStore.totalPages"
      @page-change="changePage"
    />

    <!-- Write Button -->
    <div class="mt-4 flex justify-end">
      <button @click="goToWritePage" class="px-4 py-2 bg-blue-500 text-white rounded">
        글 작성
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/PostStore'
import Pagination from '@/components/common/Pagination.vue'

const router = useRouter()
const postStore = usePostStore()

const currentPage = ref(1)
const postsPerPage = 10 // Number of posts per page
const searchTerm = ref('')
const activeFilter = ref('views') // Default filter is '조회순'
const isLoading = ref(false)
const error = ref(null)

// Define the filter options
const filters = [
  { text: '조회순', value: 'views' },
  { text: '최신순', value: 'latest' },
  { text: '오래된 순', value: 'oldest' }
]

const filteredPosts = computed(() => {
  let posts = postStore.posts

  // Search term filtering
  if (searchTerm.value) {
    posts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  // Sorting based on active filter
  if (activeFilter.value === 'views') {
    return posts.sort((a, b) => b.views - a.views) // Sort by views (조회순)
  } else if (activeFilter.value === 'latest') {
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by latest date (최신순)
  } else if (activeFilter.value === 'oldest') {
    return posts.sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by oldest date (오래된 순)
  }
  return posts
})

onMounted(() => {
  fetchPosts()
})

watch([currentPage, activeFilter], fetchPosts)

async function fetchPosts() {
  isLoading.value = true
  error.value = null
  try {
    await postStore.fetchPosts(currentPage.value, postsPerPage) // Pass limit
  } catch (err) {
    error.value = '게시글을 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

function handleSearch() {
  currentPage.value = 1
  fetchPosts()
}

function setActiveFilter(filter) {
  activeFilter.value = filter
  currentPage.value = 1
  fetchPosts()
}

function changePage(page) {
  currentPage.value = page
  fetchPosts() // Re-fetch posts when page changes
}

function goToPostDetail(postId) {
  router.push({ name: 'PostDetailPage', params: { id: postId } })
}

function goToWritePage() {
  router.push({ name: 'WritePage' })
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
/* Table Styles */
.table th,
.table td {
  border: 1px solid #d3d3d3;
  text-align: center;
  padding: 10px;
}

.table tbody tr:hover {
  background-color: #f9f9f9;
}

.table thead {
  background-color: #f1f1f1;
  font-weight: bold;
}
</style>
