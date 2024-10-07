<template>
  <div class="infinite-container infinite-scroll">
    <h2 class="title">청년 <span class="text-accent font-weigth-300">추천 정책</span> 목록</h2>
    <div class="search-bar">
      <SearchBar v-model="keyword" @search="searchPolicies" />
    </div>
    <div class="filter-bar margin-top-1rem margin-bottom-1rem">
      <input type="radio" id="all" value="0" v-model="policyType" />
      <label :class="{ active: policyType === '0' }" for="all">전체</label>

      <input type="radio" id="housing" value="주거" v-model="policyType" />
      <label :class="{ active: policyType === '주거' }" for="housing">주거</label>

      <input type="radio" id="job" value="일자리" v-model="policyType" />
      <label :class="{ active: policyType === '일자리' }" for="job">일자리</label>

      <input type="radio" id="education" value="교육" v-model="policyType" />
      <label :class="{ active: policyType === '교육' }" for="education">교육</label>

      <input type="radio" id="welfare" value="복지문화" v-model="policyType" />
      <label :class="{ active: policyType === '복지문화' }" for="welfare">복지문화</label>

      <input type="radio" id="rights" value="참여권리" v-model="policyType" />
      <label :class="{ active: policyType === '참여권리' }" for="rights">참여권리</label>
    </div>

    <div class="policy-list margin-top-1rem">
      <PolicyItem v-for="policy in list" :key="policy.bizId" :policy="policy" />
    </div>
    <div v-if="loading" class="loading margin-top-3rem">
      <i class="fa-solid fa-spinner margin-bottom-1rem"></i><br />로딩 중...
    </div>
    <div v-if="noMoreData" class="no-more">
      <i class="fa-solid fa-xmark argin-bottom-1rem"></i><br />정책이 더 이상 없습니다.
    </div>
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
/* 리스트 */
.policy-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 17px;
  background: linear-gradient(180deg, #f3f3ff 63.02%, #fff);
  padding: 1.5rem;
  min-height: 3rem;
  border-radius: 28px 28px 0 0;
}

.policy-list > * {
  flex: 0 0 calc(33.8% - 17px);
  box-sizing: border-box;
}
</style>
