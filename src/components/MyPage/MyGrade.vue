<template>
  <div class="asset-rank">
    <!-- <h1>자산 등급 안내</h1> -->

    <div class="rank-description">
      <h3>등급 설명</h3>
      <ul>
        <li><strong>초보</strong>: 자산 5천만 원 이하</li>
        <li><strong>중급</strong>: 자산 5천만 원 이상 ~ 5억 원 미만</li>
        <li><strong>대장</strong>: 자산 5억 원 이상</li>
      </ul>
    </div>

    <!-- 나의 등급 확인 -->
    <div class="my-asset">
      <h3>나의 자산 등급: {{ myRank }}</h3>
      <input v-model="asset" type="number" placeholder="자산 입력 (숫자만)" />
      <button @click="determineRank">등급 확인하기</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      asset: 0, // 사용자가 입력한 자산
      myRank: '등급을 확인하세요' // 초기 등급 상태
    }
  },
  methods: {
    // 자산에 따른 등급 결정 함수
    determineRank() {
      if (this.asset <= 50000000) {
        this.myRank = '초보'
      } else if (this.asset > 50000000 && this.asset < 500000000) {
        this.myRank = '중급'
      } else {
        this.myRank = '대장'
      }
    }
  }
}
</script>

<style scoped>
.asset-rank {
  max-width: 500px;
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

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 10px;
  background-color: #e7e7e7;
  margin-bottom: 5px;
  border-radius: 5px;
}

input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

button:hover {
  background-color: #45a049;
}
</style>
