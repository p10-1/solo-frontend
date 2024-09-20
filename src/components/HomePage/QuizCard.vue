<template>
  <div class="financial-quiz">
    <div class="quiz-question">
      <h3>금융 퀴즈</h3>
      <p>{{ currentQuestion.text }}</p>
    </div>
    <div class="quiz-options">
      <button @click="submitAnswer(true)" class="option-button correct">확인</button>
      <button @click="submitAnswer(false)" class="option-button incorrect">아니요</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentQuestion: {
        id: 1,
        text: 'IPO를 올해하며 1년에 최대 900만원까지 공제받을 수 있나요?'
      }
    }
  },
  methods: {
    submitAnswer(answer) {
      // 여기서 answer를 기반으로 로직 처리
      console.log(`Answer submitted: ${answer}`)
      // 실제 앱에서는 여기서 결과 페이지로 넘어가거나 추가 질문을 로드할 수 있습니다.
    }
  }
}
</script>

<style scoped>
.financial-quiz {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  text-align: center;
}

.quiz-question h3 {
  margin: 0;
  color: #333;
}

.quiz-question p {
  color: #555;
}

.quiz-options {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.option-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.correct {
  background-color: #4caf50; /* Green */
}

.incorrect {
  background-color: #f44336; /* Red */
}
</style>
