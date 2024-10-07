<template>
  <div class="my-asset-manager">
    <h2 class="title">자산 관리</h2>
    <div class="text-center">
      <button class="button-main" v-if="!loaded" @click="loadAsset">
        <i class="fa-solid fa-circle-down"></i> 내 자산 불러오기
      </button>
    </div>

    <div class="my-asset-list" v-if="loaded">
      <div class="list-item" v-for="(type, index) in assetTypesList" :key="index">
        <h3 class="title">{{ getAssetTypeName(type) }}</h3>
        <ul>
          <li v-for="(asset, assetIndex) in assetTypes[type]" :key="assetIndex" class="asset-item">
            <dl v-if="!editMode">
              <dt>{{ asset.bank }} - {{ asset.accountNumber }}</dt>
              <dd>{{ asset.amount ? asset.amount.toLocaleString() : '0' }}원</dd>
            </dl>
            <dl v-else>
              <dt><input v-model="asset.bank" class="form-control" placeholder="은행명" /></dt>
              <dd>
                <input v-model="asset.accountNumber" class="form-control" placeholder="계좌 번호" />
                <input
                  v-model.number="asset.amount"
                  type="number"
                  class="form-control"
                  placeholder="금액"
                />
              </dd>
            </dl>
          </li>
        </ul>
      </div>
      <div class="laon-section">
        <h3 class="title">대출</h3>
        <div v-if="isLoanDetailsValid">
          <dl v-if="!editMode">
            <dt>대출 목적</dt>
            <dd>{{ loanDetails.loanPurpose }}</dd>
            <dt>대출 금액</dt>
            <dd>{{ loanDetails.loanAmount ? loanDetails.loanAmount.toLocaleString() : '0' }}원</dd>
            <dt>대출 기간</dt>
            <dd>{{ loanDetails.period }}개월</dd>
            <dt>대출 이율</dt>
            <dd>{{ loanDetails.interest }}%</dd>
          </dl>
          <dl v-else>
            <dt>
              <input
                v-model="loanDetails.loanPurpose"
                class="form-control"
                placeholder="대출 목적"
              />
            </dt>
            <dd>
              <input
                v-model.number="loanDetails.loanAmount"
                type="number"
                class="form-control"
                placeholder="대출 금액"
              />
            </dd>
            <dt>대출 기간</dt>
            <dd>
              <input
                v-model.number="loanDetails.period"
                type="number"
                class="form-control"
                placeholder="대출 기간"
              />
            </dd>
            <dt>대출 이율</dt>
            <dd>
              <input
                v-model.number="loanDetails.interest"
                type="number"
                class="form-control"
                placeholder="대출 이율"
              />
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="text-center margin-top-1rem">
      <button class="button-sub" @click="toggleEditMode">
        {{ editMode ? '저장하기' : '수정하기' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getAsset, updateAsset } from '@/api/mypageApi'

// 상태 정의
const assetTypes = ref({
  cash: [],
  deposit: [],
  stock: [],
  insurance: []
})
const loanDetails = ref({})
const editMode = ref(false)
const loaded = ref(false)
const assetTypesList = ['cash', 'deposit', 'stock', 'insurance']

// 대출 정보 유효성 검사
const isLoanDetailsValid = computed(() => {
  const { loanPurpose, loanAmount, period, interest } = loanDetails.value
  return loanPurpose && loanAmount !== null && period !== null && interest !== null
})

// 자산 타입 이름 가져오기
const getAssetTypeName = (type) =>
  ({
    cash: '현금 자산',
    deposit: '예적금 자산',
    stock: '증권 자산',
    insurance: '보험 자산'
  })[type] || type

// 자산 파싱
const parseAssets = (data, type) => {
  const banks = JSON.parse(data[`${type}Bank`] || '[]')
  const accounts = JSON.parse(data[`${type}Account`] || '[]')
  const amounts = JSON.parse(data[type] || '[]')
  return banks.map((bank, index) => ({
    bank,
    accountNumber: accounts[index] || '',
    amount: amounts[index] ? parseInt(amounts[index], 10) : 0
  }))
}

// 자산 로드
const loadAsset = async () => {
  try {
    const responseData = await getAsset()
    if (!responseData) {
      alert('자산 데이터가 없습니다. 다시 시도해 주세요.')
      return
    }

    assetTypesList.forEach((type) => {
      assetTypes.value[type] = parseAssets(responseData, type)
    })

    if (responseData.insuranceCompany) {
      assetTypes.value.insurance = JSON.parse(responseData.insuranceCompany).map(
        (company, index) => ({
          bank: company,
          accountNumber: JSON.parse(responseData.insuranceName)[index] || '',
          amount: parseInt(JSON.parse(responseData.insurance)[index], 10) || 0
        })
      )
    }

    loanDetails.value = {
      loanPurpose: responseData.loanPurpose || null,
      loanAmount: responseData.loanAmount || null,
      period: responseData.period || null,
      interest: responseData.interest || null
    }

    loaded.value = true
  } catch {
    alert('자산 불러오기 실패. 다시 시도해 주세요.')
  }
}

// 수정 모드 전환
const toggleEditMode = async () => {
  if (editMode.value) {
    const updatedData = prepareUpdatedData()
    try {
      await updateAsset(updatedData)
      alert('자산 및 대출 정보가 업데이트되었습니다.')
    } catch {
      alert('업데이트 실패. 다시 시도해 주세요.')
    }
  }
  editMode.value = !editMode.value
}

// 업데이트된 데이터 준비
const prepareUpdatedData = () => {
  const updatedData = {}
  assetTypesList.forEach((type) => {
    updatedData[type] = JSON.stringify(assetTypes.value[type].map((asset) => asset.amount))
    updatedData[`${type}Account`] = JSON.stringify(
      assetTypes.value[type].map((asset) => asset.accountNumber)
    )
    updatedData[`${type}Bank`] = JSON.stringify(assetTypes.value[type].map((asset) => asset.bank))
  })
  Object.assign(updatedData, loanDetails.value)

  if (assetTypes.value.insurance.length > 0) {
    updatedData.insuranceCompany = JSON.stringify(assetTypes.value.insurance.map((ins) => ins.bank))
    updatedData.insuranceName = JSON.stringify(
      assetTypes.value.insurance.map((ins) => ins.accountNumber)
    )
    updatedData.insurance = JSON.stringify(assetTypes.value.insurance.map((ins) => ins.amount))
  }

  return updatedData
}
</script>

<style scoped>
.my-asset-manager {
}
.my-asset-list .list-item {
  position: relative;
  background-color: #fff;
  border-radius: 27px;
  padding: 1.4rem;
  border: 2px solid #e4deff;
  padding-left: 7.5rem;
}
.my-asset-list .list-item::before {
  content: '';
  position: absolute;
  left: 1.4rem;
  width: 5rem;
  height: 5rem;
  background-color: #000;
  border-radius: 16px;
}
.my-asset-list .list-item h3.title {
  margin: 8px 0;
  padding: 0;
  font-size: 20px;
  letter-spacing: -1px;
}
.my-asset dl.asset-item {
  display: flex;
}

.my-asset dl.asset-item dt {
}

.my-asset dl.asset-item dd {
}
</style>
