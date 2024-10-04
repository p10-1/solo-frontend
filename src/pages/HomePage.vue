<template>
  <div class="homepage-page"></div>
  <h2>로그인 후 메인 홈페이지(수정중)</h2>
  <div class="top-section">
    <div class="left">
      <QuizCard />
      <BoardCard />
      <NewsCard />
      <PolicyCard />
      <ProductCard />
    </div>
  </div>
</template>

<script>
import QuizCard from '@/components/HomePage/QuizCard.vue'
import PolicyCard from '@/components/HomePage/PolicyCard.vue'
import NewsCard from '@/components/HomePage/NewsCard.vue'
import BoardCard from '@/components/HomePage/BoardCard.vue'
import ProductCard from '@/components/HomePage/ProductCard.vue'
export default {
  components: {
    QuizCard,
    BoardCard,
    PolicyCard,
    NewsCard,
    ProductCard
  }
}
</script>
<style scoped></style>
