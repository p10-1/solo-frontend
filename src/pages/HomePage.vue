<template>
  <div class="homepage-page"></div>
  <h2>메인 홈페이지</h2>
  <div class="top-section">
    <div class="left">
      <QuizCard />
      <PolicyCard />
      <PointCard />
      <NewsCard />
      <BoardCard />
      <!-- <AssetStep /> -->
      <!-- <AssetConsume /> -->
    </div>
  </div>
</template>

<script>
import QuizCard from '@/components/HomePage/QuizCard.vue'
import PolicyCard from '@/components/HomePage/PolicyCard.vue'
import PointCard from '@/components/HomePage/PointCard.vue'
import NewsCard from '@/components/HomePage/NewsCard.vue'
import BoardCard from '@/components/HomePage/BoardCard.vue'
//import AssetStep from '@/components/HomePage/AssetStep.vue'
//import AssetConsume from '@/components/HomePage/AssetConsume.vue'

export default {
  components: {
    QuizCard,
    PolicyCard,
    PointCard,
    NewsCard,
    BoardCard
    // AssetStep,
    //AssetConsume
  }
}
</script>
<style scoped></style>
