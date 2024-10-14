<template>
  <div class="quiz-container">
    <h3 class="main-title">
      오늘의 금융 퀴즈
      <span class="text-accent"
        ><i class="fa-solid fa-question"></i><i class="fa-solid fa-exclamation"></i
      ></span>
    </h3>
    <div class="quiz-card" @click="openModal">
      <div v-if="description" class="quiz-description">
        <p>{{ description }}</p>
        <div class="button-main">참여하기</div>
      </div>
      <div class="loading" v-else>
        <i class="fa-solid fa-spinner margin-bottom-1rem"></i>
        퀴즈를 불러오는 중입니다...
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
  width: 100%;
  padding: 1rem 0;
}
.quiz-card {
  margin-top: 16px;
  width: 100%;
  padding: 2rem 1rem;
  border-radius: 25px;
  text-align: center;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
  transition: all 0.3s;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  cursor: pointer;
}
.quiz-card:hover {
  transform: translateY(-10px);
}

.quiz-card:hover .quiz-description p {
  font-weight: 600;
  color: #6846f5;
}
.quiz-card .quiz-description {
  position: relative;
  height: 6.15rem;
  padding: 0 1rem;
}
.quiz-card .quiz-description p {
  font-size: 1.05rem;
  line-height: 1.45rem;
  word-break: keep-all;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
}

.quiz-card .quiz-description .button-main {
  position: absolute;
  transform: translateX(-50%);
  bottom: 0;
  height: 40px;
  line-height: 37px;
  background: linear-gradient(to right top, #7d64da, #a686f3);
  border-color: #cfc6fd;
}
.quiz-card:hover .button-main {
  background-color: #6846f5;
}

.quiz-card .loading {
  line-height: 2rem;
  font-size: 18px;
  letter-spacing: -1px;
  text-align: center;
  font-weight: 400;
}
.quiz-card .loading i {
  display: block;
  margin-bottom: 10px;
}
</style>
