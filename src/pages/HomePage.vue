<template>
  <div class="homepage-page">
    <h2>메인 홈페이지</h2>
    <div class="top-section">
      <div class="left">
        <PointCard />
        <QuizCard />
        <BoardCard />
        <PolicyCard />
        <NewsCard />
      </div>
    </div>
  </div>
</template>

<script>
import QuizCard from '@/components/HomePage/QuizCard.vue'
import PolicyCard from '@/components/HomePage/PolicyCard.vue'
import PointCard from '@/components/HomePage/PointCard.vue'
import NewsCard from '@/components/HomePage/NewsCard.vue'
import BoardCard from '@/components/HomePage/BoardCard.vue'

export default {
  components: {
    QuizCard,
    PolicyCard,
    PointCard,
    NewsCard,
    BoardCard
  }
}
</script>

<style scoped>
.homepage-page {
  display: flex;
  flex-direction: column;
  align-items: center; /* 수평 가운데 정렬 */
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 30px; /* 제목과 섹션 간 여백 */
}

.top-section {
  display: flex;
  justify-content: center; /* 수평으로 가운데 정렬 */
  width: 100%;
}

.left {
  display: flex;
  flex-direction: column; /* 세로 방향 정렬 */
  align-items: center; /* 수평 가운데 정렬 */
  gap: 20px; /* 각 카드 간의 간격 */
  width: 100%;
  max-width: 800px; /* 적절한 너비 설정 */
}

.left > * {
  width: 100%; /* 카드가 화면의 너비를 적절히 채우도록 설정 */
  max-width: 600px; /* 카드의 최대 너비 설정 */
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 카드에 그림자 효과 */
}
</style>
