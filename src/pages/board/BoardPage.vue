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

<script setup>
import { ref, onMounted } from 'vue'
import SearchBar from '@/components/common/SearchBar.vue'
import PostList from '@/components/CommunityPage/PostList.vue'
import Pagination from '@/components/common/Pagination.vue'
import WriteButton from '@/components/CommunityPage/WriteButton.vue'
import WriteForm from '@/components/CommunityPage/WriteForm.vue'
import PostDetail from '@/components/CommunityPage/PostDetail.vue'
import { getPosts, getPostDetail, createPost, updatePost, deletePost } from '@/api/boardApi'

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
    posts.value = response.content
    totalPages.value = response.totalPages
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  }
}

const handleSearch = async (searchTerm) => {
  try {
    const response = await getPosts(1, searchTerm)
    posts.value = response.content
    totalPages.value = response.totalPages
    currentPage.value = 1
  } catch (error) {
    console.error('Search failed:', error)
  }
}

const prevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await fetchPosts()
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await fetchPosts()
  }
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
    const detailedPost = await getPostDetail(post.id)
    selectedPost.value = detailedPost
    showPostDetail.value = true
  } catch (error) {
    console.error('Failed to fetch post detail:', error)
  }
}

const handleUpdatePost = async (boardNo, updatedData) => {
  try {
    await updatePost(boardNo, updatedData)
    await fetchPosts()
    showPostDetail.value = false
  } catch (error) {
    console.error('Failed to update post:', error)
  }
}

const handleDeletePost = async (boardNo) => {
  try {
    await deletePost(boardNo)
    await fetchPosts()
    showPostDetail.value = false
  } catch (error) {
    console.error('Failed to delete post:', error)
  }
}

</script>
