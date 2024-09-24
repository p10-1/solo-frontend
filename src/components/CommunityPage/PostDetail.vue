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
      <button @click="editPost" class="btn btn-outline-secondary ml-2">수정</button>
      <button @click="deletePost" class="btn btn-outline-danger ml-2">삭제</button>
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

const emit = defineEmits(['back', 'like', 'edit', 'delete', 'addComment'])

const newComment = ref('')

const likePost = () => {
  emit('like', props.post.id)
}

const editPost = () => {
  emit('edit', props.post.id)
}

const deletePost = () => {
  if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
    emit('delete', props.post.id)
  }
}

const addComment = () => {
  if (newComment.value.trim()) {
    emit('addComment', { postId: props.post.id, content: newComment.value })
    newComment.value = ''
  }
}
</script>
