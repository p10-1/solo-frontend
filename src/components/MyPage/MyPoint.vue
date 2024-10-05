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
  font-weight: bold;
  /* 텍스트를 두껍게 */
}
</style>
