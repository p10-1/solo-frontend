<template>
  <div class="news-content margin-top-2rem">
    <div class="title-box">
      <h2 class="main-title">뉴스</h2>
      <button class="link"><i class="fa-solid fa-plus"></i> 더보기</button>
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
      :slides-per-view="2"
      :navigation="true"
      :modules="modules"
      loop
    >
      <swiper-slide v-for="(newsItem, index) in displayedNews" :key="index">
        <div @click="goToNews(newsItem.link)" class="card-content">
          <!-- URL로 이동하도록 수정 -->
          <div class="text-content">
            <h5 class="news-title">{{ newsItem.title }}</h5>
          </div>
          <img
            v-if="newsItem.imageUrl"
            :src="newsItem.imageUrl"
            alt="뉴스 이미지"
            class="news-image img-fluid"
          />
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { recommendNews } from '@/api/newsApi'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/swiper-bundle.css'

const modules = [Pagination, Navigation]
const newsList = ref([])
const selectedCategory = ref('경제') // 기본 선택 카테고리

const fetchNews = async () => {
  try {
    const response = await recommendNews()
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
  return categoryData ? categoryData.newsItems : []
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

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
}

.text-content {
  flex: 1;
  overflow: hidden;
  margin-right: 10px;
}

.news-title {
  font-size: 0.9rem;
  margin: 5px 0;
  color: #333;
}

.news-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.swiper-button-next {
  right: 10px;
  z-index: 10;
}

.swiper-button-prev {
  left: 10px;
  z-index: 10;
}
</style>
