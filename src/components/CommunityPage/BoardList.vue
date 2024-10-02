<template>
  <div class="board-list">
    <div class="search-section">
      <select v-model="category">
        <option value="title">제목</option>
        <option value="content">내용</option>
        <option value="userName">작성자</option>
      </select>
      <search-bar v-model="keyword" @search="searchBoards" />

      <!-- 정렬 기준 선택 -->
      <select v-model="sortBy" @change="loadBoards">
        <option value="latest">최신순</option>
        <option value="likes">좋아요순</option>
        <option value="views">조회순</option>
        <option value="comments">댓글순</option>
      </select>
    </div>
    <!-- <BoardBest /> -->
    <div class="alert alert-info mt-3">
      * 인기 글은 저번 달 조회수, 댓글 수, 좋아요 수를 기준으로 선정되었습니다.
    </div>
    <!-- Board List -->
    <table class="table">
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th></th>
          <th>작성자</th>
          <th>작성일</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(board, index) in list"
          :key="board.boardNo"
          :class="{ 'top-post': pageNum === 1 && index < 5 }"
        >
          <td>{{ board.boardNo }}</td>
          <td>
            <router-link
              :to="{
                name: 'board/detail',
                params: { boardNo: board.boardNo }
              }"
            >
              {{ board.title }}
              <!-- <span v-if="bestlist.includes(board.boardNo)">
                <i class="fa-solid fa-star" style="color: gold"></i>
              </span> -->
            </router-link>
          </td>
          <td>
            <i class="fa-solid fa-eye"></i> {{ board.views }}&nbsp;&nbsp;<i
              class="fa-solid fa-comment"
            ></i>
            {{ board.comments }}&nbsp;&nbsp;<i class="fa-solid fa-thumbs-up"></i> {{ board.likes }}
          </td>
          <td>{{ board.userName }}</td>
          <td>{{ moment(board.regDate).format('YYYY-MM-DD HH:mm') }}</td>
        </tr>
        <router-link :to="{ name: 'board/create' }" class="btn btn-primary">
          <i class="fa-solid fa-pen-to-square"></i> 글 작성
        </router-link>
      </tbody>
    </table>

    <pagination :currentPage="pageNum" :totalPages="totalPage" @page-change="changePage" />
  </div>
</template>

<style></style>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getList, getBest } from '@/api/boardApi'
import Pagination from '@/components/common/PaginationComp.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import moment from 'moment'

const list = ref([])
const bestlist = ref([])
const pageNum = ref(1)
const totalPage = ref(0)
const category = ref('')
const keyword = ref('')
const amount = ref(10)
const sortBy = ref('latest')
const router = useRouter()
const route = useRoute()

const loadBoards = async () => {
  try {
    const data = await getList(pageNum.value, category.value, keyword.value, sortBy.value)
    list.value = data.list || []
    totalPage.value = data.totalPage || 0
    pageNum.value = data.pageNum || 1
    amount.value = data.amount || 10
  } catch (error) {
    console.error('Error loading boards:', error)
  }
}

const getBests = async () => {
  try {
    bestlist.value = await getBest()
    console.log('best:', bestlist.value)
  } catch (error) {
    console.error('인기 글을 가져오는 데 실패했습니다.')
  }
}

const searchBoards = async (searchTerm) => {
  keyword.value = searchTerm
  pageNum.value = 1
  await router.push({
    path: '/board',
    query: {
      keyword: keyword.value,
      category: category.value,
      page: pageNum.value,
      sortBy: sortBy.value
    }
  })
  await loadBoards()
}

const changePage = async (page) => {
  pageNum.value = page
  await router.push({
    path: '/board',
    query: {
      keyword: keyword.value,
      category: category.value,
      page: pageNum.value,
      sortBy: sortBy.value
    }
  })
  await loadBoards()
}

onMounted(() => {
  keyword.value = route.query?.keyword || ''
  category.value = route.query?.category || 'title'
  pageNum.value = parseInt(route.query?.page) || 1
  sortBy.value = route.query?.sortBy || 'latest'
  loadBoards()
  getBests()
})

watch(
  () => route.query,
  () => {
    if (route.query) {
      keyword.value = route.query.keyword || ''
      pageNum.value = parseInt(route.query.page) || 1
      loadBoards()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.table {
  width: 100%;
  table-layout: fixed;
}

.table th,
.table td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table th {
  text-align: left;
}

.board-list .top-post {
  background-color: #ffeb3b !important;
  border-left: 5px solid #f57f17;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
}

.top-post:hover {
  transform: scale(1.02);
  background-color: #e8f5e9;
}

.table th,
.table td {
  padding: 12px 15px;
}

.table td {
  vertical-align: middle;
  word-break: break-word;
}
</style>
