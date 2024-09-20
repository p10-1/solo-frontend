<template>
  <div class="homepage-page"></div>
  <h2>로그인 후 메인 홈페이지(수정중)</h2>
  <div class="top-section">
    <div class="left">
      <QuizCard />
      <PolicyCard />
      <PointCard />
      <NewsCard />
    </div>
  </div>
</template>

<script>
import QuizCard from '@/components/HomePage/QuizCard.vue'
import PolicyCard from '@/components/HomePage/PolicyCard.vue'
import PointCard from '@/components/HomePage/PointCard.vue'
import NewsCard from '@/components/HomePage/NewsCard.vue'

export default {
  components: {
    QuizCard,
    PolicyCard,
    PointCard,
    NewsCard
  }
}
</script>
<style scoped></style>
