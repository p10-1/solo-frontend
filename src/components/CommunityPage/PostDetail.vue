<template>
  <div class="post-detail">
    <h2>{{ post.title }}</h2>
    <div class="post-info">
      <span>작성자: {{ post.author }}</span>
      <span>작성일: {{ post.date }}</span>
      <span>조회수: {{ post.views }}</span>
    </div>
    <div class="post-content">
      {{ post.content }}
    </div>
    <div class="post-actions">
      <button @click="likePost" class="btn btn-outline-primary">
        👍 좋아요 ({{ post.likes }})
      </button>
    </div>
    <h3>댓글</h3>
    <div class="comments">
      <div v-for="comment in post.comments" :key="comment.id" class="comment">
        <strong>{{ comment.author }}</strong
        >: {{ comment.content }}
      </div>
    </div>
    <div class="comment-form">
      <input v-model="newComment" placeholder="댓글을 입력하세요" class="form-control" />
      <button @click="addComment" class="btn btn-primary mt-2">댓글 작성</button>
    </div>
    <button @click="$emit('back')" class="btn btn-secondary mt-3">목록으로</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  post: Object
})

const emit = defineEmits(['back'])

const newComment = ref('')

const likePost = () => {
  // 좋아요 기능 구현
  console.log('Post liked')
}

const addComment = () => {
  if (newComment.value.trim()) {
    // 댓글 추가 로직 구현
    console.log('Comment added:', newComment.value)
    newComment.value = ''
  }
}
</script>
