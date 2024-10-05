<template>
  <div class="main-left-box text-align-center">
    <div class="main-asset-box">
    </div>
  </div>
  <div class="main-right-box margin-bottom-1rem">
    <div class="point-priview">
      <PointCard />
    </div>
    <div class="margin-bottom-1rem">
      <QuizCard />
      <BoardCard />
      <PolicyCard />
      <ProductCard />
    </div>
  
  </div>
  <NewsCard />
</template>

<script>
import QuizCard from '@/components/HomePage/QuizCard.vue'
// import Distribution from '@/components/AssetPage/Distribution.vue'
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
  <style scoped>
  .main-clear {
    overflow: hidden;
    width: 100%;
  }

  .layoutFlex {
    display: flex;
    flex-wrap: wrap;
    gap: 0 40px;
  }

  .layoutFlex .li {
    width: calc(100% / 2 - 20px);

    overflow: hidden;
  }

  .asset-empty {
    background-color: #485168;
    min-height: 100px;
    line-height: 100px;
    color: #fff;
    text-align: center;
  }

  .small-text {
    font-size: 1.5rem;
  }
  </style>
