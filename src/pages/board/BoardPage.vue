<template>
  <div class="community-page">
    <h1 class="mb-4">커뮤니티</h1>

    <div v-if="isLoading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">로딩 중...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <template v-if="!isLoading && !error">
      <SearchBar v-if="!showWriteForm && !showPostDetail" @search="handleSearch" />

      <PostList
        v-if="!showWriteForm && !showPostDetail"
        :posts="filteredPosts"
        @post-click="openPostDetail"
      />

      <div
        v-if="!showWriteForm && !showPostDetail"
        class="d-flex justify-content-between align-items-center mt-4"
      >
        <Pagination
          v-if="postStore.totalPages > 0"
          :current-page="currentPage"
          :total-pages="postStore.totalPages"
          @page-change="changePage"
        />
        <WriteButton @write-click="showWriteForm = true" />
      </div>

      <WriteForm v-if="showWriteForm" @submit="handleSubmit" @cancel="showWriteForm = false" />

      <PostDetail
        v-if="showPostDetail"
        :post="selectedPost"
        @back="closePostDetail"
        @update="handleUpdatePost"
        @delete="handleDeletePost"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePostStore } from '@/stores/PostStore'
import SearchBar from '@/components/common/SearchBar.vue'
import PostList from '@/components/CommunityPage/PostList.vue'
import Pagination from '@/components/common/Pagination.vue'
import WriteButton from '@/components/CommunityPage/WriteButton.vue'
import WriteForm from '@/components/CommunityPage/WriteForm.vue'
import PostDetail from '@/components/CommunityPage/PostDetail.vue'

const postStore = usePostStore()
const isLoading = ref(false)
const error = ref(null)
const showWriteForm = ref(false)
const showPostDetail = ref(false)
const selectedPost = ref(null)
const searchTerm = ref('')
const currentPage = ref(1)

const filteredPosts = computed(() => {
  if (!searchTerm.value) return postStore.posts
  return postStore.posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

onMounted(async () => {
  await fetchPosts()
})

watch(currentPage, async () => {
  await fetchPosts()
})

async function fetchPosts() {
  isLoading.value = true
  error.value = null
  try {
    await postStore.fetchPosts(currentPage.value)
    if (postStore.posts.length === 0) {
      console.warn('No posts returned from the server')
    }
  } catch (err) {
    error.value = '게시글을 불러오는 데 실패했습니다.'
    console.error('Failed to fetch posts:', err)
  } finally {
    isLoading.value = false
  }
}

const handleSearch = (term) => {
  searchTerm.value = term
  currentPage.value = 1
}

const changePage = (page) => {
  currentPage.value = page
}

const handleSubmit = async (postData) => {
  isLoading.value = true
  error.value = null
  try {
    await postStore.createPost(postData)
    showWriteForm.value = false
    currentPage.value = 1
    await fetchPosts()
  } catch (err) {
    error.value = '게시글 작성에 실패했습니다.'
    console.error('Failed to create post:', err)
  } finally {
    isLoading.value = false
  }
}

const openPostDetail = (post) => {
  if (post) {
    selectedPost.value = { ...post, comments: post.comments || [] }
    showPostDetail.value = true
  }
}

const closePostDetail = () => {
  showPostDetail.value = false
  selectedPost.value = null
}

const handleUpdatePost = async (postData) => {
  isLoading.value = true
  error.value = null
  try {
    await postStore.updatePost(postData)
    closePostDetail()
    await fetchPosts()
  } catch (err) {
    error.value = '게시글 수정에 실패했습니다.'
    console.error('Failed to update post:', err)
  } finally {
    isLoading.value = false
  }
}

const handleDeletePost = async (postId) => {
  isLoading.value = true
  error.value = null
  try {
    await postStore.deletePost(postId)
    closePostDetail()
    currentPage.value = 1
    await fetchPosts()
  } catch (err) {
    error.value = '게시글 삭제에 실패했습니다.'
    console.error('Failed to delete post:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.community-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
