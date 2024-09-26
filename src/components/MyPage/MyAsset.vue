<template>
    <div class="asset-manager">
        <h1>자산 관리</h1><br /><br />
        <!-- 수정하기 버튼 -->
        <button @click="isEditing = !isEditing">{{ isEditing ? '취소' : '수정하기' }}</button>

        <!-- 소비 입력 폼 -->
        <div class="consume-section">
            <h3>소비 입력</h3>
            <select v-model="consumeType">
                <option disabled value="">소비 유형 선택:</option>
                <option value="유형1">유형1</option>
                <option value="유형2">유형2</option>
                <option value="유형3">유형3</option>
                <option value="유형4">유형4</option>
            </select>
            <button v-if="isEditing" @click="markConsumeAsNoChanges">수정내용없음</button>
        </div>

        <div class="asset-section" v-for="(assets, type) in assetTypes" :key="type">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <h3>{{ type }}</h3>
                <button v-if="isEditing" @click="markAssetsAsNoChanges(type)">수정내용없음</button>
            </div>
            <div v-for="(asset, index) in newAssets[type]" :key="index" class="input-row">
                <select v-model="asset.bank" @change="handleBankChange(asset)">
                    <option disabled value="">선택</option>
                    <option v-for="bank in banks[type]" :key="bank" :value="bank">{{ bank }}</option>
                </select>
                <input v-model="asset.accountNumber" placeholder="계좌번호 입력"
                    :disabled="asset.bank === '해당 자산 없음' || asset.isDisabled" />
                <input type="number" v-model.number="asset.amount" placeholder="금액 입력"
                    :disabled="asset.bank === '해당 자산 없음' || asset.isDisabled" />
                <button v-if="newAssets[type].length > 1 && index === newAssets[type].length - 1"
                    @click="removeNewAsset(type, index)">삭제</button>
            </div>
            <button @click="addAsset(type)">추가</button>
            <ul>
                <li v-for="(asset, index) in assets" :key="index">
                    {{ asset.bank }} - {{ asset.accountNumber }}: {{ asset.amount.toLocaleString() }}원
                </li>
            </ul>
            <h4>자산합계: {{ TotalAmount(type) }}원</h4>
        </div>

        <!-- 대출 자산 입력 폼 -->
        <div class="loan-section">
            <h3>대출 자산 입력</h3>
            <div class="input-row">
                <select v-model="loanPurpose">
                    <option disabled value="">대출 목적 선택</option>
                    <option value="목적1">목적1</option>
                    <option value="목적2">목적2</option>
                    <option value="목적3">목적3</option>
                    <option value="목적4">목적4</option>
                    <option value="대출 없음">대출 없음</option>
                </select>
                <input v-model.number="loanAmount" type="number" placeholder="대출액 입력"
                    :disabled="loanPurpose === '대출 없음'" />
                <input v-model.number="period" placeholder="목표 상환 기간 (개월)" :disabled="loanPurpose === '대출 없음'" />
                <button v-if="isEditing" @click="markLoanAsNoChanges">수정내용없음</button>
            </div>
        </div>

        <!-- 수정 완료 버튼과 자산 입력 완료 버튼 -->
        <button @click="submitUpdatedAssets" v-if="isEditing">자산 수정완료</button>
        <button @click="submitAllAssets" v-if="!isEditing">자산 입력완료</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            isEditing: false, // 수정 모드 상태
            assetTypes: {
                현금자산: [],
                증권자산: [],
                부동산자산: [],
                예적금자산: []
            },
            newAssets: {
                현금자산: [{ bank: '', accountNumber: '', amount: 0, isDisabled: false }],
                증권자산: [{ bank: '', accountNumber: '', amount: 0, isDisabled: false }],
                부동산자산: [{ bank: '', accountNumber: '', amount: 0, isDisabled: false }],
                예적금자산: [{ bank: '', accountNumber: '', amount: 0, isDisabled: false }]
            },
            banks: {
                현금자산: ['해당 자산 없음', '국민은행', '우리은행', '신한은행', '하나은행'],
                증권자산: ['해당 자산 없음', 'KB증권', '우리증권', '신한증권', '하나증권'],
                부동산자산: ['해당 자산 없음', '아파트', '대지'],
                예적금자산: ['해당 자산 없음', '국민은행', '우리은행', '신한은행', '하나은행']
            },
            consumeType: '',
            loanAmount: null,
            loanPurpose: '',
            period: null
        };
    },
    methods: {
        addAsset(type) {
            this.newAssets[type].push({ bank: '', accountNumber: '', amount: 0, isDisabled: false });
        },
        removeNewAsset(type, index) {
            this.newAssets[type].splice(index, 1);
        },
        TotalAmount(type) {
            if (!this.newAssets[type]) {
                return 0;
            }

            const newAssetsTotal = this.newAssets[type].reduce((sum, asset) => {
                return sum + (asset.bank === '해당 자산 없음' ? 0 : (asset.amount || 0));
            }, 0);

            const existingAssetsTotal = this.assetTypes[type] ? this.assetTypes[type].reduce((sum, asset) => sum + asset.amount, 0) : 0;

            return (newAssetsTotal + existingAssetsTotal).toLocaleString();
        },
        async submitAllAssets() {
            // 소비 유형 유효성 검사
            if (!this.consumeType) {
                alert('소비 유형을 입력해 주세요.');
                return;
            }

            const dataToSubmit = {
                consume: this.consumeType === '' ? null : this.consumeType,
                cash: 0,
                stock: 0,
                property: 0,
                deposit: 0,
                loanAmount: 0,
                loanPurpose: "",
                period: 0
            };

            // 대출 관련 유효성 검사
            if (this.loanPurpose === '대출 없음') {
                dataToSubmit.loanPurpose = this.loanPurpose;
                dataToSubmit.loanAmount = 0; // 대출 없음일 경우
                dataToSubmit.period = 0; // 대출 없음일 경우
            } else {
                dataToSubmit.loanPurpose = this.loanPurpose || "";
                dataToSubmit.loanAmount = this.loanAmount || 0;
                dataToSubmit.period = this.period || 0;
            }

            for (const type in this.newAssets) {
                const totalAmount = this.newAssets[type].reduce((sum, asset) => {
                    // "해당 자산 없음"인 경우 0으로 처리
                    return sum + (asset.bank === '해당 자산 없음' ? 0 : (asset.amount || 0));
                }, 0);

                switch (type) {
                    case '현금자산':
                        dataToSubmit.cash = totalAmount > 0 ? totalAmount : 0; // 0으로 설정
                        break;
                    case '증권자산':
                        dataToSubmit.stock = totalAmount > 0 ? totalAmount : 0; // 0으로 설정
                        break;
                    case '부동산자산':
                        dataToSubmit.property = totalAmount > 0 ? totalAmount : 0; // 0으로 설정
                        break;
                    case '예적금자산':
                        dataToSubmit.deposit = totalAmount > 0 ? totalAmount : 0; // 0으로 설정
                        break;
                }
            }

            try {
                const response = await axios.post('/api/mypage/insertAsset', dataToSubmit, { withCredentials: true });
                console.log('서버 응답:', response.data);
                alert('자산과 소비 데이터가 성공적으로 저장되었습니다.');

                this.resetForm();
            } catch (error) {
                console.error('서버 요청 실패:', error);
                alert('자산과 소비 데이터 저장 실패. 다시 시도해 주세요.');
            }
        },

        markAssetsAsNoChanges(type) {
            this.newAssets[type].forEach(asset => {
                asset.isDisabled = true; // 입력창 비활성화
                asset.amount = null; // 금액을 null로 설정
                asset.bank = ''; // bank를 빈 값으로 설정하여 비활성화
                console.log("수정내용없음" + asset.amount);
            });

            console.log("수정사항 없음 후 상태:", JSON.stringify(this.newAssets, null, 2)); // 상태 확인
        },

        markConsumeAsNoChanges() {
            this.consumeType = null; // 소비 유형을 null로 설정
            console.log("소비 유형 수정내용 없음:", this.consumeType);
        },

        markLoanAsNoChanges() {
            this.loanPurpose = null; // 대출 목적을 null로 설정
            this.loanAmount = null; // 대출액을 null로 설정
            this.period = null; // 기간을 null로 설정
            console.log("대출 자산 수정내용 없음:", this.loanPurpose, this.loanAmount, this.period);
        },

        handleBankChange(asset) {
            if (asset.bank === '해당 자산 없음') {
                asset.amount = 0; // '해당 자산 없음' 선택 시 amount를 0으로 설정
                asset.isDisabled = true; // 입력창 비활성화
            } else {
                asset.isDisabled = false; // 다른 은행 선택 시 입력창 활성화
            }
        },

        async submitUpdatedAssets() {

            const dataToSubmit = {
                consume: this.consumeType,
                cash: null,
                stock: null,
                property: null,
                deposit: null,
                loanAmount: null,
                loanPurpose: null,
                period: null
            };

            // 대출 관련 유효성 검사
            if (this.loanPurpose === '대출 없음') {
                dataToSubmit.loanPurpose = this.loanPurpose;
                dataToSubmit.loanAmount = ""; // 빈 문자열
                dataToSubmit.period = 0; // 0
            } else {
                dataToSubmit.loanPurpose = this.loanPurpose || null;
                dataToSubmit.loanAmount = this.loanAmount !== null ? this.loanAmount : null;
                dataToSubmit.period = this.period !== null ? this.period : null;
            }

            console.log("전송 전:", JSON.stringify(this.newAssets, null, 2)); // 수정된 부분
            for (const type in this.newAssets) {
                const totalAmount = this.newAssets[type].reduce((sum, asset) => {
                    return sum + (asset.bank === '해당 자산 없음' ? 0 : (asset.amount || 0));
                }, 0);

                switch (type) {
                    case '현금자산':
                        dataToSubmit.cash = (totalAmount === null || this.newAssets[type].every(asset => asset.amount === null)) ? null : (totalAmount === 0 ? 0 : totalAmount);
                        break;
                    case '증권자산':
                        dataToSubmit.stock = (totalAmount === null || this.newAssets[type].every(asset => asset.amount === null)) ? null : (totalAmount === 0 ? 0 : totalAmount);
                        break;
                    case '부동산자산':
                        dataToSubmit.property = (totalAmount === null || this.newAssets[type].every(asset => asset.amount === null)) ? null : (totalAmount === 0 ? 0 : totalAmount);
                        break;
                    case '예적금자산':
                        dataToSubmit.deposit = (totalAmount === null || this.newAssets[type].every(asset => asset.amount === null)) ? null : (totalAmount === 0 ? 0 : totalAmount);
                        break;
                }
            }

            console.log('최종 전송할 데이터:', JSON.stringify(dataToSubmit, null, 2));

            try {
                const response = await axios.put('/api/mypage/updateAsset', dataToSubmit, { withCredentials: true });
                console.log('서버 응답:', response.data);
                alert('자산 데이터가 성공적으로 수정되었습니다.');

                this.resetForm();
            } catch (error) {
                console.error('수정 요청 실패:', error);
                alert('자산 데이터 수정 실패. 다시 시도해 주세요.');
            }
        },

        resetForm() {
            // 입력 폼 초기화
            this.newAssets = {
                현금자산: [{ bank: '', accountNumber: '', amount: 0, isDisabled: false }],
                증권자산: [{ bank: '', accountNumber: '', amount: 0, isDisabled: false }],
                부동산자산: [{ bank: '', accountNumber: '', amount: 0, isDisabled: false }],
                예적금자산: [{ bank: '', accountNumber: '', amount: 0, isDisabled: false }]
            };
            this.consumeType = '';
            this.loanAmount = null; // 대출액 초기화
            this.loanPurpose = ''; // 대출 목적 초기화
            this.period = null; // 기간 초기화
        }
    }
}
</script>




<style scoped>
.asset-manager .asset-section {
    margin-bottom: 40px;
}

.loan-section {
    margin-top: 20px;
    margin-bottom: 40px;
}

.consume-section {
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