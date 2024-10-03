<template>
  <div class="main-left-box text-align-center">
    <div class="main-asset-box">
      <!-- <span class="label-type-green margin-bottom-1rem">안전 추구형</span>
      <span class="label-type-blue margin-bottom-1rem">자산 분산형</span>
      <span class="label-type-red margin-bottom-1rem">위험 추구형</span>
      <span class="label-type-purple margin-bottom-1rem">대출 우선형</span>
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
      </div> -->
    </div>
  </div>
  <div class="main-right-box margin-bottom-1rem">
    <div class="point-priview">
      <PointCard />
    </div>
    <div class="margin-bottom-1rem">
      <QuizCard />
    </div>
    <!-- <BoardList /> -->
  </div>
  <div class="main-center-box">
    <NewsCard />
  </div>
  <div class="layoutFlex">
    <div class="li">
      <div class="title-box">
        <h1 class="title">추천 <b>상품</b></h1>
        <span>더보기</span>
      </div>
      <div class="asset-empty">대출 상품 소개 컴포넌트 예정</div>
    </div>
    <div class="li">
      <PolicyCard />
    </div>
  </div>
</template>

<script>
import QuizCard from '@/components/HomePage/QuizCard.vue'
import PolicyCard from '@/components/HomePage/PolicyCard.vue'
import PointCard from '@/components/HomePage/PointCard.vue'
import NewsCard from '@/components/HomePage/NewsCard.vue'
import BoardList from '@/components/CommunityPage/BoardList.vue'
import PolicyCarousel from '@/components/PolicyPage/PolicyCarousel.vue'
export default {
  components: {
    QuizCard,
    PolicyCard,
    PointCard,
    NewsCard,
    BoardList,
    PolicyCarousel
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
