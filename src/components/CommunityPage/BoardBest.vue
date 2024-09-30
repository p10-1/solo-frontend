<template>
  <div class="container my-4">
    <h2 class="mb-4">인기 글</h2>
    <div v-if="loading" class="alert alert-info">로딩 중...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">순위</th>
          <th scope="col">제목</th>
          <th scope="col">작성자</th>
          <th scope="col">조회수</th>
          <th scope="col">댓글 수</th>
          <th scope="col">좋아요 수</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(board, index) in bestBoards" :key="board.boardNo">
          <td>{{ index + 1 }}</td>
          <td>
            <router-link
              :to="{
                name: 'board/detail',
                params: { boardNo: board.boardNo }
              }"
            >
              {{ board.title }}
            </router-link>
          </td>
          <td>{{ board.userName }}</td>
          <td>{{ board.views }}</td>
          <td>{{ board.comments }}</td>
          <td>{{ board.likes }}</td>
        </tr>
      </tbody>
    </table>
    <div class="alert alert-info mt-3">
      * 인기 글은 조회수, 댓글 수, 좋아요 수를 기준으로 선정되었습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBest } from '@/api/boardApi'

const bestBoards = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    bestBoards.value = await getBest()
  } catch (err) {
    error.value = '인기 글을 가져오는 데 실패했습니다.'
  } finally {
    loading.value = false
  }
})
</script>
