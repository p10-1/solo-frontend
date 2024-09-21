<template>
  <div class="asset-manager">

      <!-- 소비 입력 폼 -->
      <div class="consume-section">
          <h3>소비 입력</h3>
          <select v-model="ConsumeType">
              <option disabled value="">소비 유형 선택:</option>
              <option value="유형1">유형1</option>
              <option value="유형2">유형2</option>
              <option value="유형3">유형3</option>
              <option value="유형4">유형4</option>
          </select>
      </div>

      <div class="asset-section" v-for="(assets, type) in assetTypes" :key="type">
          <!-- assetType명 뜨게하기 -->
          <h3>{{ type }}</h3>
          <!-- newAssets순회하면서 새로운 입력폼 생성 -->
          <div v-for="(asset, index) in newAssets[type]" :key="index" class="input-row">
              <select v-model="asset.bank">
                  <option disabled value="">선택</option>
                  <option v-for="bank in banks[type]" :key="bank" :value="bank">{{ bank }}</option>
              </select>
              <input v-model="asset.accountNumber" placeholder="계좌번호 입력" />
              <input type="number" v-model.number="asset.amount" placeholder="금액 입력" />
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

      <button @click="submitAllAssets">자산 입력완료</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
      return {
          assetTypes: {
              현금자산: [],
              증권자산: [],
              부동산자산: [],
              예적금자산: []
          },
          newAssets: {
              현금자산: [{ bank: '', accountNumber: '', amount: 0 }],
              증권자산: [{ bank: '', accountNumber: '', amount: 0 }],
              부동산자산: [{ bank: '', accountNumber: '', amount: 0 }],
              예적금자산: [{ bank: '', accountNumber: '', amount: 0 }]
          },
          banks: {
              현금자산: ['국민은행', '우리은행', '신한은행', '하나은행'],
              증권자산: ['KB증권', '우리증권','신한증권', '하나증권'],
              부동산자산: ['아파트', '대지'],
              예적금자산: ['농협', '신협','국민은행']
          },
          ConsumeType: '' 
      }
  },
  methods: {
      //입력 폼 추가
      addAsset(type) {
          this.newAssets[type].push({ bank: '', accountNumber: '', amount: 0 });
      },

      // 입력 폼 삭제
      removeNewAsset(type, index) {
          this.newAssets[type].splice(index, 1);
      },
      TotalAmount(type) {
          if (!this.newAssets[type]) {
              return 0; // newAssets[type]가 존재하지 않는 경우 0 반환
          }

          const newAssetsTotal = this.newAssets[type].reduce((sum, asset) => sum + (asset.amount || 0), 0);

          if (!this.assetTypes[type]) {
              return newAssetsTotal.toLocaleString(); // assetTypes[type]가 존재하지 않는 경우 newAssetsTotal만 반환
          }

          const existingAssetsTotal = this.assetTypes[type].reduce((sum, asset) => sum + asset.amount, 0);

          return (newAssetsTotal + existingAssetsTotal).toLocaleString();
      },
      async submitAllAssets() {
    // 전송할 데이터 구조
    const dataToSubmit = {
        consumeType: this.ConsumeType, 
        assets: {}
    };

    // 자산 유형에서 amount만 가져오기
    for (const type in this.newAssets) {
        dataToSubmit.assets[type] = this.newAssets[type].map(asset => ({
            amount: asset.amount 
        }));
    }

    try {
        const response = await axios.post('/api/mypage/insertAsset', dataToSubmit, { withCredentials: true });
        console.log('서버 응답:', response.data);
        alert('자산과 소비 데이터가 성공적으로 저장되었습니다.');
    } catch (error) {
        console.error('서버 요청 실패:', error);
        alert('자산과 소비 데이터 저장 실패. 다시 시도해 주세요.');
    }
}

  } 
}
</script>

<style scoped>
.asset-manager .asset-section {
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
