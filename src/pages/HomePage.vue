<template>
  <div class="main-top">
    <div class="main-top-item item-box">여긴 그래프</div>
    <div class="main-top-item">
      <div class="item-box">
        <PointCard />
      </div>
      <div class="item-box">
        <QuizCard />
      </div>
      <BoardCard />
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
  margin-top: -3.5rem;
  padding-top: 28px;
  padding-bottom: 52px;
  background: linear-gradient(180deg, #f7fafe 63.02%, #fff);
  display: flex;
  justify-content: space-between;
}

.main-top .item-box {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 10px 0 rgba(17, 42, 128, 0.04);
}

.main-top .main-top-item {
  flex-grow: 1;
  flex-basis: 0;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
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

.layout-2 {
  display: flex;
  justify-content: space-between;
}

.layout-3 {
  display: flex;
  justify-content: space-between;
}
</style>
