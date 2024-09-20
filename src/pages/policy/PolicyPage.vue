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
import { ref, computed } from 'vue'
import PolicyCarousel from '@/components/PolicyPage/PolicyCarousel.vue'
import PolicySearch from '@/components/PolicyPage/PolicySearch.vue'
import PolicyFilter from '@/components/PolicyPage/PolicyFilter.vue'
import PolicyList from '@/components/PolicyPage/PolicyList.vue'
import Pagination from '@/components/common/Pagination.vue'

// 추천 정책 데이터
const recommendedPolicies = ref([
  { id: 1, title: '추천 정책 1', description: '청년 일자리 지원 정책입니다.' },
  { id: 2, title: '추천 정책 2', description: '중소기업을 위한 지원 정책입니다.' },
  { id: 3, title: '추천 정책 3', description: '주거 안정화를 위한 정책입니다.' },
  { id: 4, title: '추천 정책 4', description: '교육 지원을 위한 장학금 정책입니다.' },
  { id: 5, title: '추천 정책 5', description: '기술 창업 지원을 위한 정책입니다.' },
  { id: 6, title: '추천 정책 6', description: '복지 향상을 위한 소득 보전 정책입니다.' }
])

// 정책 리스트 데이터
const policies = ref([
  { id: 1, title: '정책 1', category: '주거', date: '2024-09-01', popularity: 100 },
  { id: 2, title: '정책 2', category: '교육', date: '2024-08-15', popularity: 80 },
  { id: 3, title: '정책 3', category: '복지', date: '2024-09-10', popularity: 120 },
  { id: 4, title: '정책 4', category: '일자리', date: '2024-08-20', popularity: 90 }
])

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
    // 'recommended'는 기본 정렬이므로 별도 처리 불필요
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
  // 여기에 페이지 변경 시 데이터를 가져오는 로직을 추가할 수 있습니다.
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
.policy-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.policy-search, .sort-options, .policy-list, .pagination {
  margin-bottom: 30px; /* 각 섹션에 여백 추가 */
}

</style>
