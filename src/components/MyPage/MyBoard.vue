<template>
  <div class="container my-4">
    <h2>내가 작성한 글</h2>
    <div class="scroll-container">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성일</th>
            <th>좋아요</th>
            <th>댓글</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="board in boards" :key="board.boardNo">
            <td>{{ board.boardNo }}</td>
            <td>
              <router-link
                :to="{
                  name: 'board/detail',
                  params: { boardNo: board.boardNo }
                }"
              >
                {{ board.title }}</router-link
              >
            </td>
            <td>{{ formatDate(board.updateDate) }}</td>
            <td>{{ board.likes }}</td>
            <td>{{ board.comments }}</td>
            <td>{{ board.views }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { myBoard } from '@/api/boardApi'
import { useAuthStore } from '@/stores/authStore'
import moment from 'moment'

const boards = ref([])
const userName = ref('')
const authStore = useAuthStore()

const loadMyBoards = async () => {
  try {
    boards.value = await myBoard(userName.value)
    console.log(boards)
  } catch (error) {
    console.error('내 게시물을 불러오는 중 오류가 발생했습니다.', error)
  }
}

const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD HH:mm')
}

onMounted(() => {
  userName.value = authStore.userInfo.userName
  loadMyBoards()
})
</script>

<style scoped>
.scroll-container {
  max-height: 300px;
  max-width: 700px;
  overflow-y: auto;
  border: 1px solid #ddd;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}
</style>
