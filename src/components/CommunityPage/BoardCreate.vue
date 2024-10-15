<template>
  <h2 class="title">글 작성</h2>
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
        row="10"
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
      <button type="submit" class="button-main">
        <i class="fa-solid fa-check"></i>
        확인
      </button>
      <router-link class="button-sub margin-left-1rem" :to="{ name: 'board' }">
        <i class="fa-solid fa-reply"></i>
        뒤로
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { create } from '@/api/boardApi'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

// 참조 값 선언
const article = ref({
  title: '',
  content: '',
  userName: '', // 사용자 이름은 로그인된 사용자에 의해 설정됨
  files: []
})

// 사용자 인증 정보 불러오기
const authStore = useAuthStore()

// Vue Router 객체
const router = useRouter()

// 사용자 이름 설정
article.value.userName = authStore.userInfo ? authStore.userInfo.userName : ''

// 파일 업로드 핸들러
const handleFileUpload = (event) => {
  article.value.files = Array.from(event.target.files)
}

// 폼 제출 핸들러
const submitForm = async () => {
  try {
    const formattedContent = article.value.content
      .replace(/\n/g, '<br>') // 줄바꿈 처리
      .replace(/ /g, '&nbsp;') // 공백 처리

    article.value.content = formattedContent // 변환된 내용으로 설정
    await create(article.value)
    alert('글이 성공적으로 작성되었습니다')
    router.push('/board') // 글 작성 후 게시판 페이지로 이동
  } catch (error) {
    console.error('글 작성에 실패했습니다:', error)
  }
}
</script>

<style scoped>
.board-create {
  max-width: 600px;
  margin: 0 auto;
}
</style>
