<template>
  <div class="quiz-card">
    <h2>{{ quiz.question }}</h2>

    <div class="options">
      <button v-for="(option, index) in options" :key="index" @click="selectOption(option)">
        {{ option }}
      </button>
    </div>

    <div v-if="isAnswered">
      <p v-if="isCorrect" class="correct">Correct Answer!</p>
      <p v-else class="incorrect">Wrong Answer! Correct answer is: {{ quiz.correctOption }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'QuizCard',
  data() {
    return {
      quiz: {}, // 퀴즈 데이터를 저장
      selectedOption: null, // 사용자가 선택한 옵션
      isAnswered: false, // 퀴즈에 대한 응답 여부
      isCorrect: false // 정답 여부
    }
  },
  computed: {
    // 옵션 배열을 만들어주는 computed 속성
    options() {
      return [this.quiz.optionA, this.quiz.optionB, this.quiz.optionC, this.quiz.optionD]
    }
  },
  methods: {
    // 옵션 선택 시 호출되는 메서드
    selectOption(option) {
      this.selectedOption = option
      this.isAnswered = true
      this.isCorrect = option === this.quiz.correctOption // 정답 여부 확인
    },
    // 퀴즈 데이터를 백엔드에서 가져옴
    fetchQuiz() {
      axios
        .get('http://localhost:9000/api/quiz/list') // API 경로 조정 필요
        .then((response) => {
          this.quiz = response.data[0] // 첫 번째 퀴즈를 가져옴 (실제 로직에 맞게 변경 가능)
        })
        .catch((error) => {
          console.error('Error fetching quiz data:', error)
        })
    }
  },
  mounted() {
    this.fetchQuiz() // 컴포넌트가 로드되었을 때 퀴즈 데이터를 가져옴
  }
}
</script>

<style scoped>
.quiz-card {
  border: 1px solid #ddd;
  padding: 20px;
  margin: 20px;
  max-width: 400px;
}

.options button {
  display: block;
  width: 100%;
  margin: 10px 0;
}

.correct {
  color: green;
}

.incorrect {
  color: red;
}
</style>
