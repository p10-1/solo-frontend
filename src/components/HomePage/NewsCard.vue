<template>
  <div id="newsCarousel" class="d-flex justify-content-between">
    <template v-if="newsList.length > 0">
      <div v-for="(categoryItem, categoryIndex) in newsList" :key="categoryIndex" class="news-card">
        <h3>{{ categoryItem.category }}의 뉴스</h3>
        <div class="news-item">
          <h5 class="news-title">
            {{ categoryItem.newsItems[categoryItem.currentNewsIndex].title }}
          </h5>
          <p class="news-description">
            {{ categoryItem.newsItems[categoryItem.currentNewsIndex].link }}
          </p>
          <button class="btn btn-primary btn-sm mt-3" @click.stop="goToNews">더 알아보기</button>
        </div>
        <div class="d-flex justify-content-between mt-2">
          <button class="btn btn-secondary btn-sm" @click.prevent="prevNews(categoryIndex)">
            이전
          </button>
          <button class="btn btn-secondary btn-sm" @click.prevent="nextNews(categoryIndex)">
            다음
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <div>뉴스가 없습니다.</div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { recommendNews } from '@/api/newsAPI'

//import NewsList from '../NewsPage/NewsList.vue'

const router = useRouter()
const newsList = ref([])
let autoSlideIntervals = [] // 각 카테고리별 자동 슬라이드 타이머

// 뉴스 데이터를 가져오는 함수
const fetchNews = async () => {
  try {
    const response = await recommendNews()
    newsList.value = Object.entries(response).map(([category, news]) => ({
      category,
      newsItems: Array.isArray(news) ? news : [news],
      currentNewsIndex: 0
    }))
    console.log('Fetched News:', newsList.value) // 가져온 뉴스 리스트를 콘솔에 출력
  } catch (error) {
    console.error('뉴스를 가져오는 데 실패했습니다:', error)
  }
}

// 뉴스 페이지로 이동하는 함수
const goToNews = () => {
  router.push('/news') // 뉴스 페이지로 이동
}

// 다음 뉴스로 이동하는 함수
const nextNews = (categoryIndex) => {
  const category = newsList.value[categoryIndex]
  category.currentNewsIndex = (category.currentNewsIndex + 1) % category.newsItems.length // 다음 뉴스로 순환
}

// 이전 뉴스로 이동하는 함수
const prevNews = (categoryIndex) => {
  const category = newsList.value[categoryIndex]
  category.currentNewsIndex =
    (category.currentNewsIndex - 1 + category.newsItems.length) % category.newsItems.length // 이전 뉴스로 순환
}

// 자동으로 다음 뉴스로 넘어가는 함수
const startAutoSlide = () => {
  autoSlideIntervals = newsList.value.map((_, index) => {
    return setInterval(() => {
      nextNews(index) // 각 카테고리의 뉴스 인덱스를 증가시킴
    }, 3000) // 3초마다 자동으로 다음 뉴스로 넘어감
  })
}

onMounted(() => {
  fetchNews()
  startAutoSlide()
})

onUnmounted(() => {
  autoSlideIntervals.forEach((interval) => clearInterval(interval)) // 타이머 정리
})
</script>

<style scoped>
.newsList {
  justify-content: space-between;
  margin: 40px 0 100px;
}

.newsList li {
  border-top: 3px solid #000;
  width: calc(32.5% - 10px);
  gap: 0 20px;
  color: #222;
  padding: 24px 0 52px;
  cursor: pointer;
}

.newsList li:hover {
  color: #5f7dff;
}

.newsList li .image-box {
  width: 100%;
  height: 200px;
}

.newsList li .empty {
  text-align: center;
  line-height: 200px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -1px;
  color: #666;
  background-color: #f7f7f7;
}

.newsList li p.title {
  margin: 12px 0;
  font-size: 22px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.newsList li .date {
  font-size: 18px;
  font-weight: 400;
  color: #666;
}

.popular-news h3 {
  font-size: 1.2em;
  color: #333;
}

.popular-news ul {
  list-style: none;
  padding: 0;
}

.popular-news li {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}

.news-card {
  width: 30%;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease;
}

.news-item {
  margin: 10px 0;
}

.news-card:hover {
  transform: scale(1.05);
}

.news-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 10px 0;
  color: #333;
}

.router-link {
  margin-top: 10px;
  display: inline-block;
}
</style>
