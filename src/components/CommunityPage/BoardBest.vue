<template>
  <div class="container my-4">
    <h2 class="mb-4">인기 글</h2>
    <div v-if="loading" class="alert alert-info">로딩 중...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div class="alert alert-info mt-3">
      * 인기 글은 저번 달 조회수, 댓글 수, 좋아요 수를 기준으로 선정되었습니다.
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
          <th>
            <i class="fa-solid fa-eye"></i> 조회수&nbsp;&nbsp;
            <i class="fa-solid fa-comment"></i> 댓글 수&nbsp;&nbsp;
            <i class="fa-solid fa-thumbs-up"></i> 좋아요 수
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="board in bestBoards" :key="board.boardNo">
          <td>{{ board.boardNo }}</td>
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
          <td>{{ moment(board.regDate).format('YYYY-MM-DD HH:mm') }}</td>
          <td>
            <i class="fa-solid fa-eye"></i> {{ board.views }}&nbsp;&nbsp;<i
              class="fa-solid fa-comment"
            ></i>
            {{ board.comments }}&nbsp;&nbsp;<i class="fa-solid fa-thumbs-up"></i> {{ board.likes }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBest } from '@/api/boardApi'
import moment from 'moment'

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
<style scoped>
.table {
  width: 100%; /* 테이블이 부모 요소의 너비를 차지하도록 설정 */
  table-layout: fixed; /* 열 너비 고정 */
}

.table th,
.table td {
  overflow: hidden; /* 내용이 넘칠 경우 숨김 */
  text-overflow: ellipsis; /* 넘치는 텍스트에 점(...) 표시 */
  white-space: nowrap; /* 줄 바꿈 방지 */
}

.table th {
  text-align: left; /* 제목 정렬 */
}
</style>
