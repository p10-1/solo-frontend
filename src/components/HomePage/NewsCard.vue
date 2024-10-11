<template>
  <div class="news-content margin-top-2rem">
    <div class="title-box">
      <h2 class="main-title">뉴스</h2>
      <router-link to="news">
        <span class="link"><i class="fa-solid fa-plus"></i> 더보기</span>
      </router-link>
    </div>

    <div class="filter-bar">
      <input type="radio" id="economy" value="경제" v-model="selectedCategory" />
      <label for="economy" :class="{ active: selectedCategory === '경제' }">경제</label>

      <input type="radio" id="real-estate" value="부동산" v-model="selectedCategory" />
      <label for="real-estate" :class="{ active: selectedCategory === '부동산' }">부동산</label>

      <input type="radio" id="stocks" value="증권" v-model="selectedCategory" />
      <label for="stocks" :class="{ active: selectedCategory === '증권' }">증권</label>
    </div>

    <swiper
      ref="swiper"
      v-if="filteredNews.length > 0"
      :navigation="true"
      :modules="modules"
      :loop="true"
      :slides-per-view="2"
      :space-between="25"
      autoplay
    >
      <swiper-slide v-for="(newsItem, index) in displayedNews" :key="index">
        <div @click="goToNews(newsItem.link)" class="news-card margin-top-1rem">
          <!-- URL로 이동하도록 수정 -->
          <div class="img-content margin-bottom-1rem">
            <img
              v-if="newsItem.imageUrl"
              :src="newsItem.imageUrl"
              alt="뉴스 이미지"
              class="news-image img-fluid"
            />
          </div>
          <h5 class="news-title">{{ newsItem.title }}</h5>
          <div class="pub-date">{{ newsItem.pubDate }}</div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { recommendNews } from '@/api/newsApi'
// Swiper 컴포넌트 임포트
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const modules = [Pagination, Navigation, Autoplay]
  
const newsList = ref([])
const selectedCategory = ref('경제') // 기본 선택 카테고리

const fetchNews = async () => {
  try {
    const response = await recommendNews()
    console.log("news",response);
    if (response && typeof response === 'object') {
      newsList.value = Object.entries(response).map(([category, news]) => ({
        category,
        newsItems: Array.isArray(news)
          ? news.map((item) => ({
              ...item,
              imageUrl: item.imageUrl
            }))
          : [{ ...news, imageUrl: news.imageUrl }]
      }))
    } else {
      console.error('잘못된 응답 형식:', response)
    }
  } catch (error) {
    console.error('뉴스를 가져오는 데 실패했습니다:', error)
  }
}

const filteredNews = computed(() => {
  const categoryData = newsList.value.find((item) => item.category === selectedCategory.value)
  return categoryData ? categoryData.newsItems.filter((newsItem) => newsItem.imageUrl) : []
})

// 현재 인덱스에 따라 표시할 뉴스
const displayedNews = computed(() => {
  return filteredNews.value.slice(0, 5) // 첫 5개 뉴스 항목 반환
})

const goToNews = (link) => {
  window.open(link, '_blank') // 새 탭에서 링크 열기
}

onMounted(async () => {
  await fetchNews()
})
</script>
<style scoped>
.news-content {
  width: 100%;
}
.news-card {
  cursor: pointer;
}
.news-card:hover .img-content img {
  transform: scale(1.1);
}
.news-card:hover .news-title {
  font-weight: 600;
  color: #6846f5;
  text-decoration: underline;
  transition: all 0.4s ease;
}
.news-card:hover .pub-date {
  color: #6846f5;
}
.news-card .img-content {
  border-radius: 27px;
  width: 100%;
  height: 8rem;
  overflow: hidden;
}
.news-card .img-content img {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}
.news-card .news-title {
  text-align: center;
  font-size: 1.12rem;
  font-weight: 500;
  letter-spacing: -1px;
  line-height: 1.6rem;
  word-break: keep-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  transition: all 0.4s ease;
}
.news-card .pub-date {
  margin-top: 15px;
  font-size: 15px;
  text-align: center;
}
</style>
