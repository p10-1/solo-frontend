<template>
  <div class="write-form">
    <h2>글 작성</h2>
    <input v-model="title" placeholder="제목" class="form-control mb-3" />
    <textarea v-model="content" placeholder="내용" class="form-control mb-3" rows="5"></textarea>
    <div class="d-flex justify-content-between">
      <button @click="$emit('cancel')" class="btn btn-secondary">취소</button>
      <button @click="submitPost" class="btn btn-primary">글 작성</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('')
const content = ref('')

const emit = defineEmits(['submit', 'cancel'])

const submitPost = () => {
  emit('submit', {
    title: title.value,
    content: content.value,
    author: 'KB' // 실제로는 로그인한 사용자 정보를 사용해야 합니다
  })
  title.value = ''
  content.value = ''
}
</script>
