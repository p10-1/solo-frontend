<template>
  <div class="best-board">
    <h2 class="title">
      <span class="text-accent"><i class="fa-solid fa-ranking-star"></i></span> HOT
    </h2>
    <div v-if="loading" class="loading">
      <i class="fa-solid fa-spinner margin-bottom-1rem"></i><br />
      로딩 중...
    </div>
    <div v-if="error" class="error">
      <i class="fa-solid fa-xmark argin-bottom-1rem"></i><br />{{ error }}
    </div>

    <div class="custom-alert">
      <i class="fa-solid fa-circle-info"></i> 인기 글은 저번 달 조회수, 댓글 수, 좋아요 수를
      기준으로 선정되었습니다.
    </div>

    <!-- 슬라이더 -->
    <swiper
      :pagination="{ clickable: true }"
      :navigation="true"
      :modules="modules"
      :loop="true"
      :slides-per-view="3"
      :space-between="20"
      :autoplay="{ delay: 1000, disableOnInteraction: false }"
      class="mySwiper"
    >
      <swiper-slide v-for="board in bestBoards" :key="board.boardNo">
        <router-link
          :to="{
            name: 'board/detail',
            params: { boardNo: board.boardNo }
          }"
        >
          <div class="best-card">
            <span class="badge">{{ board.userName }}</span>
            <h5 class="card-title text-align-left link">
              {{ board.title }}
            </h5>
            <span class="text-mute">{{ moment(board.regDate).format('YYYY-MM-DD') }}</span>
            <div class="card-content">
              {{ truncateContent(board.content) }}
            </div>
            <div class="card-ex-info">
              <ul class="table-ex-info">
                <li><i class="fa-solid fa-user"></i> {{ board.views }}</li>
                <li><i class="fa-solid fa-heart"></i> {{ board.likes }}</li>
                <li><i class="fa-solid fa-comment"></i> {{ board.comments }}</li>
              </ul>
            </div>
          </div>
        </router-link>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBest } from '@/api/boardApi'
import moment from 'moment'

// Swiper 컴포넌트 임포트
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const modules = [Pagination, Navigation, Autoplay]
// 데이터 변수
const bestBoards = ref([])
const loading = ref(true)
const error = ref(null)

// 데이터 로드
onMounted(async () => {
  try {
    bestBoards.value = await getBest()
  } catch (err) {
    error.value = '인기 글을 가져오는 데 실패했습니다.'
  } finally {
    loading.value = false
  }
})

// Helper function to truncate content
const truncateContent = (content, length = 100) => {
  return content.length > length ? content.slice(0, length) + '...' : content
}
</script>

<style scoped>
/* swiper 슬라이드 css */
.mySwiper {
  width: 100%;
  height: 100%;
  padding: 1.5rem 3.5rem 2rem;
}
/* 제목 */
.best-board .text-accent {
  color: #f7d095;
}
/* Card css */
.best-card {
  position: relative;
  padding: 2rem 1.7rem;
  background-color: #fffbec;
  height: 13rem;
  border-radius: 28px;
  transition: all 0.4s;
}
.best-card:hover {
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
}
.best-card:hover .card-title,
.best-card:hover .card-content {
  color: #7d64da;
}
.best-card:hover .card-ex-info li,
.best-card:hover .card-ex-info .text-muted {
  color: #cfc6fd !important;
}
.best-card .badge {
  background: none;
  padding: 0;
  color: #7d64da !important;
}
.best-card .card-title {
  font-size: 1.22rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  line-height: 1.6rem;
  letter-spacing: -1px;
  margin-bottom: 0;
}
.best-card .card-content {
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
.best-card .card-ex-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  bottom: 1.8rem;
  display: flex;
  align-items: baseline;
  transition: all 0.4s;
}
.best-card .text-mute {
  position: absolute;
  top: 2rem;
  right: 1.7rem;
  margin-left: 15px;
  font-size: 15px;
  font-weight: 500;
  color: #b9b9b9;
  letter-spacing: -0.8px;
}
</style>
