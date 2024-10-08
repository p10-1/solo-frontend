<template>
  <div class="main-top">
    <div class="main-top-item" style="width: 55%">
      <div class="item-box">
        <h2 class="main-title">내 자산 현황</h2>
        <div class="empty-box">여긴 그래프</div>
      </div>
    </div>
    <div class="main-top-item" style="width: 45%">
      <div class="item-box">
        <CategoryList />
      </div>
      <div class="item-box">
        <QuizCard />
      </div>
    </div>
  </div>
  <BoardCard />
  <NewsCard />
  <!-- <div class="layout-2">
    <PolicyCard />
    <ProductCard />
  </div> -->
</template>

<script>
import QuizCard from '@/components/HomePage/QuizCard.vue'
// import Distribution from '@/components/AssetPage/Distribution.vue'
import CategoryList from '@/components/HomePage/CategoryList.vue'
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
    ProductCard,
    CategoryList
  }
}
</script>
<style scoped>
.main-top {
  margin-top: -2.25rem;
  /* background: #f3f3ff; */
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
}

.main-top .empty-box {
  width: 100%;
  border-radius: 25px;
  padding: 2rem 1.7rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.main-top .main-top-item {
  flex-grow: 1;
  /* flex-basis: 0; */
  display: flex;
  flex-direction: column;
}

.main-top .item-box {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: flex-start;
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
</style>
