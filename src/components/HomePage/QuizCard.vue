<template>
  <div class="quiz-container">
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
            <div class="button-main">참여하기</div>
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
  width: 100%;
}
.card-body {
  padding: 40px 20px 10px;
}

.quiz-card {
  width: 100%;
  background: linear-gradient(320deg, #7d64da 20.02%, #a686f3);
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

.quiz-title-box .card-title {
  font-size: 1.4rem;
  color: #ffffff;
  word-break: break-all;
  letter-spacing: -1px;
  font-weight: 500;
  margin: 5px 0 10px;
}

.quiz-title-box .decoration {
  color: #f7d095;
  position: absolute;
  top: -1.5rem;
  margin-right: 90px;
  transform: rotate(40deg);
  font-size: 36px;
  right: 3.9vw;
}

.quiz-description {
  position: relative;
  padding: 0 2rem;
  min-height: 80px;
  font-size: 1.05rem;
  color: #ffffff;
  word-break: keep-all;
  line-height: 28px;
  letter-spacing: -1px;
  font-weight: 400;
  margin: 10px 0 0;
}

.quiz-card .button-main {
  margin-left: 0;
  height: 40px;
  background-color: #f7d095;
  color: #222;
  line-height: 37px;
  margin-bottom: 1.2rem;
}

.card-body .quiz-loading {
  display: flex;
  justify-content: space-around;
}
.card-body .quiz-loading p {
  font-size: 18px;
  letter-spacing: -1px;
  text-align: center;
  color: #fff;
}
</style>
