<template>
  <h1><i class="fa-regular fa-pen-to-square"></i> 글 작성</h1>
  <form @submit.prevent="submitForm">
    <div class="mb-3 mt-3">
      <label for="title" class="form-label">제목 </label>
      <input
        type="text"
        class="form-control"
        placeholder="제목"
        v-model="article.title"
        id="title"
        required
      />
    </div>
    <div class="mb-3 mt-3">
      <label for="content" class="form-label">내용 </label>
      <textarea
        class="form-control"
        placeholder="내용"
        v-model="article.content"
        id="content"
        required
      ></textarea>
    </div>
    <div class="mb-3 mt-3">
      <label for="files" class="form-label">첨부파일 </label>
      <input
        type="file"
        class="form-control"
        placeholder="첨부파일"
        @change="handleFileUpload"
        multiple
      />
    </div>
    <div class="my-5 text-center">
      <button type="submit" class="btn btn-primary me-3">
        <i class="fa-solid fa-check"></i>
        확인
      </button>
      <router-link class="btn btn-primary" :to="{ name: 'board' }">
        <i class="fa-solid fa-list"></i>
        목록
      </router-link>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue'
import { create } from '@/api/boardApi'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

export default {
  name: 'BoardCreate',
  setup() {
    const article = ref({
      title: '',
      content: '',
      userId: '', // Will be set by the authenticated user
      files: []
    })
    const authStore = useAuthStore() // Get the authentication store
    const router = useRouter()

    // Set the userID based on the logged-in user
    article.value.userId = authStore.userInfo ? authStore.userInfo.userId : ''
    const handleFileUpload = (event) => {
      article.value.files = Array.from(event.target.files)
    }

    const submitForm = async () => {
      try {
        await create(article.value)
        alert('글이 성공적으로 작성되었습니다')
        router.push('/board')
      } catch (error) {
        console.error('글 작성에 실패했습니다:', error)
      }
    }

    return {
      article,
      handleFileUpload,
      submitForm
    }
  }
}
</script>

<style scoped>
.board-create {
  max-width: 600px;
  margin: 0 auto;
}
</style>
