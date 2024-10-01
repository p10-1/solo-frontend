<template>
  <div
    class="modal fade show"
    tabindex="-1"
    role="dialog"
    style="display: block"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">퀴즈</h5>
          <button type="button" class="close" @click="$emit('close')">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p class="font-weight-bold"><strong>설명:</strong> {{ description }}</p>
          <input
            type="text"
            v-model="userAnswer"
            class="form-control mt-3"
            placeholder="정답을 입력하세요"
          />
        </div>
        <div class="modal-footer">
          <button class="btn btn-success" @click="checkAnswer">정답 확인</button>
          <button class="btn btn-secondary" @click="$emit('close')">닫기</button>
        </div>
        <div v-if="isCorrect !== null" class="modal-body">
          <p class="mt-2"><strong>정답:</strong> {{ isCorrect ? '맞았습니다!' : '틀렸습니다.' }}</p>
          <p class="mt-2">{{ isPoint }}</p>
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
      console.log(authStore.userInfo.userId)
      const response = await submitAnswer(authStore.userInfo.userId)
      isPoint.value = response
    } catch (error) {
      console.error('정답 제출 실패:', error)
    }
  }
}
</script>

<style scoped>
.modal.fade.show {
  display: block;
}

.modal-dialog {
  max-width: 800px;
}

.modal-header {
  background-color: #007bff;
}

.modal-title {
  margin: 0;
}

.close {
  cursor: pointer;
}

.modal-body {
  display: flex;
  flex-direction: column;
}

input {
  border-radius: 5px;
}
</style>
