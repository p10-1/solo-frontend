<template>
  <div>
    <h1>게시글 목록</h1>
    <SearchBar @search="handleSearch" />
    <WriteButton @write-click="showWriteForm = true" />

    <PostList :posts="posts" @post-click="openPostDetail" />

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />

    <WriteForm
      v-if="showWriteForm"
      :isEditing="false"
      @submit="handleSubmit"
      @cancel="showWriteForm = false"
    />

    <PostDetail
      v-if="showPostDetail"
      :post="selectedPost"
      @back="showPostDetail = false"
      @edit="handleEdit"
      @delete="handleDelete"
      @delete-attachment="handleDeleteAttachment"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SearchBar from '@/components/common/SearchBar.vue'
import PostList from '@/components/CommunityPage/PostList.vue'
import Pagination from '@/components/common/Pagination.vue'
import WriteButton from '@/components/CommunityPage/WriteButton.vue'
import WriteForm from '@/components/CommunityPage/WriteForm.vue'
import PostDetail from '@/components/CommunityPage/PostDetail.vue'
import {
  getPosts,
  getPostDetail,
  createPost,
  updatePost,
  deletePost,
  deleteAttachment
} from '@/api/boardApi'

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
