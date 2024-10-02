<template>
<<<<<<< HEAD
  <div class="financial-quiz">
    <div class="title-box">
      <h2 class="title">금융 퀴즈</h2>
      <span>10-02일</span>
    </div>
    <div class="quiz-question">
      <p class="text">{{ currentQuestion.text }}</p>
      <div class="quiz-options margin-top-1rem">
        <button @click="submitAnswer(true)" class="option-button correct">그렇다</button>
        <button @click="submitAnswer(false)" class="option-button incorrect">아니다</button>
      </div>
    </div>
    <div class="quiz-submit">
      <div>
        <div><b>정답</b>입니다!</div>
        <div>point 10점</div>
        <p>정답에 대한 설명 설명</p>
=======
  <div class="container mt-5">
    <div class="card" @click="openModal">
      <div class="card-body">
        <h1 class="card-title">오늘의 금융 퀴즈</h1>
        <div v-if="description">
          <p><strong>설명:</strong> {{ description }}</p>
        </div>
        <div v-else>
          <p>퀴즈를 불러오는 중입니다...</p>
        </div>
>>>>>>> dev
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
<<<<<<< HEAD
/* .financial-quiz {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
=======
.card {
>>>>>>> dev
  border-radius: 8px;
  cursor: pointer;
}
<<<<<<< HEAD

.correct {
  background-color: #4caf50; /* Green
 }

.incorrect {
  background-color: #f44336; /* Red
} */
=======
>>>>>>> dev
</style>
