<template>
  <div class="main-slide-box">
    <h2 class="main-title">내 자산 현황</h2>
    <div class="main-slide-contents margin-top-1rem">
      <!-- 슬라이더 -->
      <swiper
        :pagination="{ clickable: true }"
        :modules="modules"
        :loop="true"
        :slides-per-view="1"
        :space-between="20"
        autoplay
        class="mySwiper"
      >
        <swiper-slide>
          <router-link to="asset">
            <div class="main-card">
              <div class="card-body">
                <h5 class="card-title text-align-left link">이건 제목인데 이번엔 내용이 길게</h5>
                <div class="card-content">내용은 뭐가 오게 될까</div>
                <div class="card-bottom">
                  <button class="button-main">
                    <i class="fa-solid fa-magnifying-glass"></i> 자세히 보기
                  </button>
                </div>
              </div>
            </div>
          </router-link>
        </swiper-slide>
        <swiper-slide>
          <router-link to="asset">
            <div class="main-card">
              <div class="card-body">
                <h5 class="card-title text-align-left">이건 제목인데 이번엔 내용이 좀 길게</h5>
                <div class="card-content">내용은 뭐가 오게 될까</div>
              </div>
              <div class="card-bottom">
                <button class="button-main">
                  <i class="fa-solid fa-magnifying-glass"></i> 자세히 보기
                </button>
              </div>
            </div>
          </router-link>
        </swiper-slide>
        <swiper-slide>
          <router-link to="asset">
            <div class="main-card">
              <div class="card-body">
                <h5 class="card-title text-align-left">이건 제목인데 이번엔 내용이 좀 길게</h5>
                <div class="card-content">내용은 뭐가 오게 될까</div>
              </div>
              <div class="card-bottom">
                <button class="button-main">
                  <i class="fa-solid fa-magnifying-glass"></i> 자세히 보기
                </button>
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
// import 'swiper/css/navigation'

const modules = [Pagination, Autoplay]
</script>

<style scoped>
.main-slide-box {
  width: 100%;
  height: 100%;
  padding: 1rem 0;
}

.main-card {
  position: relative;
  width: 100%;
  padding: 3rem;
  background-color: #6846f5;
  height: 24.1rem;
  border-radius: 28px;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  transition: all 0.4s;
}
.main-card:hover {
}
.main-card .card-title {
  width: 65%;
  font-size: 2.15rem;
  font-weight: 500;
  line-height: 2.9rem;
  word-break: keep-all;
  color: #fff;
  letter-spacing: -1.8px;
}
.main-card .card-content {
  color: #fff;
  letter-spacing: -0.8px;
  font-size: 1.1rem;
}
.main-card .card-bottom {
  position: absolute;
  bottom: 3rem;
}
.main-card .button-main {
  border-color: #502fd4;
}
</style>
