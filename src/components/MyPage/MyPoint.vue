<template>
  <div class="point-management">
    <h1>포인트 관리</h1><br /><br />

    <div class="current-points">
      <h3>현재 포인트: {{ points }} P</h3>
    </div>

    <div class="withdraw-section">
      <h3>포인트 출금하기</h3>
      <input v-model.number="withdrawAmount" type="number" placeholder="출금할 포인트" />
      <button @click="withdrawPoints">포인트 출금하기</button>
    </div>

    <!-- 출금 내역 
    <div class="history-section">
      <h3>포인트 출금 내역</h3>
      <ul>
        <li v-for="(withdrawal, index) in withdrawalHistory" :key="index">
          {{ withdrawal.date }} - {{ withdrawal.amount }} P 출금
        </li>
      </ul>
    </div> -->

    <!-- 적립 내역 
    <div class="history-section">
      <h3>포인트 적립 내역</h3>
      <ul>
        <li v-for="(deposit, index) in depositHistory" :key="index">
          {{ deposit.date }} - {{ deposit.amount }} P 적립
        </li>
      </ul>
    </div> -->
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      points: 0,
      withdrawAmount: 0,
    };
  },
  mounted() {
    this.fetchPoints();
  },
  methods: {
    async fetchPoints() {
      try {
        const response = await fetch('/api/mypage/points');
        if (response.ok) {
          const point = await response.json();
          this.points = point;
        } else {
          console.error('Error:', response.statusText);
          alert('회원 정보를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('포인트 조회 오류:', error);
      }
    },

    async withdrawPoints() {
      if (this.withdrawAmount > 0 && this.withdrawAmount <= this.points) {
        try {
          // 전송객체 생성
          const requestData = {
            point: this.withdrawAmount, 
            
          };
          const response = await axios.post('/api/mypage/withdraw',
            requestData,
            {
              withCredentials: true
            });

          if (response.status === 200) {
            this.points -= this.withdrawAmount; 
            this.withdrawAmount = 0; 
            alert('포인트 출금이 성공적으로 완료되었습니다.');
          } else {
            alert('출금 실패');
          }
        } catch (error) {
          console.error('출금 오류:', error);
          alert('출금 중 오류가 발생했습니다.');
        }
      } else {
        alert('출금할 수 없는 금액입니다.');
      }
    },


  },
};
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
