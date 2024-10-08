<template>
  <div>
    <div class="filter-bar">
      <input type="radio" id="economy" value="경제" v-model="selectedCategory" />
      <label for="economy" :class="{ active: selectedCategory === '경제' }">경제</label>

      <input type="radio" id="real-estate" value="부동산" v-model="selectedCategory" />
      <label for="real-estate" :class="{ active: selectedCategory === '부동산' }">부동산</label>

      <input type="radio" id="stocks" value="증권" v-model="selectedCategory" />
      <label for="stocks" :class="{ active: selectedCategory === '증권' }">증권</label>
    </div>

    <swiper ref="swiper" v-if="filteredNews.length > 0" :slides-per-view="3" :navigation="true" loop>
      <swiper-slide v-for="(newsItem, index) in displayedNews" :key="index">
        <div @click="goToNews(newsItem.category)" class="card-content">
          <div class="text-content">
            <h5 class="news-title">{{ newsItem.title }}</h5>
          </div>
          <img v-if="newsItem.imageUrl" :src="newsItem.imageUrl" alt="뉴스 이미지" class="news-image img-fluid" />
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { ref, onMounted, computed} from 'vue'
import { useRouter } from 'vue-router'
import { recommendNews } from '@/api/newsApi'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'

const router = useRouter()
const newsList = ref([])
const selectedCategory = ref('경제') // 기본 선택 카테고리

const fetchNews = async () => {
  try {
    const response = await recommendNews();
    if (response && typeof response === 'object') {
      newsList.value = Object.entries(response).map(([category, news]) => ({
        category,
        newsItems: Array.isArray(news)
          ? news.map((item) => ({
            ...item,
            imageUrl: item.imageUrl
          }))
          : [{ ...news, imageUrl: news.imageUrl }]
      }));
    } else {
      console.error('잘못된 응답 형식:', response);
    }
  } catch (error) {
    console.error('뉴스를 가져오는 데 실패했습니다:', error);
  }
}

const filteredNews = computed(() => {
  const categoryData = newsList.value.find(item => item.category === selectedCategory.value);
  return categoryData ? categoryData.newsItems : [];
});

// 현재 인덱스에 따라 표시할 뉴스
const displayedNews = computed(() => {
  return filteredNews.value.slice(0, 3); // 첫 3개 뉴스 항목 반환
});

const goToNews = (category) => {
  router.push({ path: '/news', query: { category } });
}

// 데이터 확인용
// watch(selectedCategory, (newCategory) => {
//   console.log('선택된 카테고리:', newCategory);
//   console.log('필터링된 뉴스:', filteredNews.value);
// });

onMounted(async () => {
  await fetchNews();
});
</script>

<style scoped>
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
