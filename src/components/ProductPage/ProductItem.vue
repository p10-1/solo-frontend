<template>
  <div class="product-card">
    <div class="title-box">
      <div class="company-name">{{ product.korCoNm }}</div>
      <h2 class="product-name">{{ product.finPrdtNm }}</h2>
      <button class="link" @click="toggleDetails">
        {{ showDetails ? '숨기기' : '+ 상세보기' }}
      </button>
    </div>
    <div class="interest-rate">우대조건: {{ product.mtrtInt }}</div>
    <!-- 상세보기 버튼 -->

    <!-- 상세 정보 -->
    <div v-if="showDetails" class="mt-3">
      <!-- 저장기간, 이자율, 최고우대금리 표로 보여주기 -->
      <table class="table">
        <thead>
          <tr>
            <th>저축 기간</th>
            <th>이자율</th>
            <th>최고우대금리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(option, index) in optionData" :key="index">
            <td>{{ option.saveTrm }}</td>
            <td>{{ option.intrRate }}%</td>
            <td>{{ option.intrRate2 }}%</td>
          </tr>
        </tbody>
      </table>

      <!-- 기타 메모 -->
      <div v-if="product.etcNote" class="memo-box margin-top-2rem">
        <span class="text-accent">※ 기타 메모</span><br />{{ product.etcNote }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fetchOption } from '@/api/productApi'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const showDetails = ref(false)
const optionData = ref([])

async function toggleDetails() {
  if (showDetails.value) {
    showDetails.value = !showDetails.value
    return
  }

  const optionId = props.product.finPrdtCd

  try {
    const data = await fetchOption(optionId)
    optionData.value = data
    console.log('data: ', data)
    showDetails.value = !showDetails.value
  } catch (error) {
    console.error('데이터를 불러오는 데 실패했습니다:', error)
  }
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
