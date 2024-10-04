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
          <select v-model="accountIndex" class="form-control mr-2 account-select" id="accountSelect">
            <option value="" disabled selected>내 계좌 선택</option>
            <option v-for="(account, index) in accounts" :key="index" :value="index">{{ account }}</option>
          </select>
          <span class="common-label">계좌로</span>
          <input v-model.number="withdrawAmount" type="number" class="form-control ml-2 amount-input"
            placeholder="출금할 포인트" />
          <span class="common-label">원</span>
          <button @click="withdrawPoints" class="btn btn-success ml-2">입금</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { fetchPoints, pointsToCash, getBank } from '@/api/mypageApi'; // API import

// 이벤트 정의
const emit = defineEmits(['update']); // 부모에게 'update' 이벤트를 발생시킬 수 있도록 정의

const points = ref(0);
const withdrawAmount = ref(0);
const accountIndex = ref('');
const accounts = ref([]);

const loadPoints = async () => {
  try {
    points.value = await fetchPoints(); // 포인트 조회 API 호출
  } catch (error) {
    alert('포인트 조회 중 오류가 발생했습니다.');
  }
};

const loadBank = async () => {
  try {
    const data = await getBank(); // 은행 정보 조회 API 호출
    accounts.value = JSON.parse(data[0]);
  } catch (error) {
    console.error('계좌 조회 오류:', error);
  }
};

const withdrawPoints = async () => {
  if (withdrawAmount.value > 0 && withdrawAmount.value <= points.value && accountIndex.value !== '') {
    try {
      await pointsToCash(accountIndex.value, withdrawAmount.value); // 포인트 출금 API 호출
      points.value -= withdrawAmount.value;
      withdrawAmount.value = 0;
      accountIndex.value = '';
      alert('포인트 출금이 성공적으로 완료되었습니다.');

      // 부모에게 업데이트 이벤트 발생
      emit('update'); // 부모에게 'update' 이벤트를 발생시킴
    } catch (error) {
      console.error('출금 오류:', error);
      alert('출금 중 오류가 발생했습니다.');
    }
  } else {
    alert('출금할 수 없는 금액이거나 계좌를 선택하지 않았습니다.');
  }
};

onMounted(() => {
  loadPoints();
  loadBank();
});
</script>



<style scoped>
.point-management {
  background-color: #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  max-width: 500px;
  margin: auto;
}

h1,
h3 {
  color: #333;
}

.account-select {
  width: 120px;
}

.amount-input {
  width: 150px;
}

.common-label {
  margin: 0 10px;
  font-weight: bold;
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
