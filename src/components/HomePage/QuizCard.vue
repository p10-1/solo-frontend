<template>
  <div class="quiz-container">
    <div class="quiz-box" v-if="!answered">
      <h2>{{ question.title }}</h2>
      <ul class="options-list">
        <li v-for="(option, index) in question.options" :key="index">
          <button class="option-button" @click="submitAnswer(index)">{{ option }}</button>
        </li>
      </ul>
    </div>
    <div v-else class="result-box">
      <p class="result-message">{{ resultMessage }}</p>
      <p v-if="isCorrect" class="score-message">포인트: {{ points }}점</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      question: {
        title: "IPO에서 'IPO'의 약자는 무엇인가요?",
        options: [
          'Initial Public Offering',
          'International Purchase Option',
          'Investment Payout Option',
          'Internal Public Organization'
        ],
        correctAnswer: 0
      },
      answered: false,
      isCorrect: false,
      points: 0,
      resultMessage: ''
    }
  },
  methods: {
    submitAnswer(index) {
      this.answered = true
      if (index === this.question.correctAnswer) {
        this.isCorrect = true
        this.points += 10 // 정답 시 부여할 점수
        this.resultMessage = '정답입니다!'
      } else {
        this.resultMessage =
          '틀렸습니다. 정답은: ' + this.question.options[this.question.correctAnswer]
      }
    }
  }
}
</script>

<style scoped>
/* 퀴즈 컨테이너 스타일 */
.quiz-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
}

/* 퀴즈 박스 스타일 */
.quiz-box h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.options-list {
  list-style-type: none;
  padding: 0;
}

.option-button {
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.option-button:hover {
  background-color: #0056b3;
}

/* 결과 박스 스타일 */
.result-box {
  text-align: center;
}

.result-message {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.score-message {
  font-size: 20px;
  color: #28a745;
}

/* 점수 및 결과 스타일 */
.score {
  font-size: 32px;
  font-weight: bold;
  color: #28a745;
}
</style>
