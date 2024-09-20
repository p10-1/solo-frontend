<template>
  <div class="policy-card-container">
    <div class="policy-card" v-for="policy in policies" :key="policy.id">
      <div class="policy-details">
        <h3>{{ policy.title }}</h3>
        <p>{{ policy.summary }}</p>
      </div>
      <router-link :to="policy.detailPage">
        <span class="arrow">→</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      policies: [
        {
          id: 1,
          title: '부동산 정책',
          summary: '지역별 부동산 정책 분석과 어떻게 이해해야 할지에 대한 가이드.',
          detailPage: '/policies/real-estate'
        },
        {
          id: 2,
          title: '저축 계획 지원',
          summary: '저축을 촉진하기 위한 정부의 새로운 정책과 어떤 혜택이 있는지.',
          detailPage: '/policies/savings'
        },
        {
          id: 3,
          title: '퇴직 연금 개편',
          summary: '퇴직 연금 관련 변경사항과 그 영향에 대한 전문가 분석.',
          detailPage: '/policies/retirement'
        }
      ]
    }
  }
}
</script>

<style scoped>
.policy-card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 20px;
}

.policy-card {
  background: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  margin: 10px;
  transition: transform 0.3s ease;
}

.policy-card:hover {
  transform: translateY(-5px);
}

.policy-details {
  padding: 20px;
}

.policy-details h3 {
  color: #333;
  font-size: 18px;
}

.policy-details p {
  color: #666;
  font-size: 14px;
  margin-top: 5px;
}

.arrow {
  font-size: 24px;
  color: #007bff; /* Bootstrap primary blue */
  padding: 20px;
  text-align: right;
}
</style>
