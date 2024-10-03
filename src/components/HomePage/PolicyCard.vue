<template>
  <div class="policy-card-container">
    <div class="title-box">
      <h1 class="title">추천 <b>정책</b></h1>
      <span>더보기</span>
    </div>
    <div class="policy-list layout-flex">
      <div class="policy-card" v-for="policy in policies" :key="policy.id">
        <h3 class="title">{{ policy.title }}</h3>
        <p class="content margin-bottom">{{ policy.summary }}</p>
        <router-link :to="policy.detailPage">
          <span class="button-main"><i></i>자세히 보기</span>
        </router-link>
      </div>
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
.policy-list {
  justify-content: space-between;
  margin: 40px 0 20px;
}
.policy-card {
  border: 1px solid #eee;
  width: calc(32.5% - 10px);
  gap: 0 20px;
  color: #222;
  padding: 24px 0 52px;
}

.policy-card h3.title {
  padding: 0;
  margin: 12px 0;
  font-size: 24px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.policy-card p.content {
  font-weight: 400;
  color: #666;
  font-size: 18px;
  margin-top: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  height: 100px;
  line-height: 24px;
  letter-spacing: -0.7px;
}

.margin-bottom {
  margin-bottom: 2rem;
}

.button-main {
  width: 100%;
  border-radius: 0;
  height: 45px;
  line-height: 45px;
}

/* .policy-card-container {
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
/* 
  padding: 20px;
  text-align: right;
} */
</style>
