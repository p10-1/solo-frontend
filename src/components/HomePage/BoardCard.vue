<template>
  <div class="best-posts-container">
    <div class="title-box margin-top-2rem margin-bottom-1rem">
      <h2 class="main-title">커뮤니티 <span class="text-accent">HOT</span></h2>
      <button class="link" @click="goToBoard">
        <i class="fa-solid fa-plus"></i>
        더보기
      </button>
    </div>
    <div class="posts-content">
      <ul v-for="(post, index) in bestPosts" :key="index" class="bxslider posts-list">
        <li class="truncate posts-title">{{ post.title }}</li>
        <li class="truncate">{{ post.userName }}</li>
        <li>{{ formatDate(post.regDate) }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBest } from '@/api/boardApi'
import { useRouter } from 'vue-router'
import moment from 'moment'

const bestPosts = ref([])
const router = useRouter()

// 인기글 불러오기
const loadBestPosts = async () => {
  try {
    bestPosts.value = await getBest()
  } catch (error) {
    console.error('인기글을 불러오는 데 실패했습니다.', error)
  }
}

// 날짜 포맷팅 (월.일 형식)
const formatDate = (date) => {
  return moment(date).format('MM.DD')
}

// '/board'로 이동
const goToBoard = () => {
  router.push('/board')
}

// 컴포넌트가 로드될 때 인기글 가져오기
onMounted(() => {
  loadBestPosts()
})
</script>

<style scoped>
.best-posts-container {
  width: 100%;
  padding: 1rem;
}
.posts-content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 17px;
}
.posts-content ul.posts-list {
  padding: 1.5rem;
  background-color: #f3f3ff;
  min-height: 10rem;
  border-radius: 28px;
}
.posts-content ul.posts-list li {
}
</style>
