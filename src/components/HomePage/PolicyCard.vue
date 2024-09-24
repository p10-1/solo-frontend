<template>
  <div class="policy-summary">
    <h3>정책 요약</h3>
    <ul>
      <li v-for="policy in policies" :key="policy.id" class="policy-item">
        <h4>{{ policy.title }}</h4>
        <p>{{ policy.description }}</p>
      </li>
    </ul>
    <router-link to="/policy" class="more-link">더보기 →</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      policies: [
        { id: 1, title: '청년 지원 정책', description: '청년층을 위한 지원 정책을 제공합니다.' },
        {
          id: 2,
          title: '소상공인 지원 정책',
          description: '소상공인들을 위한 자금 지원 정책입니다.'
        },
        { id: 3, title: '농업인 지원 정책', description: '농업인을 위한 지원과 혜택 제공.' }
      ]
    }
  }
}
</script>

<style scoped>
.policy-summary {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.policy-summary h3 {
  margin-bottom: 20px;
  color: #2c3e50;
  border-bottom: 2px solid #20c997;
  padding-bottom: 10px;
}

.policy-item {
  margin-bottom: 15px;
}

.policy-item h4 {
  font-size: 18px;
  color: #333;
}

.policy-item p {
  color: #666;
}

.more-link {
  display: block;
  text-align: right;
  color: #3498db;
  font-weight: bold;
  text-decoration: none;
  margin-top: 15px;
}

.more-link:hover {
  color: #2980b9;
}
</style>
