<template>
  <div class="post-detail" aria-labelledby="post-title">
    <h2 id="post-title">{{ post.title }}</h2>
    <div class="post-info">
      <span>작성자: {{ post.author }}</span>
      <span>작성일: {{ post.date }}</span>
      <span>조회수: {{ post.views }}</span>
    </div>
    <div class="post-content">
      {{ post.content }}
    </div>
    <div class="post-actions">
      <button
        @click="likePost"
        class="btn btn-outline-primary"
        :aria-label="`좋아요 ${post.likes}개`"
      >
        👍 좋아요 ({{ post.likes }})
      </button>
    </div>
    <h3>댓글</h3>
    <div class="comments">
      <div v-for="comment in paginatedComments" :key="comment.id" class="comment">
        <strong>{{ comment.author }}</strong
        >: {{ comment.content }}
      </div>
    </div>
    <Pagination
      v-if="totalCommentPages > 1"
      :current-page="currentCommentPage"
      :total-pages="totalCommentPages"
      @page-change="changeCommentPage"
    />
    <div class="comment-form">
      <label for="comment-input" class="visually-hidden">댓글 입력</label>
      <input
        id="comment-input"
        v-model="newComment"
        @keyup.enter="addComment"
        placeholder="댓글을 입력하세요"
        class="form-control"
      />
      <button @click="addComment" class="btn btn-primary mt-2">댓글 작성</button>
    </div>
    <button @click="$emit('back')" class="btn btn-secondary mt-3">목록으로</button>

    <!-- 간단한 알림 메시지 -->
    <div v-if="alertMessage" class="alert" :class="alertType">
      {{ alertMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePostStore } from '@/stores/PostStore'
import Pagination from '@/components/common/Pagination.vue'

const props = defineProps({
  post: Object
})

const emit = defineEmits(['back'])

const postStore = usePostStore()
const newComment = ref('')
const alertMessage = ref('')
const alertType = ref('')

const commentsPerPage = 5
const currentCommentPage = ref(1)

const paginatedComments = computed(() => {
  if (!props.post || !props.post.comments) return []
  const start = (currentCommentPage.value - 1) * commentsPerPage
  const end = start + commentsPerPage
  return props.post.comments.slice(start, end)
})

const totalCommentPages = computed(() =>
  props.post && props.post.comments ? Math.ceil(props.post.comments.length / commentsPerPage) : 0
)
const changeCommentPage = (page) => {
  currentCommentPage.value = page
}

const showAlert = (message, type = 'success') => {
  alertMessage.value = message
  alertType.value = `alert-${type}`
  setTimeout(() => {
    alertMessage.value = ''
    alertType.value = ''
  }, 3000)
}

const likePost = async () => {
  try {
    await postStore.likePost(props.post.id)
    showAlert('좋아요를 눌렀습니다.', 'success')
  } catch (error) {
    showAlert('좋아요 처리 중 오류가 발생했습니다.', 'danger')
  }
}

const addComment = async () => {
  if (newComment.value.trim()) {
    try {
      await postStore.addComment(props.post.id, {
        content: newComment.value,
        author: '현재 사용자' // 실제로는 로그인된 사용자 정보를 사용해야 합니다
      })
      newComment.value = ''
      showAlert('댓글이 추가되었습니다.', 'success')
    } catch (error) {
      showAlert('댓글 추가 중 오류가 발생했습니다.', 'danger')
    }
  }
}
</script>

<style scoped>
.post-detail {
  /* 스타일링은 필요에 따라 추가하세요 */
}

.alert {
  padding: 10px;
  margin-top: 10px;
  border-radius: 4px;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
