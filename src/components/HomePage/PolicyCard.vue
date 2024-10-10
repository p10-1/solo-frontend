<template>
  <div class="policy-container margin-top-2rem">
    <div class="title-box">
      <h2 class="main-title">청년 정책</h2>
      <router-link to="policy">
        <span class="link"><i class="fa-solid fa-plus"></i> 더보기</span>
      </router-link>
    </div>
    <div class="main-policy-box margin-top-1rem">
      <!-- 슬라이더 -->
      <swiper
        :pagination="{ clickable: true }"
        :modules="modules"
        :loop="true"
        :slides-per-view="1"
        :space-between="20"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        class="mySwiper"
      >
        <swiper-slide v-for="(policy, index) in policies" :key="index" @click="goToPolicy">
          <div class="main-policy-card">
            <h3 class="policy-title">{{ policy.polyBizSjnm }}</h3>
            <p class="card-content">{{ policy.polyItcnCn }}</p>
            <div class="card-bottom">
              <button class="button-main" @click.stop="goToPolicy">
                <i class="fa-solid fa-magnifying-glass"></i>
                자세히 보기
              </button>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { recommendPolicies } from '@/api/policyApi'

// Swiper 컴포넌트 임포트
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const modules = [Pagination, Autoplay]

const router = useRouter()
const policies = ref([])

const fetchPolicies = async () => {
  try {
    policies.value = await recommendPolicies()
  } catch (error) {
    console.error('정책을 가져오는 데 실패했습니다:', error)
  }
}

const goToPolicy = () => {
  router.push('/policy')
}

onMounted(() => {
  fetchPolicies()
})
</script>
<style scope>
.policy-container {
  width: 100%;
}
.main-policy-card {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 3rem;
  /* background-color: #897fe6; */
  background-color: #6846f5;
  height: 18rem;
  border-radius: 28px;
  cursor: pointer;
  transition: all 0.4s;
}
.main-policy-card::after {
  content: '\f66f';
  font-family: FontAwesome;
  color: #fff;
  font-size: 16rem;
  opacity: 0.05;
  position: absolute;
  bottom: -5rem;
  right: 1rem;
}
.main-policy-card:hover .button-main {
  background-color: #502fd4;
  font-weight: 700;
}
.main-policy-card:hover .policy-title,
.main-policy-card:hover .card-content {
  color: #f7e595;
  transition: all 0.4s;
}
.main-policy-card .policy-title {
  font-size: 1.32rem;
  font-weight: 500;
  word-break: keep-all;
  line-height: 1.6rem;
  letter-spacing: -1px;
  margin-bottom: 0;
  color: #fff;
}
.main-policy-card .card-content {
  color: #fff;
  border-top: 1px dashed #fff;
  padding-top: 10px;
  font-size: 1rem;
  font-weight: 400;
  word-break: keep-all;
  line-height: 26px;
  letter-spacing: -1px;
  white-space: pre-line;
  font-weight: 400;
  margin: 10px 0 0;
  white-space: pre-line;
}
.main-policy-card .card-bottom {
  position: absolute;
  bottom: 2.7rem;
}
.main-policy-card .button-main {
  border-color: #502fd4;
}
</style>
