<template>
  <div class="best-posts-container">
    <div class="header">
      <h2>인기 글</h2>
      <button class="more-button" @click="goToBoard">더보기</button>
    </div>
    <table class="table table-lg">
      <thead>
        <tr>
          <th>제목</th>
          <th>작성자</th>
          <th>작성 날짜</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, index) in bestPosts" :key="index">
          <td class="truncate">{{ post.title }}</td>
          <td class="truncate">{{ post.userName }}</td>
          <td>{{ formatDate(post.regDate) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBest } from '@/api/boardApi'
import { useRouter } from 'vue-router'
import moment from 'moment'

const bestPosts = ref([])
const router = useRouter()

// 인기글 불러오기
const loadBestPosts = async () => {
  try {
    bestPosts.value = await getBest()
  } catch (error) {
    console.error('인기글을 불러오는 데 실패했습니다.', error)
  }
}

// 날짜 포맷팅 (월.일 형식)
const formatDate = (date) => {
  return moment(date).format('MM.DD')
}

// '/board'로 이동
const goToBoard = () => {
  router.push('/board')
}

// 컴포넌트가 로드될 때 인기글 가져오기
onMounted(() => {
  loadBestPosts()
})
</script>

<style scoped>
.best-posts-container {
  margin: 20px 0;
  width: 100%;
  max-width: 400px; /* 테이블 크기 확장 */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

h2 {
  font-size: 1.3rem; /* 제목 크기 확장 */
}

.table {
  width: 100%;
  font-size: 0.8rem; /* 테이블 글자 크기 확장 */
}

.table th,
.table td {
  padding: 10px; /* 셀 패딩 조정 */
  text-align: left; /* 좌측 정렬 */
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* 텍스트 너비 확장 */
}

.more-button {
  padding: 8px 12px; /* 버튼 크기 확장 */
  background-color: #6846f5;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.more-button:hover {
  background-color: #0056b3;
}
</style>
