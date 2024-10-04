<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">오늘의 퀴즈</h5>
          <button type="button" class="close" @click="$emit('close')">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p class="description"><strong>설명:</strong> {{ description }}</p>
          <input
            type="text"
            v-model="userAnswer"
            class="form-control mt-3 quiz-input"
            placeholder="정답을 입력하세요"
          />
        </div>
        <div class="modal-footer">
          <button class="btn btn-success" @click="checkAnswer">정답 확인</button>
          <button class="btn btn-secondary" @click="$emit('close')">닫기</button>
        </div>
        <div v-if="isCorrect !== null" class="result-body">
          <p class="result-message">
            <strong>정답:</strong> {{ isCorrect ? '맞았습니다!' : '틀렸습니다.' }}
          </p>
          <p class="point-message">{{ isPoint }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { submitAnswer } from '@/api/quizApi'

const props = defineProps({
  answer: String,
  description: String
})

const userAnswer = ref('')
const isCorrect = ref(null)
const isPoint = ref(null)
const removeAllSpaces = (str) => str.replace(/\s+/g, '')
const authStore = useAuthStore()

const checkAnswer = async () => {
  const cleanedUserAnswer = removeAllSpaces(userAnswer.value)
  const cleanedCorrectAnswer = removeAllSpaces(props.answer)

  isCorrect.value = cleanedUserAnswer === cleanedCorrectAnswer

  // 정답을 맞춘 경우 백엔드에 데이터 전송
  if (isCorrect.value) {
    try {
      const response = await submitAnswer(authStore.userInfo.userId)
      isPoint.value = response
    } catch (error) {
      console.error('정답 제출 실패:', error)
    }
  }
}
</script>

<style scoped>
/* 모달 오버레이 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5); /* 배경 투명도 */
  z-index: 1050;
}

.modal-dialog {
  max-width: 600px;
  width: 100%;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background-color: #007bff;
  padding: 20px;
}

.modal-title {
  font-size: 1.5rem;
  margin: 0;
}

.close {
  cursor: pointer;
  font-size: 1.2rem;
  color: white;
}

.modal-body {
  padding: 20px;
}

.description {
  font-size: 1rem;
  color: #333;
  margin-bottom: 10px;
}

.quiz-input {
  padding: 12px;
  border: 2px solid #007bff;
  border-radius: 8px;
  font-size: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: #f1f1f1;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.result-body {
  padding: 20px;
}

.result-message {
  font-size: 1.2rem;
  margin-top: 15px;
}

.point-message {
  font-size: 1rem;
  margin-top: 10px;
}
</style>
