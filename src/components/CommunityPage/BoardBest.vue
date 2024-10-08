<template>
  <div class="container my-4">
    <h2 class="mb-4">인기 글</h2>
    <div v-if="loading" class="alert alert-info">로딩 중...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="alert alert-info mt-3">
      * 인기 글은 저번 달 조회수, 댓글 수, 좋아요 수를 기준으로 선정되었습니다.
    </div>

    <!-- 슬라이더 -->
    <div class="slider">
      <div class="slides">
        <div
          class="slide"
          v-for="(board, index) in bestBoards"
          :key="board.boardNo"
          :class="{ active: currentIndex === index }"
        >
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
                  <!-- <span v-if="bestlist.includes(board.boardNo)">
                <i class="fa-solid fa-star" style="color: gold"></i>
              </span> -->
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
        </div>
      </div>

      <!-- 슬라이더 컨트롤 -->
      <button @click="prevSlide" class="prev">Previous</button>
      <button @click="nextSlide" class="next">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBest } from '@/api/boardApi'
import moment from 'moment'

const bestBoards = ref([])
const loading = ref(true)
const error = ref(null)
const currentIndex = ref(0)

onMounted(async () => {
  try {
    bestBoards.value = await getBest()
  } catch (err) {
    error.value = '인기 글을 가져오는 데 실패했습니다.'
  } finally {
    loading.value = false
  }
})

// 슬라이드 컨트롤 함수
const prevSlide = () => {
  currentIndex.value =
    currentIndex.value === 0 ? bestBoards.value.length - 1 : currentIndex.value - 1
}

const nextSlide = () => {
  currentIndex.value =
    currentIndex.value === bestBoards.value.length - 1 ? 0 : currentIndex.value + 1
}

// Helper function to truncate content
const truncateContent = (content, length = 100) => {
  return content.length > length ? content.slice(0, length) + '...' : content
}
</script>

<style scoped>
.slider {
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  overflow: hidden;
}

.slides {
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(calc(-100% * var(--current-index)));
}

.slide {
  min-width: 100%;
  transition: opacity 0.5s ease;
  opacity: 0;
  display: none;
}

.slide.active {
  opacity: 1;
  display: block;
}

.prev,
.next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}
</style>
