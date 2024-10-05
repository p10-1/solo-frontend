<template>
  <div class="infinite-scroll">
    <h1>정책 목록</h1>

    <div class="filter-bar">
      <label> <input type="radio" value="0" v-model="policyType" /> 전체 </label>
      <label> <input type="radio" value="주거" v-model="policyType" /> 주거 </label>
      <label> <input type="radio" value="일자리" v-model="policyType" /> 일자리 </label>
      <label> <input type="radio" value="교육" v-model="policyType" /> 교육 </label>
      <label> <input type="radio" value="복지문화" v-model="policyType" /> 복지문화 </label>
      <label> <input type="radio" value="참여권리" v-model="policyType" /> 참여권리 </label>
    </div>

    <div class="search-bar">
      <SearchBar v-model="keyword" @search="searchPolicies" />
    </div>

    <div class="policy-list">
      <PolicyItem v-for="policy in list" :key="policy.bizId" :policy="policy" />
    </div>

    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-if="noMoreData" class="no-more">더 이상 데이터가 없습니다.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
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
const policyType = ref('0') // 선택된 정책 유형을 저장

const route = useRoute()

const loadPolicies = async () => {
  if (loading.value || noMoreData.value) return
  loading.value = true

  setTimeout(async () => {
    try {
      const data = await fetchPolicies(pageNum.value, keyword.value, policyType.value) // 정책 유형 추가
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

watch([policyType, keyword], async () => {
  pageNum.value = 1
  list.value = []
  noMoreData.value = false
  await loadPolicies()
})

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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.policy-list > * {
  width: calc(50% - 16px);
  margin-bottom: 20px;
}

.filter-bar {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.filter-bar label {
  font-size: 16px;
  cursor: pointer;
}

.filter-bar input[type='radio'] {
  margin-right: 5px;
}
</style>
