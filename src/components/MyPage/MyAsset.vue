<template>
    <div class="asset-manager container mt-5">
        <h1 class="text-center">자산 관리</h1><br />
        <div class="text-center mb-4">
            <button class="btn btn-primary" v-if="!loaded" @click="getAsset">내 자산 불러오기</button>
        </div>

        <div class="asset-loan-container" v-if="loaded">
            <!-- 자산 섹션을 세로로 배치 -->
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

            <!-- 대출 정보 카드 -->
            <div class="card mb-4">
                <div class="card-header">
                    <h3>대출 정보</h3>
                </div>
                <div class="card-body">
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

        <div class="text-center">
            <button class="btn btn-secondary" @click="toggleEditMode">{{ editMode ? '저장하기' : '수정하기' }}</button><br /><br />
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            assetTypes: {
                cash: [],
                deposit: [],
                stock: [],
                insurance: []
            },
            loanDetails: null,
            editMode: false,
            loaded: false,
            assetTypesList: ['cash', 'deposit', 'stock', 'insurance']
        };
    },
    methods: {
        async getAsset() {
            try {
                const response = await axios.get('/api/mypage/getAsset', { withCredentials: true });
                console.log('자산 데이터:', response.data);

                // 자산 데이터 정리
                this.assetTypesList.forEach(type => {
                    this.assetTypes[type] = this.parseAssets(response.data, type);
                });

                // 보험 데이터를 수동으로 처리
                if (response.data.insuranceCompany && response.data.insuranceName && response.data.insurance) {
                    this.assetTypes.insurance = JSON.parse(response.data.insuranceCompany).map((company, index) => ({
                        bank: company,
                        accountNumber: JSON.parse(response.data.insuranceName)[index] || '',
                        amount: parseInt(JSON.parse(response.data.insurance)[index], 10) || 0
                    }));
                }

                // 대출 정보 정리
                this.loanDetails = {
                    loanPurpose: response.data.loanPurpose || '',
                    loanAmount: response.data.loanAmount || 0,
                    period: response.data.period || 0,
                    interest: response.data.interest || 0
                };

                alert('자산 불러오기 완료!');
                this.loaded = true;

            } catch (error) {
                console.error('자산 불러오기 실패:', error);
                alert('자산 불러오기 실패. 다시 시도해 주세요.');
            }
        },

        parseAssets(data, type) {
            const banks = JSON.parse(data[`${type}Bank`] || "[]");
            const accounts = JSON.parse(data[`${type}Account`] || "[]");
            const amounts = JSON.parse(data[type] || "[]");

            return banks.map((bank, index) => ({
                bank,
                accountNumber: accounts[index] || '',
                amount: amounts[index] ? parseInt(amounts[index], 10) : 0
            }));
        },

        getAssetTypeName(type) {
            const assetTypeNames = {
                cash: '현금 자산',
                deposit: '예적금 자산',
                stock: '증권 자산',
                insurance: '보험 자산'
            };
            return assetTypeNames[type] || type;
        },

        toggleEditMode() {
            if (this.editMode) {
                const updatedData = this.prepareUpdatedData();
                console.log("전송 데이터:", updatedData);
                this.updateData(updatedData);
            }
            this.editMode = !this.editMode;
        },

        prepareUpdatedData() {
            const updatedData = {};
            this.assetTypesList.forEach(type => {
                updatedData[type] = JSON.stringify(this.assetTypes[type].map(asset => asset.amount));
                updatedData[`${type}Account`] = JSON.stringify(this.assetTypes[type].map(asset => asset.accountNumber));
                updatedData[`${type}Bank`] = JSON.stringify(this.assetTypes[type].map(asset => asset.bank));
            });

            updatedData.loanAmount = this.loanDetails.loanAmount;
            updatedData.loanPurpose = this.loanDetails.loanPurpose;
            updatedData.period = this.loanDetails.period;
            updatedData.interest = this.loanDetails.interest;

            // 보험 정보 처리: 모든 보험 상품을 JSON 형식으로 변환
            if (this.assetTypes.insurance.length > 0) {
                updatedData.insuranceCompany = JSON.stringify(this.assetTypes.insurance.map(ins => ins.bank));
                updatedData.insuranceName = JSON.stringify(this.assetTypes.insurance.map(ins => ins.accountNumber));
                updatedData.insurance = JSON.stringify(this.assetTypes.insurance.map(ins => ins.amount));
            }

            return updatedData;
        },

        async updateData(data) {
            try {
                await axios.post('/api/mypage/updateData', data, { withCredentials: true });
                alert('자산 및 대출 정보가 업데이트되었습니다.');
            } catch (error) {
                console.error('업데이트 실패:', error);
                alert('업데이트 실패. 다시 시도해 주세요.');
            }
        }
    }
}
</script>

<style scoped>
.asset-manager {
    text-align: left;
}

.asset-loan-container {
    display: block;
}

.asset-section {
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
