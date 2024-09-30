<template>
  <div class="board-list">
    <!-- Search Bar -->
    <search-bar v-model="keyword" @search="searchBoards" />

    <!-- Board List -->
    <table class="table">
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>내용</th>
          <th>작성자</th>
          <th>작성일</th>
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
          <td>{{ board.content }}</td>
          <td>{{ board.userId }}</td>
          <td>{{ board.regDate }}</td>
        </tr>
        <router-link :to="{ name: 'board/create' }" class="btn btn-primary"
          ><i class="fa-solid fa-pen-to-square"></i> 글 작성</router-link
        >
      </tbody>
    </table>

    <!-- Pagination -->
    <pagination :current-page="pageNum" :totalPages="totalPage" @page-change="changePage" />
  </div>
</template>

<style></style>

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
const category = ref('content')
const keyword = ref('')
const amount = ref(10)
const router = useRouter()
const route = useRoute()

const loadBoards = async () => {
  try {
    console.log('현재 페이지:', pageNum.value, '검색어:', keyword.value)
    const data = await getList(pageNum.value, category.value, keyword.value)
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
  console.log('검색어: ', searchTerm)
  keyword.value = searchTerm // 검색어 설정
  pageNum.value = 1 // 첫 페이지로 설정
  await router.push({
    path: '/board',
    query: { keyword: keyword.value, page: pageNum.value }
  })
  await loadBoards()
}

const changePage = async (page) => {
  console.log('부모 페이지: ', page)
  pageNum.value = page // 현재 페이지 업데이트
  await router.push({
    path: '/board',
    query: { keyword: keyword.value, page: pageNum.value }
  })
  await loadBoards()
}

onMounted(() => {
  keyword.value = route.query?.keyword || ''
  pageNum.value = parseInt(route.query?.page) || 1
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
