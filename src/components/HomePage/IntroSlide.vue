<template>
  <div class="intro-slide-box">
    <!-- 슬라이더 전체 컨테이너 -->
    <h2 class="main-title">안녕하세요? 빚없솔입니다.</h2>
    <div class="main-slide-contents margin-top-1rem">
      <!-- 슬라이더 -->
      <swiper
        :pagination="{ clickable: true }"
        :modules="modules"
        :loop="true"
        :slides-per-view="1"
        :space-between="20"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        class="mySwiper"
      >
        <!-- 슬라이더 컴포넌트 설정 -->
        <swiper-slide>
          <router-link to="login">
            <div class="intro-card intro-card01">
              <h5 class="card-title">빚없솔에선<br />지금 자산 상태와 대출 추이를</h5>
              <div class="card-content">
                빚이 없는 솔로에서 자산과 대출을<br />한눈에 관리해보세요!
              </div>
              <div class="card-bottom">
                <router-link to="login" class="button-main"
                  >대출&자산 관리 시작하기 <i class="fa-solid fa-angle-right"></i
                ></router-link>
              </div>
            </div>
          </router-link>
        </swiper-slide>
        <swiper-slide>
          <router-link to="login">
            <div class="intro-card intro-card02">
              <h5 class="card-title">빚없솔에서<br />함께하며 공감대를</h5>
              <div class="card-content">
                커뮤니티에서 서로의 금융지식과,<br />경험을 공유하며 함께 해보아요!
              </div>
              <div class="card-bottom">
                <router-link to="login" class="button-main"
                  >대출&자산 관리 시작하기 <i class="fa-solid fa-angle-right"></i
                ></router-link>
              </div>
            </div>
          </router-link>
        </swiper-slide>
        <swiper-slide>
          <router-link to="login">
            <div class="intro-card intro-card03">
              <h5 class="card-title">티끌 모아<br />태산 부자되기!</h5>
              <div class="card-content">
                매일 금융 퀴즈를 맞추며,<br />포인트도 쌓고, 금융 상식도 쌓아요.
              </div>
              <div class="card-bottom">
                <router-link to="login" class="button-main"
                  >대출&자산 관리 시작하기 <i class="fa-solid fa-angle-right"></i
                ></router-link>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script setup>
// Swiper 컴포넌트 임포트
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const modules = [Pagination, Autoplay]
</script>

<style scope>
.intro-slide-box {
  padding: 1rem 0;
}
/* 슬라이드 카드 css */
.intro-slide-box .intro-card {
  position: relative;
  height: 22.1rem;
  padding: 3.5rem 3.3rem;
  border-radius: 28px;
  background-color: #f3f3ff;
}
.intro-slide-box .intro-card01 {
  background-image: url(/src/assets/images/intro-bg01.png);
  background-position: 93% 70%;
  background-repeat: no-repeat;
  background-size: 40%;
  background-color: #6846f5;
  color: #fff;
}
.intro-slide-box .intro-card02 {
  background-image: url(/src/assets/images/intro-bg02.png);
  background-position: 93% 80%;
  background-repeat: no-repeat;
  background-size: 42%;
  background-color: #fefbde;
}
.intro-slide-box .intro-card03 {
  background-image: url(/src/assets/images/intro-bg03.png);
  background-position: 90% 65%;
  background-repeat: no-repeat;
  background-size: 42%;
  background-color: #f7d57d;
}
.intro-card .card-title {
  font-size: 1.85rem;
  line-height: 2.3rem;
  font-weight: 600;
  letter-spacing: -1.6px;
  margin-bottom: 1rem;
}
.intro-card .card-content {
  font-size: 1rem;
  letter-spacing: -1px;
  line-height: 1.5rem;
}
.intro-card .card-bottom {
  position: absolute;
  bottom: 5rem;
}
.intro-card .card-bottom .button-main {
  background-color: rgba(51, 51, 51, 0.15);
  border-color: rgba(238, 238, 238, 0.15);
  color: #333;
  padding-left: 1.2rem !important;
  padding-right: 1.2rem !important;
}
.intro-card01 .card-bottom .button-main {
  color: #fff;
}
.intro-card .card-bottom i {
  margin-left: 1rem;
}

/* Swiper 페이지네이션 스타일 커스터마이징 */
:deep(.swiper-pagination-bullet) {
  background: #cfc6fd;
  opacity: 1;
}

:deep(.swiper-pagination-bullet-active) {
  background: #6846f5;
}
</style>
