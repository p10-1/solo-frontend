<template>
    <div class="asset-manager">
        <h1>자산 관리</h1><br /><br />
        <!-- 내 자산 불러오기 버튼 -->
        <button @click="getAsset">내 자산 불러오기</button><br /><br />
        <!-- 수정하기 버튼 -->
        <button @click="toggleEditMode">{{ editMode ? '저장하기' : '수정하기' }}</button><br /><br />

        <!-- 자산 목록 표시 -->
        <div class="asset-section" v-for="(assets, type) in assetTypes" :key="type">
            <h3>{{ getAssetTypeName(type) }}</h3>
            <ul>
                <li v-for="(asset, index) in assets" :key="index">
                    <div v-if="!editMode">
                        {{ asset.bank }} - {{ asset.accountNumber }}: {{ asset.amount.toLocaleString() }}원
                    </div>
                    <div v-else>
                        <input v-model="asset.bank" placeholder="은행명" />
                        <input v-model="asset.accountNumber" placeholder="계좌 번호" />
                        <input v-model.number="asset.amount" type="number" placeholder="금액" />
                    </div>
                </li>
            </ul>
        </div>

        <!-- 대출 관련 정보 표시 -->
        <div class="loan-section" v-if="loanDetails">
            <h3>대출 정보</h3>
            <div v-if="!editMode">
                <p>대출 목적: {{ loanDetails.loanPurpose }}</p>
                <p>대출 금액: {{ loanDetails.loanAmount.toLocaleString() }}원</p>
                <p>대출 기간: {{ loanDetails.period }}개월</p>
                <p>대출 이율: {{ loanDetails.interest }}%</p>
            </div>
            <div v-else>
                <input v-model="loanDetails.loanPurpose" placeholder="대출 목적" />
                <input v-model.number="loanDetails.loanAmount" type="number" placeholder="대출 금액" />
                <input v-model.number="loanDetails.period" type="number" placeholder="대출 기간" />
                <input v-model.number="loanDetails.interest" type="number" placeholder="대출 이율" />
            </div>
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
                property: [],
                stock: []
            },
            loanDetails: null, // 대출 관련 정보 추가
            editMode: false // 전체 수정 모드 플래그
        };
    },
    methods: {
        async getAsset() {
            try {
                const response = await axios.get('/api/mypage/getAsset', { withCredentials: true });
                console.log('자산 데이터:', response.data);

                // JSON 파싱 및 데이터 정리
                const cashBanks = JSON.parse(response.data.cashBank || "[]");
                const cashAccounts = JSON.parse(response.data.cashAccount || "[]");
                const cashAmounts = JSON.parse(response.data.cash || "[]");

                const depositBanks = JSON.parse(response.data.depositBank || "[]");
                const depositAccounts = JSON.parse(response.data.depositAccount || "[]");
                const depositAmounts = JSON.parse(response.data.deposit || "[]");

                const propertyBanks = JSON.parse(response.data.propertyBank || "[]");
                const propertyAccounts = JSON.parse(response.data.propertyAccount || "[]");
                const propertyAmounts = JSON.parse(response.data.property || "[]");

                const stockBanks = JSON.parse(response.data.stockBank || "[]");
                const stockAccounts = JSON.parse(response.data.stockAccount || "[]");
                const stockAmounts = JSON.parse(response.data.stock || "[]");

                // 자산데이터 정리 : 현금자산
                this.assetTypes.cash = cashBanks.map((bank, index) => ({
                    bank,
                    accountNumber: cashAccounts[index] || '',
                    amount: cashAmounts[index] ? parseInt(cashAmounts[index], 10) : 0 // 정수로 변환
                }));
                    
                // 예적금
                this.assetTypes.deposit = depositBanks.map((bank, index) => ({
                    bank,
                    accountNumber: depositAccounts[index] || '',
                    amount: depositAmounts[index] ? parseInt(depositAmounts[index], 10) : 0
                }));

                // 부동산
                this.assetTypes.property = propertyBanks.map((bank, index) => ({
                    bank,
                    accountNumber: propertyAccounts[index] || '',
                    amount: propertyAmounts[index] ? parseInt(propertyAmounts[index], 10) : 0
                }));

                // 주식 
                this.assetTypes.stock = stockBanks.map((bank, index) => ({
                    bank,
                    accountNumber: stockAccounts[index] || '',
                    amount: stockAmounts[index] ? parseInt(stockAmounts[index], 10) : 0
                }));

                // 대출 
                this.loanDetails = {
                    loanPurpose: response.data.loanPurpose || '',
                    loanAmount: response.data.loanAmount || 0,
                    period: response.data.period || 0,
                    interest: response.data.interest || 0
                };

                // 자산 불러오기 완료 알림
                alert('자산 불러오기 완료!');

            } catch (error) {
                console.error('자산 불러오기 실패:', error);
                alert('자산 불러오기 실패. 다시 시도해 주세요.');
            }
        },
        getAssetTypeName(type) {
            const assetTypeNames = {
                cash: '현금 자산',
                deposit: '예적금 자산',
                property: '부동산 자산',
                stock: '증권 자산'
            };
            return assetTypeNames[type] || type; // 자산 타입 한글이름으로 매핑
        },
        toggleEditMode() {
            if (this.editMode) {
                // 입력받은 데이터를 테이블 구조에 맞게 변환하는 과정
                const updatedData = {
                    // JSON형식으로 변환
                    cash: JSON.stringify(this.assetTypes.cash.map(asset => asset.amount)),
                    cashAccount: JSON.stringify(this.assetTypes.cash.map(asset => asset.accountNumber)),
                    cashBank: JSON.stringify(this.assetTypes.cash.map(asset => asset.bank)),
                    deposit: JSON.stringify(this.assetTypes.deposit.map(asset => asset.amount)),
                    depositAccount: JSON.stringify(this.assetTypes.deposit.map(asset => asset.accountNumber)),
                    depositBank: JSON.stringify(this.assetTypes.deposit.map(asset => asset.bank)),
                    property: JSON.stringify(this.assetTypes.property.map(asset => asset.amount)),
                    propertyAccount: JSON.stringify(this.assetTypes.property.map(asset => asset.accountNumber)),
                    propertyBank: JSON.stringify(this.assetTypes.property.map(asset => asset.bank)),
                    stock: JSON.stringify(this.assetTypes.stock.map(asset => asset.amount)),
                    stockAccount: JSON.stringify(this.assetTypes.stock.map(asset => asset.accountNumber)),
                    stockBank: JSON.stringify(this.assetTypes.stock.map(asset => asset.bank)),
                    loanAmount: this.loanDetails.loanAmount,
                    loanPurpose: this.loanDetails.loanPurpose,
                    period: this.loanDetails.period,
                    interest: this.loanDetails.interest
                };

                // 전송할 데이터 로그 출력
                console.log("전송 데이터:", updatedData);

                // 서버에 자산 및 대출 정보 업데이트 요청
                this.updateData(updatedData);
            }
            this.editMode = !this.editMode; // 수정 모드 토글
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
.asset-manager .asset-section {
    margin-bottom: 40px;
}
.loan-section {
    margin-top: 20px;
    margin-bottom: 40px;
}
.input-row {
    display: flex;
    align-items: center;
    gap: 10px;
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
