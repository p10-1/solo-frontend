<template>
  <div class="quiz-container">
    <h2>퀴즈 목록</h2>
    <ul v-if="quizzes.length">
      <li v-for="quiz in quizzes" :key="quiz.quizNo" class="quiz-item">
        <h3 class="quiz-question">{{ quiz.question }}</h3>
        <ul class="options">
          <li
            v-for="(option, index) in [quiz.optionA, quiz.optionB, quiz.optionC, quiz.optionD]"
            :key="index"
            class="option-item"
          >
            {{ option }}
          </li>
        </ul>
      </li>
    </ul>
    <p v-else>퀴즈를 불러오는 중입니다...</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      quizzes: []
    }
  },
  mounted() {
    axios
      .get('http://localhost:9000/api/quizzes')
      .then((response) => {
        this.quizzes = response.data
      })
      .catch((error) => {
        console.error('퀴즈 데이터를 가져오는 중 오류 발생:', error)
      })
  }
}
</script>

<style scoped>
.quiz-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.quiz-container h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.quiz-item {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  transition: transform 0.2s ease-in-out;
}

.quiz-item:hover {
  transform: translateY(-5px);
}

.quiz-question {
  font-size: 1.2em;
  color: #333333;
  margin-bottom: 15px;
}

.options {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.option-item {
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.option-item:hover {
  background-color: #dce775;
}

p {
  text-align: center;
  color: #888888;
  font-size: 1em;
}
</style>
