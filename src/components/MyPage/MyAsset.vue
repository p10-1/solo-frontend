<template>
    <div class="asset-manager container mt-5">
        <h1 class="text-center">자산 관리</h1><br />
        <div class="text-center mb-4">
            <button class="btn btn-primary" v-if="!loaded" @click="loadAsset">내 자산 불러오기</button>
        </div>

        <div class="asset-loan-container" v-if="loaded">
            <div class="asset-section mb-4" v-for="(type, index) in assetTypesList" :key="index">
                <h3>{{ getAssetTypeName(type) }}</h3>
                <ul class="list-group">
                    <li v-for="(asset, assetIndex) in assetTypes[type]" :key="assetIndex" class="list-group-item">
                        <div v-if="!editMode">
                            {{ asset.bank }} - {{ asset.accountNumber }}: {{ asset.amount ? asset.amount.toLocaleString() : '0' }}원
                        </div>
                        <div v-else>
                            <input v-model="asset.bank" class="form-control mb-2" placeholder="은행명" />
                            <input v-model="asset.accountNumber" class="form-control mb-2" placeholder="계좌 번호" />
                            <input v-model.number="asset.amount" type="number" class="form-control" placeholder="금액" />
                        </div>
                    </li>
                </ul>
            </div>

            <div class="card mb-4">
                <div class="card-header">
                    <h3>대출 자산</h3>
                </div>
                <div class="card-body">
                    <div v-if="isLoanDetailsValid">
                        <div v-if="!editMode">
                            <p><strong>대출 목적:</strong> {{ loanDetails.loanPurpose }}</p>
                            <p><strong>대출 금액:</strong> {{ loanDetails.loanAmount ? loanDetails.loanAmount.toLocaleString() : '0' }}원</p>
                            <p><strong>대출 기간:</strong> {{ loanDetails.period }}개월</p>
                            <p><strong>대출 이율:</strong> {{ loanDetails.interest }}%</p>
                        </div>
                        <div v-else>
                            <input v-model="loanDetails.loanPurpose" class="form-control mb-2" placeholder="대출 목적" />
                            <input v-model.number="loanDetails.loanAmount" type="number" class="form-control mb-2" placeholder="대출 금액" />
                            <input v-model.number="loanDetails.period" type="number" class="form-control mb-2" placeholder="대출 기간" />
                            <input v-model.number="loanDetails.interest" type="number" class="form-control" placeholder="대출 이율" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    <div class="text-center margin-top-1rem">
      <button class="button-sub btn btn-secondary" @click="toggleEditMode">
        {{ editMode ? '저장하기' : '수정하기' }}</button
      ><br /><br />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getAsset, updateAsset } from '@/api/mypageApi';

// 상태 정의
const assetTypes = ref({
    cash: [],
    deposit: [],
    stock: [],
    insurance: []
});
const loanDetails = ref({});
const editMode = ref(false);
const loaded = ref(false);
const assetTypesList = ['cash', 'deposit', 'stock', 'insurance'];

// 대출 정보 유효성 검사
const isLoanDetailsValid = computed(() => {
    const { loanPurpose, loanAmount, period, interest } = loanDetails.value;
    return loanPurpose && loanAmount !== null && period !== null && interest !== null;
});

// 자산 타입 이름 가져오기
const getAssetTypeName = (type) => ({
    cash: '현금 자산',
    deposit: '예적금 자산',
    stock: '증권 자산',
    insurance: '보험 자산'
}[type] || type);

// 자산 파싱
const parseAssets = (data, type) => {
    const banks = JSON.parse(data[`${type}Bank`] || "[]");
    const accounts = JSON.parse(data[`${type}Account`] || "[]");
    const amounts = JSON.parse(data[type] || "[]");
    return banks.map((bank, index) => ({
        bank,
        accountNumber: accounts[index] || '',
        amount: amounts[index] ? parseInt(amounts[index], 10) : 0
    }));
};

// 자산 로드
const loadAsset = async () => {
    try {
        const responseData = await getAsset();
        if (!responseData) {
            alert('자산 데이터가 없습니다. 다시 시도해 주세요.');
            return;
        }

        assetTypesList.forEach(type => {
            assetTypes.value[type] = parseAssets(responseData, type);
        });

        if (responseData.insuranceCompany) {
            assetTypes.value.insurance = JSON.parse(responseData.insuranceCompany).map((company, index) => ({
                bank: company,
                accountNumber: JSON.parse(responseData.insuranceName)[index] || '',
                amount: parseInt(JSON.parse(responseData.insurance)[index], 10) || 0
            }));
        }

        loanDetails.value = {
            loanPurpose: responseData.loanPurpose || null,
            loanAmount: responseData.loanAmount || null,
            period: responseData.period || null,
            interest: responseData.interest || null
        };

        loaded.value = true;
    } catch {
        alert('자산 불러오기 실패. 다시 시도해 주세요.');
    }
};

// 수정 모드 전환
const toggleEditMode = async () => {
    if (editMode.value) {
        const updatedData = prepareUpdatedData();
        try {
            await updateAsset(updatedData);
            alert('자산 및 대출 정보가 업데이트되었습니다.');
        } catch {
            alert('업데이트 실패. 다시 시도해 주세요.');
        }
    }
    editMode.value = !editMode.value;
};

// 업데이트된 데이터 준비
const prepareUpdatedData = () => {
    const updatedData = {};
    assetTypesList.forEach(type => {
        updatedData[type] = JSON.stringify(assetTypes.value[type].map(asset => asset.amount));
        updatedData[`${type}Account`] = JSON.stringify(assetTypes.value[type].map(asset => asset.accountNumber));
        updatedData[`${type}Bank`] = JSON.stringify(assetTypes.value[type].map(asset => asset.bank));
    });
    Object.assign(updatedData, loanDetails.value);

    if (assetTypes.value.insurance.length > 0) {
        updatedData.insuranceCompany = JSON.stringify(assetTypes.value.insurance.map(ins => ins.bank));
        updatedData.insuranceName = JSON.stringify(assetTypes.value.insurance.map(ins => ins.accountNumber));
        updatedData.insurance = JSON.stringify(assetTypes.value.insurance.map(ins => ins.amount));
    }

    return updatedData;
};
</script>

<style scoped>
.asset-manager {
  text-align: left;
}

.asset-manager .title {
  font-weight: 300;
  line-height: 1;
}

.asset-manager .button-box {
  display: flex;
  position: relative;
  margin-top: 0;
  left: 0;
  justify-content: center;
}

.asset-manager .button-box .button-main {
  margin-left: 0;
  margin-right: 10px;
}

.asset-loan-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.asset-loan-container .asset-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.loan-section {
  margin-top: 20px;
}

input,
select {
  padding: 8px;
  margin-right: 10px;
}

button {
  padding: 8px 16px;
}
</style>
