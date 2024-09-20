<template>
  <div class="my-type">
    <h1>나의 자산 관리 유형은 어디?</h1>

    <!-- 자산 및 소비 데이터 입력 -->
    <div class="input-section">
      <h3>자산 및 소비 분석</h3>
      <label>총 자산:</label>
      <input v-model.number="totalAssets" type="number" placeholder="총 자산 입력" />

      <label>총 소비:</label>
      <input v-model.number="totalSpending" type="number" placeholder="총 소비 입력" />

      <label>대출 금액:</label>
      <input v-model.number="loanAmount" type="number" placeholder="대출 금액 입력" />

      <button @click="analyzeType">타입 분석하기</button>
    </div>

    <!-- 분석 결과 표시 -->
    <div v-if="userType" class="result-section">
      <div class="type-result">
        <img :src="typeIcon" alt="type icon" />
        <h3>{{ userType }}</h3>
        <p>{{ typeDescription }}</p>
      </div>
      <h2>KB님은 {{ userType }} 유형입니다.</h2>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalAssets: 0, // 총 자산
      totalSpending: 0, // 총 소비
      loanAmount: 0, // 대출 금액
      userType: '', // 분석 결과로 도출된 타입
      typeIcon: '', // 타입에 따른 아이콘
      typeDescription: '' // 타입에 따른 설명
    }
  },
  methods: {
    // 타입 분석 함수
    analyzeType() {
      if (this.loanAmount > this.totalAssets * 0.5) {
        this.userType = '대출 우선형'
        this.typeIcon = 'loan-icon.png' // 대출 우선형 아이콘
        this.typeDescription =
          '대출 우선형은 대출을 우선적으로 관리하는 유형입니다. 대출을 상환하는 것이 주요 목표입니다.'
      } else if (this.totalSpending > this.totalAssets * 0.7) {
        this.userType = '위험 추구형'
        this.typeIcon = 'risk-icon.png' // 위험 추구형 아이콘
        this.typeDescription =
          '위험 추구형은 소비가 자산에 비해 높으며, 모험적인 자산 운용을 선호하는 유형입니다.'
      } else if (this.totalAssets >= this.totalSpending * 3) {
        this.userType = '안정 추구형'
        this.typeIcon = 'stable-icon.png' // 안정 추구형 아이콘
        this.typeDescription =
          '안정 추구형은 자산을 안전하게 관리하며, 보수적인 투자 방식을 선호하는 유형입니다.'
      } else {
        this.userType = '자산 분산형'
        this.typeIcon = 'diversify-icon.png' // 자산 분산형 아이콘
        this.typeDescription =
          '자산 분산형은 다양한 자산군에 분산 투자하는 것을 선호하는 유형입니다.'
      }
    }
  }
}
</script>

<style scoped>
.my-type {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 10px;
}

h1,
h3 {
  color: #333;
}

.input-section {
  margin-bottom: 20px;
}

input {
  display: block;
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

.result-section {
  margin-top: 20px;
}

.type-result {
  margin-bottom: 20px;
}

.type-result img {
  width: 50px;
  height: 50px;
}

.type-result h3 {
  font-size: 24px;
  margin: 10px 0;
}

.type-result p {
  font-size: 16px;
}
</style>
