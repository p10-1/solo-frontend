<template>
  <div class="quiz-container mt-5">
    <div class="quiz-card card" @click="openModal">
      <div class="card-body text-center">
        <div class="quiz-title-box">
          <div class="decoration">
            <i class="fa-solid fa-question"></i>
          </div>
          <h3 class="card-title">오늘의 금융 퀴즈</h3>
        </div>
        <div v-if="description" class="quiz-description">
          <div class="hiding">
            <p>{{ description }}</p>
          </div>
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
<style scope></style>

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
.card-body {
  padding: 30px 20px 10px;
}

.quiz-card {
  width: 100%;
  background-color: #eadefb;
  border: none;
  border-radius: 14px;
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15); */
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.quiz-card:hover {
  transform: translateY(-5px); /* 호버 시 살짝 올라가는 효과 */
}

.quiz-title-box {
  position: relative;
}

.quiz-title-box .decoration {
  color: #222;
  position: absolute;
  top: -1.5rem;
  transform: rotate(40deg);
  font-size: 36px;
  right: 3.9vw;
}

.quiz-title-box .card-title {
  font-size: 1.25rem;
  color: #222;
  word-break: break-all;
  letter-spacing: -1px;
  font-weight: 500;
  margin: 5px 0 15px;
}

.quiz-description {
  position: relative;
  min-height: 80px;
  font-size: 1.05rem;
  color: #333;
  word-break: keep-all;
  line-height: 28px;
  letter-spacing: -1px;
  font-weight: 500;
  margin: 10px 0;
}

.quiz-description .hiding {
  padding: 15px;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(230 213 255);
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
  filter: blur(3px);
}

.card-body .quiz-loading {
  display: flex;
  justify-content: space-around;
}
.card-body .quiz-loading p {
  font-size: 18px;
  letter-spacing: -1px;
  text-align: center;
  color: #666;
}
</style>
