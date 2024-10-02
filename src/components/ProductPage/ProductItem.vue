<template>
  <div class="product-card">
    <h2 class="product-name">{{ product.finPrdtNm }}</h2>
    <p class="company-name">{{ product.korCoNm }}</p>
    <p class="interest-rate">우대조건: {{ product.mtrtInt }}</p>

    <!-- 상세보기 버튼 -->
    <button class="btn btn-primary" @click="toggleDetails">
      {{ showDetails ? '숨기기' : '상세보기' }}
    </button>

    <!-- 상세 정보 -->
    <div v-if="showDetails" class="mt-3">
      <!-- 저장기간, 이자율, 최고우대금리 표로 보여주기 -->
      <table class="table table-bordered">
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
      <div v-if="product.etcNote" class="mt-3">
        <p><strong>기타 메모:</strong> {{ product.etcNote }}</p>
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
  border: 1px solid #ddd; /* 카드 테두리 */
  border-radius: 8px; /* 둥근 모서리 */
  padding: 16px; /* 패딩 */
  margin: 16px; /* 카드 간격 */
  box-shadow: 0 2px 4;
}
</style>
