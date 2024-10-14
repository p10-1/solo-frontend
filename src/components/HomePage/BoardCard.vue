<template>
  <div class="best-posts-container">
    <div class="title-box margin-top-1rem margin-bottom-1rem">
      <h2 class="main-title">커뮤니티 <span class="text-accent">HOT</span></h2>
      <button class="link" @click="goToBoard">
        <i class="fa-solid fa-plus"></i>
        더보기
      </button>
    </div>
    <div class="posts-content">
      <!-- 슬라이더 -->
      <swiper
        :pagination="{ clickable: true }"
        :navigation="true"
        :modules="modules"
        :loop="true"
        :slides-per-view="3"
        :space-between="20"
        :autoplay="{ delay: 2000, disableOnInteraction: false }"
        class="mySwiper"
      >
        <swiper-slide v-for="post in bestPosts" :key="post.boardNo" class="posts-list">
          <router-link
            :to="{
              name: 'board/detail',
              params: { boardNo: post.boardNo }
            }"
          >
            <div class="posts-card">
              <div class="card-body">
                <div class="card-ex-info">
                  <ul class="ex-info">
                    <li><i class="fa-solid fa-user"></i> {{ post.views }}</li>
                    <li><i class="fa-solid fa-heart"></i> {{ post.likes }}</li>
                    <li><i class="fa-solid fa-comment"></i> {{ post.comments }}</li>
                  </ul>
                  <div class="text-mute">{{ formatDate(post.regDate) }}</div>
                </div>
                <h5 class="card-title link">{{ post.title }}</h5>
                <div class="card-content">{{ post.content }}</div>
                <span class="badge">{{ post.userName }}</span>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBest } from '@/api/boardApi'
import { useRouter } from 'vue-router'
import moment from 'moment'

// Swiper 컴포넌트 임포트
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const modules = [Pagination, Navigation, Autoplay]

const bestPosts = ref([])
const router = useRouter()

// 인기글 불러오기
const loadBestPosts = async () => {
  try {
    bestPosts.value = await getBest()
  } catch (error) {
    console.error('인기글을 불러오는 데 실패했습니다.', error)
  }
}

// 날짜 포맷팅 (월.일 형식)
const formatDate = (date) => {
  return moment(date).format('MM.DD')
}

// '/board'로 이동
const goToBoard = () => {
  router.push('/board')
}

// 컴포넌트가 로드될 때 인기글 가져오기
onMounted(() => {
  loadBestPosts()
})
</script>

<style scoped>
/* swiper 슬라이드 css */
.mySwiper {
  width: 100%;
  height: 100%;
  padding: 1.5rem 3rem 2rem;
}

.best-posts-container {
  width: 100%;
  padding: 1rem;
}
/* Card css */
.posts-content {
  background: #f3f3ff;
  padding: 2rem 1.5rem;
  min-height: 3rem;
  border-radius: 28px;
}
.posts-card {
  position: relative;
  width: 100%;
  height: 13rem;
  padding: 2rem 1.7rem;
  background-color: #fff;
  border-radius: 28px;
  transition: all 0.4s;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  transition: all 0.4s;
}
.posts-card:hover {
  background-color: #6846f5;
}
.posts-card:hover .card-title,
.posts-card:hover .card-content {
  color: #fff;
}
.posts-card:hover .badge {
  color: #cfc6fd !important;
}
.posts-card .card-title {
  font-size: 1.2rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  line-height: 1.6rem;
  letter-spacing: -1px;
  margin-bottom: 0;
}
.posts-card .card-content {
  border-top: 1px dashed #e4deff;
  padding-top: 10px;
  font-size: 0.9rem;
  color: #444;
  font-weight: 400;
  word-break: keep-all;
  line-height: 24px;
  letter-spacing: -1px;
  font-weight: 400;
  margin: 10px 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
}

.posts-card .card-ex-info {
  width: 100%;
  color: #cfc6fd;
  margin-bottom: 7px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  transition: all 0.4s;
}
.posts-card .ex-info li {
  display: inline-block;
  margin-right: 10px;
}
.posts-card .ex-info li i {
  font-size: 14px;
}
.posts-card .badge {
  position: absolute;
  bottom: 1.6rem;
  background: none;
  padding: 0;
  color: #7d64da !important;
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
