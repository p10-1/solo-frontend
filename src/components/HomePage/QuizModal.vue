<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-header">
        <h4>
          오늘의 <b class="text-accent">퀴즈</b>
          <i class="fa-solid fa-hat-wizard text-accent icon"></i>
        </h4>
        <button type="button" class="close" @click="$emit('close')">
          <span>&times;</span>
        </button>
      </div>
      <div class="modal-content">
        <div class="modal-body">
          <div class="point"><span>참여시 10P 지급</span></div>
          <div class="description">{{ description }}</div>
          <div class="info-text">하루 1번씩 참여할 수 있어요!</div>
          <div class="input-text-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              v-model="userAnswer"
              class="form-control mt-3 quiz-input"
              placeholder="정답을 입력하세요"
            />
            <button class="btn btn-success" @click="checkAnswer">정답 확인</button>
          </div>
        </div>
      </div>
      <div v-if="isCorrect !== null" class="result-body">
        <p class="result-message">
          <i class="fa-regular fa-face-grin-tongue-squint"></i>
          {{ isCorrect ? '맞았습니다!' : '틀렸습니다!' }}
        </p>
        <p class="point-message">{{ isPoint }}</p>
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
.modal-body {
  padding: 25px;
  min-height: 200px;
}

.modal-body .point span {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.5px;
  border: 1px solid #6846f5;
  color: #6846f5;
  padding: 1px 8px;
  line-height: 1;
  border-radius: 20px;
}

.modal-body .description {
  font-size: 1.05rem;
  color: #333;
  word-break: keep-all;
  line-height: 28px;
  letter-spacing: -1px;
  font-weight: 500;
  margin: 10px 0;
}

.modal-body .info-text {
  color: #6846f5;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.modal-body .input-text-box {
  position: relative;
  margin-top: 25px;
  display: flex;
  margin-bottom: 10px;
}

.modal-body .input-text-box i {
  position: absolute;
  margin-top: 28px;
  margin-left: 15px;
  z-index: 12;
  font-size: 21px;
  color: #666;
}

.modal-body .quiz-input {
  padding-left: 40px;
  border: 2px solid #e4deff;
  background-color: #e4deff;
  border-radius: 12px;
  font-size: 1rem;
  letter-spacing: -1px;
}

.modal-body .btn-success {
  margin-left: 10px;
  text-wrap: nowrap;
  margin-top: 17px;
  padding: 12px 20px;
  line-height: 1;
  border-radius: 12px;
  background-color: #6846f5;
  border: none;
}

.result-body {
  padding: 10px 25px 20px;
  border-top: 1px dashed #e8e8e8;
}

.result-message {
  font-size: 1.15rem;
  margin-top: 15px;
  font-weight: 600;
  letter-spacing: -1px;
  color: #e32626;
}

.point-message {
  font-size: 1.15rem;
  margin-top: 15px;
  margin-top: 10px;
  font-weight: 600;
  letter-spacing: -1px;
  color: #6846f5;
}
</style>
