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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { makeQuiz } from '@/api/quizApi'
import QuizModal from './QuizModal.vue'

const answer = ref('')
const description = ref('')
const isModalVisible = ref(false)
const router = useRouter()
const authStore = useAuthStore()

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

const openModal = () => {
  if (authStore.isLoggedIn) {
    isModalVisible.value = true
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
.card {
  border-radius: 8px;
  cursor: pointer;
}
</style>
