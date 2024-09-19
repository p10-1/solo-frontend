<template>
  <div class="policy-page">
    <h2>정책 검색</h2>

    <!-- 추천 정책 Carousel -->
    <PolicyCarousel :policies="recommendedPolicies" />

    <!-- 검색 및 필터 옵션 -->
    <PolicySearch @search="handleSearch" />
    <PolicyFilter :filters="filters" @filter-change="handleFilterChange" />

    <!-- 정렬 옵션 -->
    <div class="sort-options">
      <label v-for="option in sortOptions" :key="option.value">
        <input type="radio" v-model="sortOption" :value="option.value" />
        {{ option.label }}
      </label>
    </div>

    <!-- 정책 리스트 -->
    <PolicyList :policies="filteredAndSortedPolicies" />

    <!-- 페이지네이션 -->
    <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import PolicyCarousel from '@/components/PolicyPage/PolicyCarousel.vue'
import PolicySearch from '@/components/PolicyPage/PolicySearch.vue'
import PolicyFilter from '@/components/PolicyPage/PolicyFilter.vue'
import PolicyList from '@/components/PolicyPage/PolicyList.vue'
import Pagination from '@/components/common/Pagination.vue'

// 추천 정책 데이터 및 전체 정책 리스트
const recommendedPolicies = ref([])
const policies = ref([])

// JSON 서버에서 데이터를 가져와서 설정
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/policies')
    policies.value = response.data
    recommendedPolicies.value = response.data.slice(0, 4) // 추천 정책은 상위 4개로 설정
  } catch (error) {
    console.error('데이터를 불러오는 중 오류가 발생했습니다:', error)
  }
})

// 필터 데이터
const filters = ref({
  정책분야: ['전체', '일자리', '주거', '교육', '문화', '복지', '참여공간'],
  지역: [
    '전체',
    '중앙부처',
    '서울',
    '부산',
    '대구',
    '인천',
    '광주',
    '대전',
    '울산',
    '세종',
    '경기',
    '강원',
    '충북',
    '충남',
    '전북',
    '전남',
    '경북',
    '경남',
    '제주'
  ]
})

// 정렬 옵션 및 페이지네이션
const currentPage = ref(1)
const totalPages = ref(10)
const sortOption = ref('recommended')
const sortOptions = [
  { value: 'recommended', label: '추천순' },
  { value: 'latest', label: '최신순' },
  { value: 'popularity', label: '인기순' }
]

// 검색어
const searchTerm = ref('')

// 선택된 필터
const selectedFilters = ref({
  정책분야: '전체',
  지역: '전체'
})

// 필터링 및 정렬된 정책 목록
const filteredAndSortedPolicies = computed(() => {
  let result = policies.value

  // 검색어 필터링
  if (searchTerm.value) {
    result = result.filter((policy) =>
      policy.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  // 카테고리 필터링
  if (selectedFilters.value.정책분야 !== '전체') {
    result = result.filter((policy) => policy.category === selectedFilters.value.정책분야)
  }

  // 정렬
  switch (sortOption.value) {
    case 'latest':
      result.sort((a, b) => new Date(b.date) - new Date(a.date))
      break
    case 'popularity':
      result.sort((a, b) => b.popularity - a.popularity)
      break
  }

  return result
})

// 검색 처리 함수
const handleSearch = (term) => {
  searchTerm.value = term
  currentPage.value = 1 // 검색 시 첫 페이지로 이동
}

// 필터 변경 처리 함수
const handleFilterChange = (newFilters) => {
  selectedFilters.value = newFilters
  currentPage.value = 1 // 필터 변경 시 첫 페이지로 이동
}

// 페이지 변경 처리 함수
const changePage = (page) => {
  currentPage.value = page
}
</script>

<style scoped>
.policy-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.sort-options {
  margin-top: 10px;
  margin-bottom: 20px;
}

.sort-options label {
  margin-right: 15px;
}

.policy-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>
