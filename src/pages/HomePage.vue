<template>
  <div class="homepage-page"></div>
  <h2>로그인 후 메인 홈페이지(수정중)</h2>
  <div class="top-section">
    <div class="left">
      <QuizCard />
      <PolicyCard />
      <PointCard />
      <NewsCard />
      <PolicyCarousel />
    </div>
  </div>
</template>

<script>
import QuizCard from '@/components/HomePage/QuizCard.vue'
import PolicyCard from '@/components/HomePage/PolicyCard.vue'
import PointCard from '@/components/HomePage/PointCard.vue'
import NewsCard from '@/components/HomePage/NewsCard.vue'
import PolicyCarousel from '@/components/PolicyPage/PolicyCarousel.vue'
export default {
  components: {
    QuizCard,
    PolicyCard,
    PointCard,
    NewsCard,
    PolicyCarousel
  }
}
</script>
<style scoped></style>
