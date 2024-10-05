<template>
  <div class="point-management">
    <h2 class="title">나의 <span class="text-accent">포인트</span></h2>
    <ul class="current-points">
      <li>보유 포인트</li>
      <li class="points-info">
        <span class="text-accent">{{ points }}</span>
        P
      </li>
    </ul>

    <h2 class="title margin-top-1rem">포인트 <span class="text-accent">출금</span></h2>
    <div class="withdraw-section">
      <div class="form-group">
        <select v-model="accountIndex" class="form-control mr-2 account-select" id="accountSelect">
          <option value="" disabled selected>내 계좌 선택</option>
          <!-- 비활성화 및 기본값 설정 -->
          <option v-for="(account, index) in accounts" :key="index" :value="index">
            {{ account }}
          </option>
        </select>
        <span class="common-label">계좌로</span>
        <input
          v-model.number="withdrawAmount"
          type="number"
          class="form-control ml-2 amount-input"
          placeholder="출금할 포인트"
        />
        <span class="common-label">원</span>
        <button @click="withdrawPoints" class="btn btn-success ml-2">입금</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      points: 0,
      withdrawAmount: 0,
      accountIndex: '',
      accounts: []
    }
  },
  mounted() {
    this.fetchPoints()
    this.getBank()
  },
  methods: {
    async fetchPoints() {
      try {
        const response = await fetch('/api/mypage/points')
        if (response.ok) {
          const point = await response.json()
          this.points = point
        } else {
          console.error('Error:', response.statusText)
          alert('회원 정보를 찾을 수 없습니다.')
        }
      } catch (error) {
        console.error('포인트 조회 오류:', error)
      }
    },
    async getBank() {
      try {
        const response = await axios.get('/api/mypage/getBank')
        if (response.status === 200) {
          const data = JSON.parse(response.data[0]) // 첫 번째 요소를 파싱
          this.accounts = data // accounts에 할당
          console.log('계좌 목록:', this.accounts)
        } else {
          console.error('Error:', response.statusText)
        }
      } catch (error) {
        console.error('계좌 조회 오류:', error)
      }
    },
    async withdrawPoints() {
      if (
        this.withdrawAmount > 0 &&
        this.withdrawAmount <= this.points &&
        this.accountIndex !== ''
      ) {
        try {
          const requestData = {
            point: this.withdrawAmount
          }

          console.log('출금 요청 데이터:', requestData)
          const response = await axios.post(
            `/api/mypage/withdraw?idx=${this.accountIndex}`,
            requestData,
            {
              withCredentials: true
            }
          )

          if (response.status === 200) {
            this.points -= this.withdrawAmount
            this.withdrawAmount = 0
            this.accountIndex = '' // 출금 후 계좌 선택 초기화
            alert('포인트 출금이 성공적으로 완료되었습니다.')
          } else {
            alert('출금 실패')
          }
        } catch (error) {
          console.error('출금 오류:', error)
          alert('출금 중 오류가 발생했습니다.')
        }
      } else {
        alert('출금할 수 없는 금액이거나 계좌를 선택하지 않았습니다.')
      }
    }
  }
}
</script>

<style scoped>
.point-management {
}

.point-management .text-accent {
  font-weight: 300;
}

.point-management ul.current-points {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #eee;
  padding-top: 0.5rem;
  padding-bottom: 1rem;
}

.point-management ul.current-points li {
  font-size: 20px;
  letter-spacing: -1px;
}

.point-management ul.current-points li.points-info {
  line-height: 1;
}

.point-management ul.current-points li.points-info span {
  font-size: 30px;
  font-weight: 700;
}

.point-management .withdraw-section {
  font-size: 20px;
}

.account-select {
}

.amount-input {
}

.common-label {
  margin: 0 10px;
  /* "계좌로" 및 "원" 텍스트와 셀렉트/인풋 사이의 간격 조정 */
  font-weight: bold;
  /* 텍스트를 두껍게 */
}
</style>
