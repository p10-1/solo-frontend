<template>
  <div class="quiz-container mt-5">
    <div class="quiz-card card" @click="openModal">
      <div class="card-body text-center">
        <h1 class="card-title">오늘의 금융 퀴즈</h1>
        <div v-if="description" class="quiz-description">
          <p><strong>설명:</strong> {{ description }}</p>
        </div>
        <div class="quiz-loading" v-else>
          <p>퀴즈를 불러오는 중입니다...</p>
        </div>
      </div>
    </div>

    <QuizModal
      v-if="isModalVisible"
      :answer="answer"
      :description="description"
      :quizNo="quizNo"
      @close="isModalVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { makeQuiz } from '@/api/quizApi'
import QuizModal from './QuizModal.vue'

const answer = ref('')
const description = ref('')
const quizNo = ref('')
const isModalVisible = ref(false)
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  try {
    const quizData = await makeQuiz()
    console.log(quizData)
    answer.value = quizData.term
    description.value = quizData.description
    quizNo.value = quizData.quizNo
  } catch (error) {
    console.error('퀴즈를 불러오는 데 실패했습니다.', error)
  }
})

const openModal = () => {
  if (authStore.isLoggedIn) {
    isModalVisible.value = true
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
.quiz-container {
  display: flex;
  justify-content: center;
}

.quiz-card {
  max-width: 400px; /* 가로 크기 조정 */
  width: 100%;
  border: 2px solid #007bff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  background-color: #f9f9f9;
}

.quiz-card:hover {
  transform: translateY(-5px); /* 호버 시 살짝 올라가는 효과 */
}

.card-title {
  font-size: 1.8rem; /* 제목 크기 */
  color: #007bff; /* 퀴즈 느낌 살리기 위해 파란색 적용 */
  margin-bottom: 20px;
}

.quiz-description {
  font-size: 1rem;
  color: #333;
}

.text-center {
  text-align: center;
}

.card-body {
  padding: 20px;
}
</style>
