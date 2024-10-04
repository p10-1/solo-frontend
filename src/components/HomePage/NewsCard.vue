<template>
  <div class="slider-container">
    <div class="slider">
      <div class="slider-card" v-for="(categoryItem, categoryIndex) in newsList" :key="categoryIndex">
        <div @click="goToNews(categoryItem.category)" class="card-content">
          <h3>오늘의 {{ categoryItem.category }} 뉴스</h3>
          <h5 class="news-title">{{ categoryItem.newsItems[categoryItem.currentNewsIndex].title }}</h5>
        </div>
        <div class="button-wrapper">
          <button 
            class="btn btn-secondary btn-sm" 
            @click.prevent="prevNews(categoryIndex)" 
            :disabled="categoryItem.currentNewsIndex === 0"
          >
            ‹
          </button>
          <button 
            class="btn btn-secondary btn-sm" 
            @click.prevent="nextNews(categoryIndex)" 
            :disabled="categoryItem.currentNewsIndex === categoryItem.newsItems.length - 1"
          >
            ›
          </button>
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

// 뉴스 데이터를 가져오는 함수
const fetchNews = async () => {
  try {
    const response = await recommendNews(); 
    newsList.value = Object.entries(response).map(([category, news]) => ({
      category,
      newsItems: Array.isArray(news) ? news : [news], 
      currentNewsIndex: 0 
    }));
  } catch (error) {
    console.error('뉴스를 가져오는 데 실패했습니다:', error)
  }
}

const goToNews = (category) => { 
  router.push({ path: '/news', query: { category } });
}

const nextNews = (categoryIndex) => {
  const category = newsList.value[categoryIndex];
  if (category.currentNewsIndex < category.newsItems.length - 1) {
    category.currentNewsIndex++;
  }
}

const prevNews = (categoryIndex) => {
  const category = newsList.value[categoryIndex];
  if (category.currentNewsIndex > 0) {
    category.currentNewsIndex--;
  }
}

// 자동 슬라이드 기능
const slideInterval = ref(null)

const startAutoSlide = () => {
  slideInterval.value = setInterval(() => {
    newsList.value.forEach((category) => {
      if (category.currentNewsIndex < category.newsItems.length - 1) {
        category.currentNewsIndex++;
      } else {
        category.currentNewsIndex = 0; // 마지막 뉴스에서 첫 번째 뉴스로 돌아감
      }
    });
  }, 3000);
}

onMounted(() => {
  fetchNews();
  startAutoSlide();
})

onUnmounted(() => {
  clearInterval(slideInterval.value);
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
  display: flex; /* 카드들을 가로로 정렬 */
}

.slider-card {
  width: 33.33%; /* 카드의 넓이를 3분의 1로 설정 */
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  margin: 0 10px; /* 카드 간격 조정 */
  height: 200px;
  display: flex;
  flex-direction: column;
}

.card-content {
  cursor: pointer;
  flex-grow: 1;
}

.news-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 10px 0;
  color: #333;
}

.button-wrapper {
  display: flex;
  justify-content: center; /* 버튼을 중앙에 배치 */
  margin-top: 10px; /* 버튼과 카드 내용 간의 간격 조정 */
}

.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 15px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin: 0 5px; /* 버튼 간의 간격 추가 */
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
