<template>
  <!-- <PromotionSlide /> -->
  <div class="main-top">
    <div class="main-top-item">
      <IntroMainslide v-if="!isLoggedIn" />
      <MainslideList v-if="isLoggedIn" />
    </div>
    <div class="main-top-item">
      <div class="item-box">
        <CategoryList />
      </div>
      <div class="item-box">
        <QuizCard />
      </div>
    </div>
  </div>
  <BoardCard />
  <div class="main-bottom">
    <div class="main-bottom-item">
      <NewsCard />
    </div>
    <div class="main-bottom-item">
      <PolicyCard />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import IntroMainslide from '@/components/HomePage/IntroMainslide.vue'
import MainslideList from '@/components/HomePage/MainslideList.vue'
import CategoryList from '@/components/HomePage/CategoryList.vue'
import QuizCard from '@/components/HomePage/QuizCard.vue'
import PolicyCard from '@/components/HomePage/PolicyCard.vue'
import NewsCard from '@/components/HomePage/NewsCard.vue'
import BoardCard from '@/components/HomePage/BoardCard.vue'
// import PromotionSlide from '@/components/HomePage/PromotionSlide.vue'
// import AssetSummary from '@/components/HomePage/AssetSummary.vue'
// import ProductCard from '@/components/HomePage/ProductCard.vue'

import { ref } from 'vue'
// 로그인 전후
const isLoggedIn = ref(false)

export default {
  components: {
    IntroMainslide,
    MainslideList,
    CategoryList,
    QuizCard,
    BoardCard,
    PolicyCard,
    NewsCard
  },
  setup() {
    const authStore = useAuthStore()

    // 로그인 상태를 스토어에서 가져옴
    const isLoggedIn = computed(() => authStore.isLoggedIn)

    // 사용자 이름을 스토어에서 가져옴 (필요한 경우)
    const username = computed(() => authStore.username)

    return {
      isLoggedIn,
      username
    }
  }
}
</script>
<style scoped>
.main-top {
  margin-top: -2.25rem;
  /* background: #f3f3ff; */
  display: flex;
  justify-content: flex-start;
  gap: 4.6rem;
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
  /* flex-grow: 1; */
  /* flex-basis: 0; */
  display: flex;
  flex-direction: column;
}

.main-top .main-top-item:first-child {
  width: 55%;
}

.main-top .main-top-item:last-child {
  width: 45%;
}

.main-top .item-box {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: flex-start;
}

.main-bottom {
  display: flex;
  justify-content: space-between;
  gap: 4.6rem;
  padding: 20px;
}
.main-bottom .main-bottom-item {
  width: calc(50% - 2.3rem);
  flex-grow: 1;
  display: flex;
  justify-content: flex-start;
}
</style>
