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

            <!-- 대출 정보 제목 -->
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
                    <div v-else>
                        <!-- 대출 정보가 없을 때는 이곳을 비워두면 됩니다 -->
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
import { getAsset, updateAsset } from '@/api/mypageApi'; // API 호출 import

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
    computed: {
        isLoanDetailsValid() {
            return this.loanDetails && 
                   this.loanDetails.loanPurpose !== null && 
                   this.loanDetails.loanAmount !== null && 
                   this.loanDetails.period !== null && 
                   this.loanDetails.interest !== null;
        }
    },
    methods: {
        async getAsset() {
            try {
                const responseData = await getAsset(); // API 호출
                
                // 데이터가 null인 경우 처리
                if (!responseData) {
                    alert('자산 데이터가 없습니다. 다시 시도해 주세요.');
                    return;
                }

                console.log('자산 데이터:', responseData);
                
                // 자산 데이터 정리
                this.assetTypesList.forEach(type => {
                    this.assetTypes[type] = this.parseAssets(responseData, type);
                });

                // 보험 데이터를 수동으로 처리
                if (responseData.insuranceCompany && responseData.insuranceName && responseData.insurance) {
                    this.assetTypes.insurance = JSON.parse(responseData.insuranceCompany).map((company, index) => ({
                        bank: company,
                        accountNumber: JSON.parse(responseData.insuranceName)[index] || '',
                        amount: parseInt(JSON.parse(responseData.insurance)[index], 10) || 0
                    }));
                }

                // 대출 정보 정리
                this.loanDetails = {
                    loanPurpose: responseData.loanPurpose || null,
                    loanAmount: responseData.loanAmount || null,
                    period: responseData.period || null,
                    interest: responseData.interest || null
                };

                this.loaded = true;

            } catch (error) {
                alert('자산 불러오기 실패. 다시 시도해 주세요.');
            }
        },

        parseAssets(data, type) {
            if (!data || !data[`${type}Bank`] || !data[`${type}Account`] || !data[type]) {
                return []; // 데이터가 없으면 빈 배열 반환
            }

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

        async toggleEditMode() {
            if (this.editMode) {
                const updatedData = this.prepareUpdatedData();
                console.log("전송 데이터:", updatedData);
                try {
                    await updateAsset(updatedData); // API 호출
                    alert('자산 및 대출 정보가 업데이트되었습니다.');
                } catch (error) {
                    alert('업데이트 실패. 다시 시도해 주세요.');
                }
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
