<template>
  <div class="board-page">
    <h2 class="text-2xl font-bold mb-4">커뮤니티 게시판</h2>

    <div class="mb-4 flex justify-between items-center">
      <input
        v-model="searchTerm"
        @input="handleSearch"
        placeholder="검색어를 입력하세요"
        class="px-4 py-2 border rounded"
      />
      <select v-model="activeFilter" @change="handleFilterChange" class="px-4 py-2 border rounded">
        <option value="latest">최신순</option>
        <option value="hot">인기순</option>
      </select>
    </div>

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
          v-for="post in displayedPosts"
          :key="post.id"
          @click="goToPostDetail(post.id)"
          class="cursor-pointer hover:bg-gray-100"
        >
          <td class="border p-2">{{ post.id }}</td>
          <td class="border p-2">{{ post.title }}</td>
          <td class="border p-2">{{ post.author }}</td>
          <td class="border p-2">{{ formatDate(post.date) }}</td>
          <td class="border p-2">{{ post.views }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="isLoading" class="text-center my-4">로딩 중...</div>

    <div v-if="error" class="text-red-500 text-center my-4">{{ error }}</div>

    <div class="mt-4 flex justify-between items-center">
      <div class="flex space-x-2">
        <button
          v-for="page in paginationRange"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-3 py-1 border rounded',
            currentPage === page ? 'bg-blue-500 text-white' : ''
          ]"
        >
          {{ page }}
        </button>
      </div>
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

const router = useRouter()
const postStore = usePostStore()

const currentPage = ref(1)
const searchTerm = ref('')
const activeFilter = ref('latest')
const isLoading = ref(false)
const error = ref(null)

const displayedPosts = computed(() => {
  if (searchTerm.value) {
    return postStore.posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }
  return postStore.posts
})

const paginationRange = computed(() => {
  const range = []
  for (let i = 1; i <= postStore.totalPages; i++) {
    range.push(i)
  }
  return range
})

onMounted(() => {
  fetchPosts()
})

watch(currentPage, fetchPosts)

async function fetchPosts() {
  isLoading.value = true
  error.value = null
  try {
    if (activeFilter.value === 'hot') {
      await postStore.fetchHotPosts()
    } else {
      await postStore.fetchPosts(currentPage.value)
    }
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

function handleFilterChange() {
  currentPage.value = 1
  fetchPosts()
}

function changePage(page) {
  currentPage.value = page
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
