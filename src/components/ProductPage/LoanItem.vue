<template>
  <div class="product-card">
    <div class="title-box">
      <div class="company-name">{{ props.loan.korCoNm }}</div>
      <h2 class="product-name">{{ props.loan.finPrdtNm }}</h2>
      <button class="link" @click="toggleDetails">
        {{ showDetails ? '숨기기' : '+ 상세보기' }}
      </button>
    </div>
    <div class="interest-rate">대출 한도: {{ props.loan.loanLmt }}</div>
    <!-- 상세보기 버튼 -->

    <!-- 상세 정보 -->
    <div v-if="showDetails" class="mt-3">
      <!-- 저장기간, 이자율, 최고우대금리 표로 보여주기 -->
      <table class="table">
        <thead>
          <tr>
            <th>중도상환 수수료</th>
            <th>연체 이자율</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ props.loan.erlyRpayFee }}</td>
            <td>{{ props.loan.dlyRate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  loan: {
    type: Object,
    required: true
  }
})

const showDetails = ref(false)

async function toggleDetails() {
  showDetails.value = !showDetails.value
}
</script>

<style scoped>
.product-card {
  width: 100%;
  min-height: 8rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px #cfc6fd;
  border-radius: 25px;
  padding: 2rem 1.7rem;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.product-card .company-name {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.5px;
  background-color: #6846f5;
  color: #fff;
  padding: 3px 8px;
  line-height: 1;
  border-radius: 20px;
  margin-bottom: 8px;
}

.product-card .product-name {
  font-size: 1.22rem;
  word-break: keep-all;
  line-height: 1.6rem;
  letter-spacing: -1px;
}
.product-card .interest-rate {
  border-top: 1px dashed #e4deff;
  padding-top: 10px;
  font-size: 0.9rem;
  color: #333;
  font-weight: 400;
  word-break: keep-all;
  line-height: 24px;
  letter-spacing: -1px;
  font-weight: 400;
  margin: 10px 0 0;
  white-space: pre-line;
}

.product-card .memo-box {
  background: rgb(247, 208, 149, 0.25);
  padding: 1.7rem;
  border-radius: 27px;
  font-size: 0.9rem;
  color: #333;
  font-weight: 400;
  word-break: keep-all;
  line-height: 24px;
  letter-spacing: -1px;
  font-weight: 400;
  margin: 10px 0 0;
  white-space: pre-line;
}
.product-card .memo-box .text-accent {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
}
</style>
