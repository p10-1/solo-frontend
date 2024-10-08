<template>
  <div class="quiz-container">
    <h3 class="main-title">오늘의 금융 퀴즈</h3>
    <div class="quiz-card" @click="openModal">
      <div v-if="description" class="quiz-description">
        <div class="hiding">
          <p>{{ description }}</p>
          <div class="button-main">참여하기</div>
        </div>
      </div>
      <div class="loading" v-else>
        <div>
          <i class="fa-solid fa-spinner margin-bottom-1rem"></i>
          퀴즈를 불러오는 중입니다...
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
  width: 100%;
  padding: 2rem 1.7rem;
}

.quiz-card {
  margin-top: 15px;
  width: 100%;
  padding: 1rem;
  border-radius: 25px;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  cursor: pointer;
}

.quiz-card:hover {
  transform: translateY(-10px); /* 호버 시 살짝 올라가는 효과 */
}

.quiz-description {
  position: relative;
  padding: 0 2rem;
  min-height: 80px;
  font-size: 1.05rem;
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

.card-body .loading {
  line-height: 2rem;
  font-size: 18px;
  letter-spacing: -1px;
  text-align: center;
  font-weight: 400;
}
.card-body .loading i {
  display: block;
  margin-bottom: 10px;
}
</style>
