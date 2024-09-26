<template>
  <div class="post-detail">
    <h2>{{ post.title }}</h2>
    <div class="post-info">
      <span>작성자: {{ post.writer }}</span>
      <span>작성일: {{ formatDate(post.regDate) }}</span>
      <span>수정일: {{ formatDate(post.updateDate) }}</span>
    </div>
    <div class="post-content">
      {{ post.content }}
    </div>
    <div class="attachments" v-if="post.attaches && post.attaches.length">
      <h3>첨부 파일</h3>
      <ul>
        <li v-for="file in post.attaches" :key="file.no">
          {{ file.filename }} ({{ file.fileSize }})
          <button @click="$emit('delete-attachment', file.no)">삭제</button>
        </li>
      </ul>
    </div>
    <div class="post-actions">
      <button @click="$emit('edit', post)" class="btn btn-primary">수정</button>
      <button @click="$emit('delete', post.no)" class="btn btn-danger">삭제</button>
      <button @click="$emit('back')" class="btn btn-secondary">목록으로</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  post: Object
})

defineEmits(['back', 'edit', 'delete', 'delete-attachment'])

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

