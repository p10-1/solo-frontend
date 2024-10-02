<template>
  <article class="main-left-box text-align-center">
    <div class="main-asset-box">
      <span class="label-type-green margin-bottom-1rem">안전 추구형</span>
      <!-- <span class="label-type-blue margin-bottom-1rem">자산 분산형</span>
        <span class="label-type-red margin-bottom-1rem">위험 추구형</span>
        <span class="label-type-purple margin-bottom-1rem">대출 우선형</span> -->
      <div class="main-asset-info">
        <div class="font-weight-bold">
          <span class="text-accent">닉네임 표시</span>님 자산 관리 현황
        </div>
        <div class="margin-top-1rem">
          <b class="margin-right-1rem font-weight-bold">총 자산</b>
          <span class="text-accent">0</span><span class="small-text">원</span>
        </div>
      </div>
      <div class="main-asset-graph">
        통계 그래프 표시
        <ul class="asset-graph-list">
          <li class="sefe">현금자산</li>
          <li class="warring">예적금</li>
          <li class="warring-1">주식</li>
          <li class="warring-2">보험</li>
          <li class="warring-3">자산</li>
        </ul>
      </div>
      <a class="button-main width100 margin-top-1rem" href="#">
        자산 분석 자세히 보기 <i class="">></i>
      </a>
    </div>
  </article>
  <article class="main-right-box margin-bottom-1rem">
    <div class="point-priview">
      <PointCard />
    </div>
    <div class="margin-bottom-1rem">
      <QuizCard />
    </div>
    <BoardList />
  </article>
  <article class="main-center-box">
    <PolicyCard />
  </article>
  <article class="main-center-box">
    <NewsCard />
  </article>
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
<style scoped>
.small-text {
  font-size: 1.5rem;
}
</style>
