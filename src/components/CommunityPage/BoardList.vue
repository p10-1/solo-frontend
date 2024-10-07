<template>
  <div class="board-list">
    <h2 class="title">커뮤니티</h2>
    <div class="search-section">
      <div class="select-form">
        <select v-model="category">
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="userName">작성자</option>
        </select>
      </div>
      <search-bar v-model="keyword" @search="searchBoards" />
    </div>
    <dl class="total">
      <dt>전체</dt>
      <dd><b>0</b>건</dd>
    </dl>
    <!-- 정렬 기준 선택 -->
    <div class="table-top-box margin-top-1rem margin-bottom-1rem">
      <div class="select-form">
        <select v-model="sortBy" @change="loadBoards">
          <option value="latest">최신순</option>
          <option value="likes">좋아요순</option>
          <option value="views">조회순</option>
          <option value="comments">댓글순</option>
        </select>
      </div>
      <!-- <BoardBest /> -->
      <div class="alert">
        <i class="fa-solid fa-circle-info"></i> 인기 글은 저번 달 조회수, 댓글 수, 좋아요 수를
        기준으로 선정되었습니다.
      </div>
      <div class="button-box">
        <router-link :to="{ name: 'board/create' }" class="button-main btn btn-primary">
          글쓰기
        </router-link>
      </div>
    </div>
    <!-- Board List -->
    <table class="table">
      <colgroup>
        <col width="8%" />
        <col width="70%" />
        <col width="10%" />
        <col width="22%" />
      </colgroup>
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
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
          <td class="text-align-left link">
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
              <ul class="table-ex-info">
                <li><i class="fa-solid fa-user"></i> {{ board.views }}</li>
                <li><i class="fa-solid fa-heart"></i> {{ board.likes }}</li>
                <li><i class="fa-solid fa-comment"></i> {{ board.comments }}</li>
              </ul>
            </router-link>
          </td>
          <td>
            <span class="badge">{{ board.userName }}</span>
          </td>
          <td class="date">{{ moment(board.regDate).format('YYYY-MM-DD HH:mm') }}</td>
        </tr>
      </tbody>
    </table>

    <pagination :currentPage="pageNum" :totalPages="totalPage" @page-change="changePage" />
  </div>
</template>

<style scope>
.board-list {
  position: relative;
}
.button-box {
  position: absolute;
  right: 0;
}
</style>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getList } from '@/api/boardApi'
import Pagination from '@/components/common/PaginationComp.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import moment from 'moment'

const list = ref([])
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

<style scoped></style>
