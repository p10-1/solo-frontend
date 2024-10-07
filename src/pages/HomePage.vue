<template>
  <div class="main-top">
    <div class="main-top-item item-box">여긴 그래프</div>
    <div class="main-top-item">
      <div class="item-box">
        <QuizCard />
      </div>
      <div class="item-box">
        <BoardCard />
      </div>
    </div>
  </div>
  <NewsCard />
  <div class="layout-2">
    <PolicyCard />
    <ProductCard />
  </div>
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
// #eff5ff
</script>
<style scoped>
.main-top {
  margin-top: -2.25rem;
  background: linear-gradient(180deg, #f1eeff 63.02%, #fff);
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
}

.main-top .main-top-item {
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-top .item-box {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 10px 0 rgba(17, 42, 128, 0.04);
  width: 100%;
}

/* .layoutFlex {
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
} */

.layout-2-basline {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.layout-2-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.layout-3-baseline {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.layout-3-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
