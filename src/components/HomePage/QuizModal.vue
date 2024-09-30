<template>
  <div
    class="modal fade show"
    tabindex="-1"
    role="dialog"
    style="display: block"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-lg" role="document">
      <!-- modal-lg 클래스를 사용하여 더 큰 모달 -->
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <!-- 배경색과 텍스트 색 변경 -->
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  answer: String,
  description: String
})

const userAnswer = ref('')
const isCorrect = ref(null)

const removeAllSpaces = (str) => str.replace(/\s+/g, '')

const checkAnswer = () => {
  const cleanedUserAnswer = removeAllSpaces(userAnswer.value) // 사용자 입력의 모든 공백 제거
  const cleanedCorrectAnswer = removeAllSpaces(props.answer) // 정답의 모든 공백 제거

  console.log('사용자의 입력:', cleanedUserAnswer)
  console.log('정답:', cleanedCorrectAnswer)

  // 정답 확인
  isCorrect.value = cleanedUserAnswer === cleanedCorrectAnswer
}
</script>

<style scoped>
.modal.fade.show {
  display: block; /* 모달을 보여줍니다 */
}

.modal-dialog {
  max-width: 800px; /* 더 큰 모달 너비 */
}

.modal-header {
  background-color: #007bff; /* 부트스트랩의 primary 색상 */
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
  border-radius: 5px; /* 입력 필드의 모서리 둥글게 */
}
</style>
