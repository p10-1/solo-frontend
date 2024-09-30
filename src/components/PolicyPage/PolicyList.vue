<template>
  <div class="infinite-scroll">
    <h1>정책 목록</h1>
    <div class="search-bar">
      <!-- SearchBar 컴포넌트 사용 -->
      <SearchBar v-model="keyword" @search="searchPolicies" />
    </div>
    <ul>
      <!-- 정책 항목을 표시 -->
      <PolicyItem v-for="policy in list" :key="policy.bizId" :policy="policy" />
    </ul>

    <!-- 로딩 상태 표시 -->
    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-if="noMoreData" class="no-more">더 이상 데이터가 없습니다.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPolicies } from '@/api/policyApi'
import PolicyItem from '@/components/PolicyPage/PolicyItem.vue'
import SearchBar from '@/components/common/SearchBar.vue'

const list = ref([]) // 정책 목록
const pageNum = ref(1) // 현재 페이지 번호
const totalPage = ref(0) // 총 페이지 수
const keyword = ref('') // 검색어
const loading = ref(false) // 로딩 상태
const noMoreData = ref(false) // 더 이상 불러올 데이터가 없는지 여부

const route = useRoute() // 현재 라우트 정보를 사용

// 정책 데이터를 불러오는 함수 (0.5초 지연 시간 추가, 빠르면 1초로 올리면 됨)
const loadPolicies = async () => {
  if (loading.value || noMoreData.value) return // 로딩 중이거나 더 이상 데이터가 없을 때는 실행하지 않음
  loading.value = true // 로딩 상태

  setTimeout(async () => {
    try {
      const data = await fetchPolicies(pageNum.value, keyword.value)
      if (data.list.length > 0) {
        // 정책 데이터를 리스트로 계속 추가하는 작업
        list.value = [...list.value, ...data.list]
        totalPage.value = data.totalPage
        pageNum.value++
      } else {
        noMoreData.value = true // 더 이상 불러올 데이터가 없음을 표시
      }
    } catch (error) {
      console.error('데이터를 불러오는 중 오류 발생', error)
    } finally {
      loading.value = false // 로딩 상태 종료
    }
  }, 500) // 0.5초 지연
}

// 검색어로 정책을 검색하는 함수
const searchPolicies = async (searchTerm) => {
  keyword.value = searchTerm
  pageNum.value = 1 // 첫 페이지로 설정
  list.value = [] // 기존 데이터 초기화
  noMoreData.value = false // 데이터 유무 상태 초기화
  await loadPolicies() // 새로운 데이터 불러오기
}

// 스크롤 이벤트를 처리하는 함수
const handleScroll = () => {
  const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
  if (scrollBottom && !loading.value) {
    loadPolicies()
  }
}

// 컴포넌트 마운트 시
onMounted(() => {
  // 쿼리 파라미터에서 검색어와 페이지 정보를 읽어옴
  keyword.value = route.query.keyword || ''
  pageNum.value = parseInt(route.query.page) || 1

  // 첫 데이터 로드
  loadPolicies()

  // 스크롤 이벤트 리스너 추가
  window.addEventListener('scroll', handleScroll)
})

// 컴포넌트 언마운트 시 스크롤 이벤트 리스너 제거
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 스타일링 추가 */
.loading {
  text-align: center;
  padding: 20px;
  color: gray;
}
.no-more {
  text-align: center;
  padding: 20px;
  color: gray;
}
</style>
