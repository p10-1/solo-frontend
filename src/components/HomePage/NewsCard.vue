<template>
  <div class="slider-container">
    <div class="slider">
      <div
        class="slider-card"
        v-for="(categoryItem, categoryIndex) in newsList"
        :key="categoryIndex"
      >
        <div @click="goToNews(categoryItem.category)" class="card-content">
          <div class="text-content">
            <h3 class="news-category">오늘의 {{ categoryItem.category }} 뉴스</h3>
            <h5 class="news-title">
              {{ categoryItem.newsItems[categoryItem.currentNewsIndex].title }}
            </h5>
          </div>
          <img
            v-if="categoryItem.newsItems[categoryItem.currentNewsIndex].imageUrl"
            :src="categoryItem.newsItems[categoryItem.currentNewsIndex].imageUrl"
            alt="뉴스 이미지"
            class="news-image img-fluid"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { recommendNews } from '@/api/newsApi'

const router = useRouter()
const newsList = ref([])

const fetchNews = async () => {
  try {
    const response = await recommendNews()
    newsList.value = Object.entries(response).map(([category, news]) => ({
      category,
      newsItems: Array.isArray(news)
        ? news.map((item) => ({
            ...item,
            imageUrl: item.imageUrl // imageUrl 추가
          }))
        : [{ ...news, imageUrl: news.imageUrl }],
      currentNewsIndex: 0
    }))
  } catch (error) {
    console.error('뉴스를 가져오는 데 실패했습니다:', error)
  }
}

const goToNews = (category) => {
  router.push({ path: '/news', query: { category } })
}

// 자동 슬라이드 기능
const slideInterval = ref(null)

const startAutoSlide = () => {
  slideInterval.value = setInterval(() => {
    newsList.value.forEach((category) => {
      if (category.currentNewsIndex < category.newsItems.length - 1) {
        category.currentNewsIndex++
      } else {
        category.currentNewsIndex = 0 // 마지막 뉴스에서 첫 번째 뉴스로 돌아감
      }
    })
  }, 6000)
}

onMounted(() => {
  fetchNews()
  startAutoSlide()
})

onUnmounted(() => {
  clearInterval(slideInterval.value)
})
</script>

<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin: auto;
}

.slider {
  display: flex;
}

.slider-card {
  width: calc(33.33% - 40px);
  background-color: #fff;
  border-top: 2px solid #6846f5;
  border-bottom: 2px solid #cfc6fd;
  padding: 10px;
  box-shadow: none;
  cursor: pointer;
  margin: 0 20px;
  height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 0;
  transition: transform 0.3s;
}

.slider-card:hover {
  transform: translateY(-5px); /* 마우스 오버 시 카드 상승 효과 */
}

.card-content {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
}

.text-content {
  flex: 0 0 60%;
  overflow: hidden;
}

.news-category {
  font-size: 1rem;
  margin: 0;
  font-weight: bold;
}

.news-title {
  font-size: 0.9rem;
  margin: 5px 0; /* 제목 간격 조정 */
  color: #333;
}

.news-image {
  width: 100px;
  height: 100px;
  object-fit: cover; /* 비율 유지하며 잘라내기 */
  margin-left: 10px;
  flex: 0 0 40%;
  border-radius: 4px;
}
</style>
