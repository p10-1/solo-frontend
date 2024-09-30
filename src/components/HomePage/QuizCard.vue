<template>
  <div class="container mt-5">
    <div class="card" @click="openModal">
      <!-- 카드 클릭 시 모달 열기 -->
      <div class="card-body">
        <h1 class="card-title">오늘의 금융 퀴즈</h1>
        <div v-if="description">
          <p><strong>설명:</strong> {{ description }}</p>
        </div>
        <div v-else>
          <p>퀴즈를 불러오는 중입니다...</p>
        </div>
      </div>
    </div>

    <!-- 퀴즈 모달 컴포넌트 -->
    <QuizModal
      v-if="isModalVisible"
      :answer="answer"
      :description="description"
      @close="isModalVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // Vue Router 가져오기
import { useAuthStore } from '@/stores/authStore' // authStore 가져오기
import { makeQuiz } from '@/api/quizApi'
import QuizModal from './QuizModal.vue' // 퀴즈 모달 컴포넌트 임포트

// 상태 변수 정의
const answer = ref('')
const description = ref('')
const isModalVisible = ref(false) // 모달 표시 상태
const router = useRouter() // router 인스턴스 가져오기
const authStore = useAuthStore() // authStore 인스턴스 가져오기

// 컴포넌트가 생성될 때 퀴즈 데이터를 불러옴
onMounted(async () => {
  try {
    const quizData = await makeQuiz()
    console.log(quizData)
    answer.value = quizData.term
    description.value = quizData.description
    console.log('answer: ', answer.value, 'description: ', description.value)
  } catch (error) {
    console.error('퀴즈를 불러오는 데 실패했습니다.', error)
  }
})

// 모달 열기 함수
const openModal = () => {
  // 로그인 상태 확인
  if (authStore.isLoggedIn) {
    isModalVisible.value = true // 모달 표시
  } else {
    router.push('/login') // 로그인 페이지로 이동
  }
}
</script>

<style scoped>
.card {
  border-radius: 8px;
  cursor: pointer; /* 클릭 가능하게 표시 */
}
</style>
