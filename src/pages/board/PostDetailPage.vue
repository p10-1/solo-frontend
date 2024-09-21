<template>
  <div class="post-detail-page">
    <h2>{{ post.title }}</h2>
    <div class="post-info">
      <span>작성자: {{ post.author }}</span>
      <span>작성일: {{ formatDate(post.date) }}</span>
      <span>조회수: {{ post.views }}</span>
      <span>좋아요: {{ post.likes || 0 }}</span>
    </div>
    <div class="post-content">
      <p>{{ post.content }}</p>
    </div>
    <div class="post-actions">
      <button @click="likePost" class="btn btn-primary me-2">좋아요</button>
      <button @click="goBack" class="btn btn-secondary">목록으로</button>
    </div>

    <div class="comments-section mt-4">
      <h3>댓글</h3>
      <ul class="list-group">
        <li v-for="comment in post.comments" :key="comment.id" class="list-group-item">
          <strong>{{ comment.author }}</strong
          >: {{ comment.content }}
          <small class="text-muted">{{ formatDate(comment.date) }}</small>
        </li>
      </ul>
      <div class="mt-3">
        <textarea
          v-model="newComment"
          placeholder="댓글을 입력하세요"
          class="form-control"
        ></textarea>
        <button @click="addComment" class="btn btn-primary mt-2">댓글 작성</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePostStore } from '@/stores/PostStore'

const postStore = usePostStore()
const router = useRouter()
const route = useRoute()

const post = ref({})
const newComment = ref('')

onMounted(async () => {
  try {
    post.value = await postStore.getPostById(route.params.id)
  } catch (error) {
    console.error('Failed to fetch post:', error)
    // 에러 처리 로직 (예: 에러 메시지 표시)
  }
})

const goBack = () => {
  router.push({ name: 'board' })
}

const likePost = async () => {
  try {
    const updatedPost = await postStore.likePost(post.value.id)
    post.value = updatedPost
  } catch (error) {
    console.error('Failed to like post:', error)
    // 에러 처리 로직 (예: 에러 메시지 표시)
  }
}

const addComment = async () => {
  if (newComment.value.trim()) {
    try {
      const updatedPost = await postStore.addComment(post.value.id, {
        author: 'Current User', // 실제 구현에서는 로그인한 사용자 정보를 사용해야 합니다.
        content: newComment.value
      })
      post.value = updatedPost
      newComment.value = ''
    } catch (error) {
      console.error('Failed to add comment:', error)
      // 에러 처리 로직 (예: 에러 메시지 표시)
    }
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.post-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.post-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #666;
}

.post-content {
  margin-bottom: 20px;
}

.post-actions {
  margin-bottom: 20px;
}

.comments-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
}
</style>
