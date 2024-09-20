<template>
  <div class="point-management">
    <h1>포인트 관리</h1>

    <!-- 현재 포인트 표시 -->
    <div class="current-points">
      <h3>현재 포인트: {{ points }} P</h3>
    </div>

    <!-- 포인트 출금 -->
    <div class="withdraw-section">
      <h3>포인트 출금하기</h3>
      <input v-model.number="withdrawAmount" type="number" placeholder="출금할 포인트" />
      <button @click="withdrawPoints">출금</button>
    </div>

    <!-- 출금 내역 -->
    <div class="history-section">
      <h3>포인트 출금 내역</h3>
      <ul>
        <li v-for="(withdrawal, index) in withdrawalHistory" :key="index">
          {{ withdrawal.date }} - {{ withdrawal.amount }} P 출금
        </li>
      </ul>
    </div>

    <!-- 적립 내역 -->
    <div class="history-section">
      <h3>포인트 적립 내역</h3>
      <ul>
        <li v-for="(deposit, index) in depositHistory" :key="index">
          {{ deposit.date }} - {{ deposit.amount }} P 적립
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      points: 10000, // 현재 보유 포인트
      withdrawAmount: 0, // 출금할 포인트 양
      withdrawalHistory: [], // 출금 내역
      depositHistory: [
        { date: '2024-09-01', amount: 5000 },
        { date: '2024-08-20', amount: 3000 },
        { date: '2024-08-10', amount: 2000 }
      ] // 적립 내역 (예시 데이터)
    }
  },
  methods: {
    // 포인트 출금 함수
    withdrawPoints() {
      if (this.withdrawAmount > 0 && this.withdrawAmount <= this.points) {
        this.points -= this.withdrawAmount // 포인트 차감
        this.withdrawalHistory.push({
          date: new Date().toLocaleDateString(),
          amount: this.withdrawAmount
        }) // 출금 내역 저장
        this.withdrawAmount = 0 // 입력 필드 초기화
      } else {
        alert('출금할 수 없는 금액입니다.')
      }
    }
  }
}
</script>

<style scoped>
.point-management {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f0f0f0;
  border-radius: 10px;
}

h1,
h3 {
  color: #333;
}

input {
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
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

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 8px;
  background-color: #e7e7e7;
  margin-bottom: 5px;
  border-radius: 5px;
  text-align: left;
}
</style>
