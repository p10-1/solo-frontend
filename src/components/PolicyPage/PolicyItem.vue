<template>
  <div class="policy-card">
    <h2 class="policy-title">{{ policy.polyBizSjnm }}</h2>
    <p class="policy-description">{{ policy.polyItcnCn }}</p>

    <div class="policy-link">
      <template v-if="policy.rqutUrla && policy.rqutUrla !== '-' && policy.rqutUrla !== 'null'">
        <a :href="policy.rqutUrla" target="_blank">{{ policy.rqutUrla }}</a>
      </template>
      <template v-else>
        <span>링크 없음</span>
      </template>
    </div>

    <button class="toggle-button" @click="toggleSporCn">
      {{ showSporCn ? '상세 숨기기' : '상세 보기' }}
    </button>

    <div v-if="showSporCn" class="policy-details">
      <p>상세 정보: {{ policy.sporCn }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    policy: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showSporCn: false // 초기값은 false로 설정
    }
  },
  methods: {
    toggleSporCn() {
      this.showSporCn = !this.showSporCn // 클릭 시 상태 토글
    }
  }
}
</script>

<style scoped>
.policy-card {
  border: 1px solid #ddd; /* 카드 테두리 */
  border-radius: 8px; /* 둥근 모서리 */
  padding: 16px; /* 패딩 */
  margin: 16px; /* 카드 간격 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  transition: transform 0.2s; /* 호버 효과 */
}

.policy-card:hover {
  transform: scale(1.05); /* 호버 시 확대 효과 */
}

.policy-title {
  font-size: 1.5em; /* 정책 제목 크기 */
  margin-bottom: 8px; /* 아래 여백 */
}

.policy-description {
  margin-bottom: 8px; /* 아래 여백 */
}

.policy-link {
  margin-bottom: 8px; /* 아래 여백 */
}

.toggle-button {
  background-color: #007bff; /* 버튼 배경 색상 */
  color: white; /* 버튼 글자 색상 */
  border: none; /* 테두리 없음 */
  border-radius: 4px; /* 둥근 모서리 */
  padding: 8px 12px; /* 패딩 */
  cursor: pointer; /* 커서 포인터 */
}

.toggle-button:hover {
  background-color: #0056b3; /* 호버 시 버튼 배경 색상 */
}

.policy-details {
  margin-top: 12px; /* 위 여백 */
  color: #666; /* 상세 정보 색상 */
}
</style>
