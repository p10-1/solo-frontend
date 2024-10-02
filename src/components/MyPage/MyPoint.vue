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
        <div class="d-flex align-items-center">
          <select v-model="AccountIndex" class="form-control mr-2 account-select" id="accountSelect">
            <option value="" disabled selected>내 계좌 선택</option> <!-- 비활성화 및 기본값 설정 -->
            <option v-for="(account, index) in accounts" :key="index" :value="index">{{ account }}</option>
          </select>
          <span class="common-label">계좌로</span>
          <input v-model.number="withdrawAmount" type="number" class="form-control ml-2 amount-input" placeholder="출금할 포인트" />
          <span class="common-label">원</span>
          <button @click="withdrawPoints" class="btn btn-success ml-2">입금</button>
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
      AccountIndex: '', // 변수명 변경
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
      if (this.withdrawAmount > 0 && this.withdrawAmount <= this.points && this.AccountIndex !== '') {
        try {
          const requestData = {
            point: this.withdrawAmount,
            accountIndex: this.AccountIndex, // 변수명 변경
          };

          console.log('출금 요청 데이터:', requestData);
          const response = await axios.post('/api/mypage/withdraw', requestData, {
            withCredentials: true,
          });

          if (response.status === 200) {
            this.points -= this.withdrawAmount;
            this.withdrawAmount = 0;
            this.AccountIndex = ''; // 출금 후 계좌 선택 초기화
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
  background-color: #e0e0e0; /* 더 연한 배경색으로 변경 */
  border-radius: 10px;
  padding: 20px;
  max-width: 500px; /* 최대 너비를 500px로 설정 */
  margin: auto; /* 중앙 정렬 */
}

h1,
h3 {
  color: #333;
}

.account-select {
  width: 120px; /* 셀렉트 박스 너비 조정 */
}

.amount-input {
  width: 150px; /* 인풋 폼 너비 조정 */
}

.common-label {
  margin: 0 10px; /* "계좌로" 및 "원" 텍스트와 셀렉트/인풋 사이의 간격 조정 */
  font-weight: bold; /* 텍스트를 두껍게 */
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
