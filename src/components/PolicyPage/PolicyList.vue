<template>
  <div class="infinite-scroll">
    <h1>정책 목록</h1>
    <div class="search-bar">
      <!-- SearchBar 컴포넌트 사용 -->
      <SearchBar v-model="keyword" @search="searchPolicies" />
    </div>
    <div class="policy-list">
      <PolicyItem v-for="policy in list" :key="policy.bizId" :policy="policy" />
    </div>
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

const list = ref([])
const pageNum = ref(1)
const totalPage = ref(0)
const keyword = ref('')
const loading = ref(false)
const noMoreData = ref(false)

const route = useRoute()

const loadPolicies = async () => {
  if (loading.value || noMoreData.value) return
  loading.value = true

  setTimeout(async () => {
    try {
      const data = await fetchPolicies(pageNum.value, keyword.value)
      if (data.list.length > 0) {
        list.value = [...list.value, ...data.list]
        totalPage.value = data.totalPage
        pageNum.value++
      } else {
        noMoreData.value = true
      }
    } catch (error) {
      console.error('데이터를 불러오는 중 오류 발생', error)
    } finally {
      loading.value = false
    }
  }, 500)
}

const searchPolicies = async (searchTerm) => {
  keyword.value = searchTerm
  pageNum.value = 1
  list.value = []
  noMoreData.value = false
  await loadPolicies()
}

const handleScroll = () => {
  const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
  if (scrollBottom && !loading.value) {
    loadPolicies()
  }
}

onMounted(() => {
  keyword.value = route.query.keyword || ''
  pageNum.value = parseInt(route.query.page) || 1
  loadPolicies()
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
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
.policy-list {
  display: flex; /* Flexbox를 사용하여 수평 정렬 */
  flex-wrap: wrap; /* 여러 줄로 감싸기 */
  justify-content: space-between; /* 항목 간의 간격을 동일하게 설정 */
}

.policy-list > * {
  width: calc(50% - 16px); /* 각 항목의 너비를 50%로 설정하고 간격을 고려 */
  margin-bottom: 20px; /* 아래 여백 추가 */
}
</style>
