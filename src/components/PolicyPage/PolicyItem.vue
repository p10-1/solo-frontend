<template>
  <a :href="policy.rqutUrla" target="_blank" class="policy-link-wrapper">
    <div class="policy-card">
      <h2 class="policy-title">{{ policy.polyBizSjnm }}</h2>
      <p class="policy-description">{{ policy.polyItcnCn }}</p>
    </div>
  </a>
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
.policy-link-wrapper {
  text-decoration: none; /* 링크 자체에 밑줄 제거 */
}

.policy-card {
  display: block;
  background-color: #fbf5ef;
  width: 600px;
  color: black;
  border-radius: 12px;
  padding: 16px;
  margin: 16px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.policy-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.35);
}

.policy-title,
.policy-description {
  text-align: center;
  text-decoration: none; /* 텍스트 내부에도 링크 밑줄 제거 */
  color: inherit; /* 링크 색상 상속 */
}

@media (max-width: 768px) {
  .policy-card {
    width: 100%;
  }
}
</style>
