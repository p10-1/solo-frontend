<template>
  <div class="my-asset-manager">
    <h2 class="title">자산 관리</h2>
    <div class="text-center">
      <button class="button-main" v-if="!loaded" @click="loadAsset">
        <i class="fa-solid fa-circle-down"></i> 내 자산 불러오기
      </button>
    </div>

    <div class="my-asset-list" v-if="loaded">
      <h3 class="title margin-top-2rem margin-bottom-1rem">자산</h3>
      <div class="list-align">
        <div class="list-item" v-for="(type, index) in assetTypesList" :key="index">
          <h4 class="title">{{ getAssetTypeName(type) }}</h4>
          <ul>
            <li
              v-for="(asset, assetIndex) in assetTypes[type]"
              :key="assetIndex"
              class="asset-item"
            >
              <dl v-if="!editMode">
                <dt>{{ asset.bank }}</dt>
                <dd>{{ asset.accountNumber }}</dd>
                <dd>
                  <span class="text-accent">{{
                    asset.amount ? asset.amount.toLocaleString() : '0'
                  }}</span
                  >원
                </dd>
              </dl>
              <dl v-else>
                <dt><input v-model="asset.bank" class="form-control" placeholder="은행명" /></dt>
                <dd>
                  <input
                    v-model="asset.accountNumber"
                    class="form-control"
                    placeholder="계좌 번호"
                  />
                </dd>
                <dd>
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
      </div>

      <div class="loan-section">
        <h3 class="title margin-top-3rem margin-bottom-1rem">대출</h3>
        <div v-if="isLoanDetailsValid" class="my-loan-list">
          <div v-if="!editMode">
            <div class="list-item">
              <ul>
                <li>대출 금액</li>
                <li>
                  <span class="text-accent">{{
                    loanDetails.loanAmount ? loanDetails.loanAmount.toLocaleString() : '0'
                  }}</span
                  >원
                </li>
              </ul>
              <ul>
                <li>대출 목적</li>
                <li>
                  <span class="text-accent">{{ loanDetails.loanPurpose }}</span>
                </li>
              </ul>
              <ul>
                <li>대출 기간</li>
                <li>
                  <span class="text-accent">{{ loanDetails.period }}</span
                  >개월
                </li>
              </ul>
              <ul>
                <li>대출 이율</li>
                <li>
                  <span class="text-accent">{{ loanDetails.interest }}</span
                  >%
                </li>
              </ul>
            </div>
          </div>
          <div v-else>
            <div class="list-item">
              <ul>
                <li>대출 목적</li>
                <li>
                  <input
                    v-model="loanDetails.loanPurpose"
                    class="form-control"
                    placeholder="대출 목적"
                  />
                </li>
              </ul>
              <ul>
                <li>대출 금액</li>
                <li>
                  <input
                    v-model.number="loanDetails.loanAmount"
                    type="number"
                    class="form-control"
                    placeholder="대출 금액"
                  />
                </li>
              </ul>
              <ul>
                <li>대출 기간</li>
                <li>
                  <input
                    v-model.number="loanDetails.period"
                    type="number"
                    class="form-control"
                    placeholder="대출 기간"
                  />
                </li>
              </ul>
              <ul>
                <li>대출 이율</li>
                <li>
                  <input
                    v-model.number="loanDetails.interest"
                    type="number"
                    class="form-control"
                    placeholder="대출 이율"
                  />
                </li>
              </ul>
            </div>
          </div>
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
const assetTypes = ref({ cash: [], deposit: [], stock: [], insurance: [] })
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

/* 자산 */
.my-asset-list div.list-align {
  display: flex;
  gap: 19px;
  flex-wrap: wrap;
}
.my-asset-list h3.title {
  padding: 0;
  font-weight: 400;
  position: relative;
  color: #6846f5;
}
.my-asset-list .list-item {
  width: calc(50% - 9.5px);
  position: relative;
  min-height: 7.8rem;
  padding: 1.25rem 1.4rem;
  border: 3px solid #e4deff;
  border-radius: 24px;
}
.my-asset-list .list-item h4.title {
  margin: 8px 0 12px;
  font-weight: 400;
  padding-top: 0;
  padding-bottom: 8px;
  font-size: 22px;
  letter-spacing: -1px;
  border-bottom: 2px solid #eee;
}
.my-asset-list .asset-item dl {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 5px;
  font-size: 18px;
}
.my-asset-list .asset-item dt {
  font-weight: 500;
  color: #6846f5;
  letter-spacing: -0.8px;
}
.my-asset-list .asset-item .text-accent {
  color: #6846f5;
  letter-spacing: -0.8px;
  font-weight: 700;
}
/* 대출 */
.loan-section {
  margin-top: 2rem;
}
.loan-section h3 {
  margin-bottom: 1rem;
}
.loan-section .list-item {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0px 100px;
  align-items: center;
}
.loan-section .list-item ul {
  width: calc(50% - 50px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
}
.loan-section .list-item li {
  letter-spacing: -0.8px;
}
.loan-section .list-item li:first-child {
  color: #6846f5;
  font-weight: 500;
}
.loan-section .list-item .text-accent {
  color: #6846f5;
  font-weight: 700;
}
</style>
