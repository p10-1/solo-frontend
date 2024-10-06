<template>
  <div class="slider-container">
    <div class="slider">
      <div class="slider-card" v-for="(categoryItem, categoryIndex) in newsList" :key="categoryIndex">
        <div @click="goToNews(categoryItem.category)" class="card-content">
          <div class="text-content">
            <h3 class="news-category">오늘의 {{ categoryItem.category }} 뉴스</h3>
            <h5 class="news-title">{{ categoryItem.newsItems[categoryItem.currentNewsIndex].title }}</h5>
          </div>
          <img 
            v-if="categoryItem.newsItems[categoryItem.currentNewsIndex].imageUrl" 
            :src="categoryItem.newsItems[categoryItem.currentNewsIndex].imageUrl" 
            alt="뉴스 이미지" 
            class="news-image img-fluid" 
          />
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
    const response = await recommendNews()
    newsList.value = Object.entries(response).map(([category, news]) => ({
      category,
      newsItems: Array.isArray(news) ? news.map(item => ({
        ...item,
        imageUrl: item.imageUrl // imageUrl 추가
      })) : [{ ...news, imageUrl: news.imageUrl }], 
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
  }, 6000);
}

onMounted(() => {
  fetchNews()
  startAutoSlide()
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
  width: calc(33.33% - 40px); /* 카드의 넓이를 3분의 1로 설정하고 마진을 고려 */
  background-color: #fff; /* 카드 배경색 변경 */
  border-top: 2px solid #6846F5; /* 위 테두리 설정 */
  border-bottom: 2px solid #CFC6FD; /* 아래 테두리 설정 */
  padding: 10px; /* 패딩 조정 */
  box-shadow: none; /* 그림자 제거 */
  cursor: pointer;
  margin: 0 20px; /* 카드 간격 조정 */
  height: 130px; /* 카드 높이 조정 */
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: space-between; /* 공간 분배 */
  border-radius: 0; /* 모서리 둥글게 하지 않음 */
  transition: transform 0.3s; /* 부드러운 변환 효과 */
}

.slider-card:hover {
  transform: translateY(-5px); /* 마우스 오버 시 카드 상승 효과 */
}

.card-content {
  display: flex;
  justify-content: space-between; /* 텍스트와 이미지를 양쪽으로 배치 */
  flex-grow: 1;
}

.text-content {
  flex: 0 0 60%; /* 텍스트 영역을 60%로 설정 */
  overflow: hidden; /* 넘치는 텍스트 숨기기 */
}

.news-category {
  font-size: 1rem; /* 카테고리 제목 크기 조정 */
  margin: 0; /* 기본 마진 제거 */
  font-weight: bold; /* 제목 굵게 */
}

.news-title {
  font-size: 0.9rem; /* 뉴스 제목 크기 조정 */
  margin: 5px 0; /* 제목 간격 조정 */
  color: #333;
}

.news-image {
  width: 100px; /* 고정 너비 설정 */
  height: 100px; /* 고정 높이 설정 */
  object-fit: cover; /* 비율 유지하며 잘라내기 */
  margin-left: 10px; /* 제목과 이미지 간의 간격 조정 */
  flex: 0 0 40%; /* 이미지 영역을 40%로 설정 (필요에 따라 조정 가능) */
  border-radius: 4px; /* 이미지 모서리 둥글게 */
}

.button-wrapper {
  display: flex;
  justify-content: space-between; /* 버튼을 좌우로 배치 */
  margin-top: 10px; /* 버튼과 카드 내용 간의 간격 조정 */
}

.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px; /* 버튼 패딩 조정 */
  font-size: 0.9rem; /* 버튼 글자 크기 조정 */
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s; /* 배경색 변환 효과 */
  width: 30px; /* 버튼 너비 설정 */
}

.btn:hover {
  background-color: #0056b3; /* 마우스 오버 시 버튼 색상 변경 */
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
