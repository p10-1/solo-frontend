<template>
  <div class="board-list">
    <h2 class="title">커뮤니티</h2>

    <!-- 정렬 기준 선택 -->
    <div class="search-section">
      <div class="select-form">
        <select v-model="sortBy" @change="loadBoards">
          <option value="latest">최신순</option>
          <option value="likes">좋아요순</option>
          <option value="views">조회순</option>
          <option value="comments">댓글순</option>
        </select>
      </div>
      <div class="select-form">
        <select v-model="category">
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="userName">작성자</option>
        </select>
      </div>
      <search-bar v-model="keyword" @search="searchBoards" />
    </div>
    <div class="table-top-box margin-top-1rem margin-bottom-1rem">
      <dl class="total">
        <dt>전체</dt>
        <dd>
          <b>{{ totalCnt }}</b
          >건
        </dd>
      </dl>

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
        <tr v-for="board in list" :key="board.boardNo">
          <td>{{ board.boardNo }}</td>
          <td class="text-align-left link">
            <router-link
              :to="{
                name: 'board/detail',
                params: { boardNo: board.boardNo }
              }"
              class="router-link no-underline"
            >
              <!-- text가 길때 제한길이 이하는 '...'으로 표시되고 hover하면 전체 text 보여주기 -->
              <div class="truncated" :title="board.title">
                {{ truncateTitle(board.title) }}
              </div>
              <!-- 24시간 이내 새 게시물 new 보여주기 -->
              <span v-if="isNew(board.regDate)" class="new-label">NEW</span>
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
          <td class="date">{{ formatTimeAgo(board.regDate) }}</td>
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
const totalCnt = ref(0)

const loadBoards = async () => {
  try {
    const data = await getList(pageNum.value, category.value, keyword.value, sortBy.value)
    list.value = data.list || []
    totalPage.value = data.totalPage || 0
    pageNum.value = data.pageNum || 1
    amount.value = data.amount || 10
    totalCnt.value = data.totalCount || 0
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

const formatTimeAgo = (regDate) => {
  const now = moment()
  const postDate = moment(regDate)

  if (now.isSame(postDate, 'day')) {
    const hoursDiff = now.diff(postDate, 'hours')
    const minutesDiff = now.diff(postDate, 'minutes')
    const secondDiff = now.diff(postDate, 'seconds')
    if (hoursDiff === 0 && minutesDiff === 0) {
      return `${secondDiff}초 전`
    } else if (hoursDiff === 0 && minutesDiff < 60) {
      return `${minutesDiff}분 전`
    } else if (hoursDiff < 24) {
      return `${hoursDiff}시간 전`
    }
  }

  return moment(regDate).format('YYYY-MM-DD HH:mm') // 오늘이 아니면 원래 포맷으로 반환
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

// 타이틀 길이 제한
const truncateTitle = (title) => {
  const maxLength = 35 // 길이제한(47:시간 아래로 들여쓰기됨)
  if (title.length > maxLength) {
    return title.slice(0, maxLength) + '...' // 제한길이 이하는 '...'로 표시
  }
  return title
}

// new 보여주기
const isNew = (regDate) => {
  const postDate = moment(regDate)
  const now = moment()
  const hoursDiff = now.diff(postDate, 'hours')
  return hoursDiff <= 24 // 24시간  이내만
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
