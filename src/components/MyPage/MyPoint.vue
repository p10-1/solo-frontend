<template>
  <div class="container mt-5 point-management">
    <h3 class="text-center">포인트 관리</h3>
    <br />

    <div class="current-points">
      현재 포인트: {{ points }} P
    </div>

    <div class="withdraw-section mt-4">
      포인트 출금하기
      <div class="form-group">
        <div class="d-flex">
          <select v-model="selectedAccount" class="form-control mr-2" id="accountSelect">
            <option value="" disabled>내 계좌 선택</option>
            <option v-for="(account, index) in accounts" :key="index" :value="account">{{ account }}</option>
          </select>
          <input v-model.number="withdrawAmount" type="number" class="form-control" placeholder="출금할 포인트" />
          <button @click="withdrawPoints" class="btn btn-success ml-2">출금</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      points: 0,
      withdrawAmount: 0,
      selectedAccount: '', // 계좌 선택 변수
      accounts: [] // 계좌 목록을 저장할 배열
    };
  },
  mounted() {
    this.fetchPoints();
    this.getBank(); // getBank 요청 추가
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
    async getBank() {
      try {
        const response = await axios.get('/api/mypage/getBank');
        if (response.status === 200) {
          // 문자열로 반환된 JSON을 파싱하여 배열로 변환
          const data = JSON.parse(response.data[0]); // 첫 번째 요소를 파싱
          this.accounts = data; // accounts에 할당
          console.log('계좌 목록:', this.accounts);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('계좌 조회 오류:', error);
      }
    },
    async withdrawPoints() {
      if (this.withdrawAmount > 0 && this.withdrawAmount <= this.points && this.selectedAccount) {
        try {
          const requestData = {
            point: this.withdrawAmount,
            account: this.selectedAccount, // 선택된 계좌 추가
          };
          const response = await axios.post('/api/mypage/withdraw', requestData, {
            withCredentials: true,
          });

          if (response.status === 200) {
            this.points -= this.withdrawAmount;
            this.withdrawAmount = 0;
            this.selectedAccount = ''; // 출금 후 계좌 선택 초기화
            alert('포인트 출금이 성공적으로 완료되었습니다.');
          } else {
            alert('출금 실패');
          }
        } catch (error) {
          console.error('출금 오류:', error);
          alert('출금 중 오류가 발생했습니다.');
        }
      } else {
        alert('출금할 수 없는 금액이거나 계좌를 선택하지 않았습니다.');
      }
    }
  }
};
</script>

<style scoped>
.point-management {
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 20px;
  max-width: 400px; /* 최대 너비를 400px로 설정 */
  margin: auto; /* 중앙 정렬 */
}

h1,
h3 {
  color: #333;
}

input {
  width: 100%;
}

button {
  font-size: 16px;
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
