<template>
  <div class="asset-manager">
    <div class="asset-section" v-for="(assets, type) in assetTypes" :key="type">
      <h3>{{ type }}</h3>
      <div class="input-row">
        <select v-model="newAsset[type].bank">
          <option disabled value="">은행 선택</option>
          <option v-for="bank in banks" :key="bank" :value="bank">{{ bank }}</option>
        </select>
        <input v-model="newAsset[type].accountNumber" placeholder="계좌번호 입력" />
        <input type="number" v-model.number="newAsset[type].amount" placeholder="금액 입력" />
        <button @click="addAsset(type)">추가</button>
      </div>
      <ul>
        <li v-for="(asset, index) in assets" :key="index">
          {{ asset.bank }} - {{ asset.accountNumber }}: {{ asset.amount.toLocaleString() }}원
          <button @click="removeAsset(type, index)">삭제</button>
        </li>
      </ul>
      <h4>총합: {{ totalAmount(assets) }}원</h4>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      assetTypes: {
        현금자산: [],
        증권자산: [],
        부동산자산: [],
        보험자산: [],
        대출자산: []
      },
      newAsset: {
        현금자산: { bank: '', accountNumber: '', amount: 0 },
        증권자산: { bank: '', accountNumber: '', amount: 0 },
        부동산자산: { bank: '', accountNumber: '', amount: 0 },
        보험자산: { bank: '', accountNumber: '', amount: 0 },
        대출자산: { bank: '', accountNumber: '', amount: 0 }
      },
      banks: ['국민은행', '우리은행', '신한은행', '하나은행']
    }
  },
  methods: {
    addAsset(type) {
      if (
        this.newAsset[type].bank &&
        this.newAsset[type].accountNumber &&
        this.newAsset[type].amount
      ) {
        this.assetTypes[type].push({ ...this.newAsset[type] })
        this.newAsset[type].bank = ''
        this.newAsset[type].accountNumber = ''
        this.newAsset[type].amount = 0
      }
    },
    removeAsset(type, index) {
      this.assetTypes[type].splice(index, 1)
    },
    totalAmount(assets) {
      return assets.reduce((sum, asset) => sum + asset.amount, 0).toLocaleString()
    }
  }
}
</script>

<style scoped>
.asset-manager .asset-section {
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
