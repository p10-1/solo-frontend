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
import { ref, onMounted } from 'vue'
import SearchBar from '@/components/common/SearchBar.vue'
import Pagination from '@/components/common/Pagination.vue'
import WriteButton from '@/components/CommunityPage/WriteButton.vue'
import WriteForm from '@/components/CommunityPage/WriteForm.vue'
import BoardDetail from '@/components/CommunityPage/BoardDetail.vue'
import BoardList from '@/components/CommunityPage/BoardList.vue'

const currentPage = ref(1)
const totalPages = ref(1)
const showWriteForm = ref(false)
const showPostDetail = ref(false)
const selectedPost = ref(null)
const posts = ref([])

onMounted(async () => {
  await fetchPosts()
})

const fetchPosts = async () => {
  try {
    const response = await getPosts(currentPage.value)
    posts.value = response.list
    totalPages.value = response.totalPage
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  }
}

const handleSearch = async (searchTerm) => {
  // Implement search functionality
}

const changePage = async (page) => {
  currentPage.value = page
  await fetchPosts()
}

const handleSubmit = async (postData) => {
  try {
    await createPost(postData)
    await fetchPosts()
    showWriteForm.value = false
  } catch (error) {
    console.error('Failed to create post:', error)
  }
}

const openPostDetail = async (post) => {
  try {
    selectedPost.value = await getPostDetail(post.no)
    showPostDetail.value = true
  } catch (error) {
    console.error('Failed to fetch post detail:', error)
  }
}

const handleEdit = async (updatedPost) => {
  try {
    await updatePost(updatedPost.no, updatedPost)
    await fetchPosts()
    showPostDetail.value = false
  } catch (error) {
    console.error('Failed to update post:', error)
  }
}

const handleDelete = async (postNo) => {
  try {
    await deletePost(postNo)
    await fetchPosts()
    showPostDetail.value = false
  } catch (error) {
    console.error('Failed to delete post:', error)
  }
}

const handleDeleteAttachment = async (attachmentNo) => {
  try {
    await deleteAttachment(attachmentNo)
    // Refresh the post details
    selectedPost.value = await getPostDetail(selectedPost.value.no)
  } catch (error) {
    console.error('Failed to delete attachment:', error)
  }
}
</script>

<style scoped>
.community-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style> -->
