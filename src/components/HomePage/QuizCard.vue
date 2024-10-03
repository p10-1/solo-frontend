<template>
  <div class="container mt-5">
    <div class="quiz-card card" @click="openModal">
      <div class="card-body">
        <h2 class="title">오늘의 금융 퀴즈</h2>
        <div class="content" v-if="description">
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
.quiz-card {
  margin-top: 2rem;
}

/* .financial-quiz {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
}

.correct {
  background-color: #4caf50; /* Green
 }

.incorrect {
  background-color: #f44336; /* Red
} */
</style>
