<template>
  <div class="write-page">
    <h2>글 작성</h2>
    <form @submit.prevent="submitPost">
      <div class="mb-3">
        <label for="title" class="form-label">제목</label>
        <input
          v-model="title"
          id="title"
          type="text"
          class="form-control"
          placeholder="제목을 입력하세요"
          required
        />
      </div>
      <div class="mb-3">
        <label for="content" class="form-label">내용</label>
        <textarea
          v-model="content"
          id="content"
          class="form-control"
          rows="10"
          placeholder="내용을 입력하세요"
          required
        ></textarea>
      </div>
      <div class="mb-3">
        <label for="tags" class="form-label">태그</label>
        <input
          v-model="tags"
          id="tags"
          type="text"
          class="form-control"
          placeholder="태그를 입력하세요 (쉼표로 구분)"
        />
      </div>
      <button type="submit" class="btn btn-primary">작성하기</button>
      <button type="button" @click="cancel" class="btn btn-secondary ms-2">취소</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/PostStore'

const title = ref('')
const content = ref('')
const tags = ref('')
const postStore = usePostStore()
const router = useRouter()

const submitPost = async () => {
  try {
    await postStore.createPost({
      title: title.value,
      content: content.value,
      tags: tags.value.split(',').map((tag) => tag.trim()),
      date: new Date().toISOString(),
      author: 'Current User' // 실제 구현에서는 로그인한 사용자 정보를 사용해야 합니다.
    })
    router.push({ name: 'board' })
  } catch (error) {
    console.error('Error submitting post:', error)
    // 여기에 에러 처리 로직을 추가하세요 (예: 사용자에게 알림 표시)
  }
}

const cancel = () => {
  router.push({ name: 'board' })
}
</script>

<style scoped>
.write-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
