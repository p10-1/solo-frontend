<template>
  <div class="container">
    <div class="title-box">
      <h2 class="title">내가 <span class="text-accent font-weigth-300">작성한 글</span></h2>
      <router-link to="board" class="link"><i class="fa-solid fa-plus"></i> 더보기</router-link>
    </div>
    <div class="scroll-container">
      <table class="table">
        <colgroup>
          <col width="13%" />
          <col width="65%" />
          <col width="22%" />
        </colgroup>
        <thead>
          <tr>
            <th>번호</th>
            <th class="text-align-left">제목</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="board in boards" :key="board.boardNo">
            <td>{{ board.boardNo }}</td>
            <td class="text-align-left">
              <router-link
                :to="{
                  name: 'board/detail',
                  params: { boardNo: board.boardNo }
                }"
              >
                <!-- text가 길때 제한길이 이하는 '...'으로 표시되고 hover하면 전체 text 보여주기 -->
                <div class="board-title truncated" :title="board.title">
                  {{ truncateTitle(board.title) }}
                </div>

                <ul class="table-ex-info">
                  <li><i class="fa-solid fa-user"></i> {{ board.views }}</li>
                  <li><i class="fa-solid fa-heart"></i> {{ board.likes }}</li>
                  <li><i class="fa-solid fa-comment"></i> {{ board.comments }}</li>
                </ul>
              </router-link>
            </td>
            <td class="date">{{ formatDate(board.updateDate) }}</td>
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
    console.log('내가쓴글:', boards)
  } catch (error) {
    console.error('내 게시물을 불러오는 중 오류가 발생했습니다.', error)
  }
}

const truncateTitle = (title) => {
  const maxLength = 20 // 길이제한
  if (title.length > maxLength) {
    return title.slice(0, maxLength) + '...' // 길이제한 이하는 '...'으로 보여주기
  }
  return title
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
  min-height: 20rem;
  max-height: 27rem;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  border: 1px solid #ddd;
}
</style>
