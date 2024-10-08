<template>
  <div class="container my-4">
    <h2 class="mb-4">인기 글</h2>
    <div v-if="loading" class="alert alert-info">로딩 중...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="alert alert-info mt-3">
      * 인기 글은 저번 달 조회수, 댓글 수, 좋아요 수를 기준으로 선정되었습니다.
    </div>

    <!-- 슬라이더 -->
    <swiper
      :pagination="{ clickable: true }"
      :navigation="true"
      :modules="modules"
      :loop="true"
      class="mySwiper"
    >
      <swiper-slide v-for="board in bestBoards" :key="board.boardNo">
        <div class="card">
          <div class="card-body">
            <h5 class="text-align-left link">
              <router-link
                :to="{
                  name: 'board/detail',
                  params: { boardNo: board.boardNo }
                }"
              >
                {{ board.title }}
                <ul class="table-ex-info">
                  <li><i class="fa-solid fa-user"></i> {{ board.views }}</li>
                  <li><i class="fa-solid fa-heart"></i> {{ board.likes }}</li>
                  <li><i class="fa-solid fa-comment"></i> {{ board.comments }}</li>
                </ul>
              </router-link>
            </h5>
            <p class="card-text">
              {{ truncateContent(board.content) }}
            </p>
            <p class="card-text">
              <span class="badge">{{ board.userName }}</span>
              <br />
              <small class="text-muted"
                >작성일: {{ moment(board.regDate).format('YYYY-MM-DD HH:mm') }}</small
              >
            </p>
          </div>
        </div>
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
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const modules = [Pagination, Navigation]
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
/* Swiper 스타일 추가 */
.mySwiper {
  width: 100%;
  height: 100%;
}

.card {
  /* 카드 스타일 */
}

.table-ex-info {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 10px;
}
</style>