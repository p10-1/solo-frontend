<template>
  <h2 class="title">글 수정</h2>

  <form @submit.prevent="submit">
    <div class="mb-3 mt-3">
      <label for="title" class="form-label"> 제목 </label>
      <input
        type="text"
        class="form-control"
        placeholder="제목"
        id="title"
        v-model="article.title"
      />
      <div class="invalid-feedback">제목은 필수 요소입니다.</div>
    </div>

    <div class="mb-3 mt-3">
      <label class="form-label"> 기존 첨부파일 </label>
      <div v-for="file in attachments" :key="file.no" class="attach">
        <i class="fa-solid fa-paperclip"></i>
        {{ file.filename }}
        <i
          class="fa-solid fa-trash-can text-danger ms-2"
          @click="removeFile(file.no, file.filename)"
        ></i>
      </div>
    </div>

    <div class="mb-3 mt-3">
      <label for="files" class="form-label"> 첨부파일 </label>
      <input
        type="file"
        class="form-control"
        placeholder="첨부파일"
        id="files"
        ref="files"
        multiple
      />
    </div>

    <div class="mb-3 mt-3">
      <label for="content" class="form-label"> 내용 </label>
      <textarea
        class="form-control"
        placeholder="내용"
        id="content"
        v-model="article.content"
        rows="10"
      ></textarea>
    </div>

    <div class="my-5 text-center">
      <button type="submit" class="button-main">확인</button>
      <button type="button" class="button-sub margin-left-1rem" @click="reset">취소</button>
      <button class="button-sub margin-left-1rem" @click="back">
        <i class="fa-solid fa-reply"></i> 뒤로
      </button>
    </div>
  </form>
</template>

<script setup>
import { deleteAttachment, update, get } from '@/api/boardApi'
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const boardNo = route.params.boardNo
const article = reactive({})
const attachments = ref([])
const orgArticle = ref({})
const files = ref(null)

const back = () => {
  router.push({ name: 'board/detail', params: { boardNo } })
}

const reset = () => {
  article.boardNo = orgArticle.value.boardNo
  article.title = orgArticle.value.title
  article.userName = orgArticle.value.userName
  article.content = stripHtml(orgArticle.value.content)
}

const removeFile = async (no, filename) => {
  if (!confirm(`${filename}을 삭제할까요?`)) return

  try {
    await deleteAttachment(no)
    const ix = attachments.value.findIndex((f) => f.no === no)
    attachments.value.splice(ix, 1)
  } catch (error) {
    console.error('파일 삭제 실패:', error)
    alert('파일을 삭제할 수 없습니다.')
  }
}

const stripHtml = (html) => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return tempDiv.textContent || tempDiv.innerText || ''
}

const submit = async () => {
  if (!confirm('수정할까요?')) return
  if (files.value && files.value.files.length > 0) {
    article.files = Array.from(files.value.files)
  }
  const formattedContent = article.content
    .replace(/\n/g, '<br>') // 줄바꿈을 <br>로 변환
    .replace(/ /g, '&nbsp;') // 공백을 &nbsp;로 변환

  article.content = formattedContent
  await update(article)
  router.push({ name: 'board/detail', params: { boardNo }, query: route.query })
}

const load = async () => {
  const data = await get(boardNo)
  orgArticle.value = { ...data }
  article.content = stripHtml(orgArticle.value.content)
    .replace(/<br>/g, '\n\n') // <br>을 줄바꿈으로 변환
    .replace(/&nbsp;/g, ' ') // &nbsp;를 공백으로 변환
  attachments.value = data.attaches
  reset()
}

load()
</script>

<style>
.fa-trash-can {
  cursor: pointer;
}
</style>
