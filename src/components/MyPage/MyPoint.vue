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

    <h2 class="title margin-top-3rem">포인트 <span class="text-accent">출금</span></h2>
    <div class="withdraw-section">
      <div class="form-group">
        <h3 class="title margin-top-2rem margin-bottom-1rem text-accent">입금할 계좌</h3>
        <select v-model="accountIndex" class="form-control mr-2 account-select" id="accountSelect">
          <option value="" disabled selected>내 계좌 선택</option>
          <option v-for="(account, index) in accounts" :key="index" :value="index">
            {{ account }}
          </option>
        </select>

        <h3 class="title margin-top-2rem margin-bottom-1rem text-accent">입금액</h3>
        <div class="input-box">
          <input v-model.number="withdrawAmount" type="number" class="form-control ml-2 amount-input"
            placeholder="출금할 포인트" />
          <span class="common-label">원</span>
        </div>
        <button @click="withdrawPoints" class="button-main btn btn-success margin-top-1rem width100">
          <i class="fa-solid fa-money-bill-transfer"></i> 입금
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchPoints, pointsToCash, getBank } from '@/api/mypageApi'

// 이벤트 정의
const emit = defineEmits(['update'])

const points = ref(0)
const withdrawAmount = ref(0)
const accountIndex = ref(null)
const accounts = ref([])

// 상수 정의
const MIN_WITHDRAW_AMOUNT = 500

const loadPoints = async () => {
  try {
    points.value = await fetchPoints()
  } catch (error) {
    handleError('포인트 조회 중 오류가 발생했습니다.', error)
  }
}

// const loadBank = async () => {
//   try {
//     const data = await getBank()
//     accounts.value = JSON.parse(data[0])
//   } catch (error) {
//     handleError('계좌 조회 오류가 발생했습니다.', error)
//   }
// }

// const loadBank = async () => {
//   try {
//     const asset = await getBank() // 이제 AssetVO 객체를 반환
//     if (asset) {
//       accounts.value.push(`${asset.cashBank} ${asset.cashAccount}`) // 계좌 정보를 추가
//     }
//   } catch (error) {
//     handleError('계좌 조회 오류가 발생했습니다.', error)
//   }
// }

const loadBank = async () => {
  try {
    const asset = await getBank(); // AssetVO 객체를 반환
    if (asset) {
      // JSON 문자열을 파싱하여 배열로 변환
      const cashAccounts = JSON.parse(asset.cashAccount);
      const cashBanks = JSON.parse(asset.cashBank);

      // 계좌 정보를 accounts 배열에 추가
      accounts.value = cashAccounts.map((account, index) => `${cashBanks[index]} ${account}`);
    }
  } catch (error) {
    handleError('계좌 조회 오류가 발생했습니다.', error);
  }
}



// 에러 처리 함수
const handleError = (message, error) => {
  console.error(error)
  alert(message)
}

const handleWithdrawResponse = (response) => {
  if (response === 'success') {
    points.value -= withdrawAmount.value
    withdrawAmount.value = 0
    accountIndex.value = null
  } else {
    alert(response)
  }
}

const withdrawPoints = async () => {
  if (
    withdrawAmount.value >= MIN_WITHDRAW_AMOUNT &&
    withdrawAmount.value <= points.value &&
    accountIndex.value !== null
  ) {
    try {
      const response = await pointsToCash(accountIndex.value, withdrawAmount.value)
      handleWithdrawResponse(response)
      emit('update')
    } catch (error) {
      handleError('서버와 연결할 수 없습니다. 다시 시도해 주세요.', error)
    }
  } else {
    alert(
      `출금할 수 없는 금액이거나 계좌를 선택하지 않았습니다. (최소 ${MIN_WITHDRAW_AMOUNT}원 이상 출금 가능)`
    )
  }
}

onMounted(() => {
  loadPoints()
  loadBank()
})
</script>
<style scoped>
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

.point-management h3.title {
  font-size: 20px;
  letter-spacing: -1px;
  padding: 0;
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

.point-management .form-group .input-box {
  position: relative;
}

.point-management .form-group .title {
  position: relative;
  font-weight: 400;
}

.point-management .form-group .input-box .common-label {
  position: absolute;
  right: 15px;
  top: 10px;
  font-weight: 500;
  font-size: 18px;
  color: #666;
}

.point-management .form-group .button-main {
  margin-left: 0;
  color: #fff;
}
</style>
