<template>
  <div class="board-list">
    <div class="search-section">
      <select v-model="category">
        <option value="title">제목</option>
        <option value="content">내용</option>
        <option value="userId">작성자</option>
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

    <!-- Board List -->
    <table class="table">
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(board, index) in list" :key="board.boardNo">
          <td>{{ (pageNum - 1) * amount + (index + 1) }}</td>
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
          <td>{{ board.userId }}</td>
          <td>{{ moment(board.regDate).format('YYYY-MM-DD HH:mm') }}</td>
          <td>
            <i class="fa-solid fa-eye"></i> {{ board.views }}&nbsp;&nbsp;<i
              class="fa-solid fa-comment"
            ></i>
            {{ board.comments }}&nbsp;&nbsp;<i class="fa-solid fa-thumbs-up"></i> {{ board.likes }}
          </td>
        </tr>
        <router-link :to="{ name: 'board/create' }" class="btn btn-primary">
          <i class="fa-solid fa-pen-to-square"></i> 글 작성
        </router-link>
      </tbody>
    </table>

    <!-- Pagination -->
    <pagination :currentPage="pageNum" :totalPages="totalPage" @page-change="changePage" />
  </div>
</template>

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
    console.log(
      '현재 페이지:',
      pageNum.value,
      '카테고리:',
      category.value,
      '검색어:',
      keyword.value,
      '정렬 기준:',
      sortBy.value
    )
    const data = await getList(pageNum.value, category.value, keyword.value, sortBy.value)
    console.log('내부에서 호출: ', data)
    list.value = data.list || [] // 정책 데이터 초기화
    totalPage.value = data.totalPage || 0 // 총 페이지 수 초기화
    pageNum.value = data.pageNum || 1 // 현재 페이지 초기화
    amount.value = data.amount || 10 // 한 페이지에 몇개?
  } catch (error) {
    console.error('Error loading boards:', error)
  }
}

const searchBoards = async (searchTerm) => {
  console.log('검색어: ', searchTerm, '카테고리: ', category.value)
  keyword.value = searchTerm // 검색어 설정
  pageNum.value = 1 // 첫 페이지로 설정
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
  console.log('부모 페이지: ', page)
  pageNum.value = page // 현재 페이지 업데이트
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
