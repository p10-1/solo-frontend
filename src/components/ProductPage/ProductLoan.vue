<template>
  <div>
    <h1>대출 상품 리스트</h1>
    <ul v-if="displayedLoans.length">
      <li v-for="loan in displayedLoans" :key="loan.fin_prdt_cd">
        <h2>{{ loan.fin_prdt_nm }} ({{ loan.kor_co_nm }})</h2>
        <p>대출 한도: {{ loan.loan_lmt }}</p>
        <p>가입 방법: {{ loan.join_way }}</p>
        <p>조기 상환 수수료: {{ loan.erly_rpay_fee }}</p>
        <p>대출 금리: {{ loan.dly_rate }}</p>
      </li>
    </ul>
    <p v-else>대출 상품이 없습니다.</p>
    <p v-if="loading">로딩 중...</p>
    <p v-if="noMoreData">더 이상 데이터가 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getRentHouseLoan } from '@/api/productApi'

// 전체 데이터 (이미 로드된 상태)
const loans = ref([]) // 전체 대출 상품 리스트
const displayedLoans = ref([]) // 현재 화면에 표시되는 대출 상품 리스트
const pageNum = ref(1) // 현재 페이지 번호
const loading = ref(false) // 로딩 상태
const noMoreData = ref(false) // 더 이상 데이터가 없을 때

// 전체 데이터를 로드하는 함수 (처음 한 번만 호출)
const loadAllLoans = async () => {
  try {
    loans.value = await getRentHouseLoan('020000') // 전체 데이터 가져오기
    updateDisplayedLoans() // 표시할 데이터 업데이트
  } catch (error) {
    console.error('대출 상품을 가져오는 데 오류가 발생했습니다:', error)
  }
}

// 화면에 표시할 데이터 업데이트 함수
const updateDisplayedLoans = () => {
  const startIndex = (pageNum.value - 1) * 10 // 현재 페이지의 시작 인덱스
  displayedLoans.value = loans.value.slice(0, startIndex + 10) // 10개씩 잘라서 표시
}

// 스크롤 이벤트 처리 함수
let isFetching = false // 데이터를 가져오고 있는지 여부
const handleScroll = () => {
  const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
  if (scrollBottom && !loading.value && !noMoreData.value && !isFetching) {
    isFetching = true // 데이터 가져오기 시작
    setTimeout(() => {
      loading.value = true // 로딩 시작
      pageNum.value++ // 페이지 번호 증가
      if (displayedLoans.value.length < loans.value.length) {
        updateDisplayedLoans() // 새로운 데이터 표시
      } else {
        noMoreData.value = true // 더 이상 데이터가 없는 경우
      }
      loading.value = false // 로딩 종료
      isFetching = false // 데이터 가져오기 완료
    }, 500) // 0.5초 지연
  }
}

onMounted(() => {
  loadAllLoans() // 전체 데이터 로딩
  window.addEventListener('scroll', handleScroll) // 스크롤 이벤트 리스너 추가
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll) // 컴포넌트 언마운트 시 리스너 제거
})
</script>
