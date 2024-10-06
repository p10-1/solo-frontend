<template>
  <div class="infinite-scroll">
    <div class="category-filter">
      <label for="category-select">카테고리 선택:</label>
      <select id="category-select" v-model="selectedCategory" @change="resetFilter">
        <option value="">전체</option>
        <option value="경제">경제</option>
        <option value="부동산">부동산</option>
        <option value="증권">증권</option>
      </select>
    </div>

    <div class="news-container">
      <div class="news-item" v-for="news in filteredNewsList" :key="news.no">
        <div class="image-title-cell">
          <img v-if="news.imageUrl" :src="news.imageUrl" alt="뉴스 이미지" class="news-image" />
          <div class="title-container">
            <a :href="news.link" target="_blank">{{ news.title }}</a>
            <div class="pub-date">{{ formatDate(news.pubDate) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-if="noMoreData" class="no-more">더 이상 데이터가 없습니다.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'; 
import { getNews, getNewsBycategory } from '@/api/newsApi';
import { useRoute } from 'vue-router';

const newsList = ref([]);
const currentPage = ref(1);
const loading = ref(false);
const noMoreData = ref(false);
const selectedCategory = ref('');

// 카테고리 쿼리 파라미터로 설정
const route = useRoute();
selectedCategory.value = route.query.category || '';

// 필터링된 뉴스 리스트
const filteredNewsList = computed(() => {
  return newsList.value.filter((news) => {
    const newsCategory = news.category.trim();
    const selected = selectedCategory.value.trim();
    return selected === '' || newsCategory === selected;
  });
});

// 뉴스 로드 함수
const loadNews = async () => {
  if (loading.value || noMoreData.value) return;
  loading.value = true;

  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    let data;
    if (selectedCategory.value) {
      data = await getNewsBycategory(currentPage.value, selectedCategory.value);
    } else {
      data = await getNews(currentPage.value);
    }
    if (data.list && data.list.length > 0) {
      newsList.value = [...newsList.value, ...data.list];
      currentPage.value++;
    } else {
      noMoreData.value = true;
    }
  } catch (error) {
    console.error('뉴스를 불러오는 중 오류 발생', error);
  } finally {
    loading.value = false;
  }
};

const resetFilter = () => {
  currentPage.value = 1;
  newsList.value = [];
  noMoreData.value = false;
  loadNews();
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
};

onMounted(() => {
  loadNews();
  window.addEventListener('scroll', handleScroll);
});

const handleScroll = () => {
  const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
  if (scrollBottom && !loading.value) {
    loadNews(); // 추가 데이터 로드
  }
};

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
body {
  background-color: #f9f9f9;
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 20px;
}

.infinite-scroll {
  max-width: 800px;
  margin: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.category-filter {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.category-filter label {
  margin-right: 10px;
  font-weight: bold;
}

.category-filter select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.category-filter select:hover {
  border-color: #aaa;
}

.news-container {
  display: flex;
  flex-wrap: wrap;
}

.news-item {
  width: 45%; /* 기본적으로 한 줄에 두 개 표시 */
  margin: 2%;
  border-top: 2px solid #6846F5; /* 위 테두리 설정 (굵고 어두운 색상) */
  border-bottom: 2px solid #CFC6FD; /* 아래 테두리 설정 (굵고 어두운 색상) */
  border-left: none; /* 좌측 테두리 없음 */
  border-right: none; /* 우측 테두리 없음 */
  border-radius: 0; /* 모서리 둥글게 하지 않음 */
  padding: 10px;
  box-sizing: border-box;
  height: 125px; /* 카드 높이 설정 (조정 가능) */
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: space-between; /* 요소 간의 공간을 균등하게 배분 */
  position: relative; /* 날짜를 절대 위치로 설정하기 위해 필요 */
  background-color: #ffffff; /* 카드 배경색 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 카드 그림자 */
  transition: transform 0.3s, box-shadow 0.3s; /* 부드러운 변환 효과 */
}

.news-item:hover {
  transform: translateY(-5px); /* 마우스 오버 시 카드 상승 효과 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* 그림자 강화 */
}

.image-title-cell {
  display: flex;
  align-items: center; /* 이미지와 제목을 상단 정렬 */
  height: 100px; /* 고정 높이 설정 */
}

.news-image {
  width: 100px; /* 이미지 너비 설정 */
  height: 80%; /* 부모의 높이에 맞춰서 100% 설정 */
  object-fit: cover; /* 비율을 유지하면서 크기에 맞춤 (잘림) */
}

.title-container {
  flex-grow: 1; /* 제목이 가능한 한 많은 공간을 차지하도록 함 */
  margin-left: 15px;
}

.title-container a {
  font-weight: bold; /* 제목 굵게 */
  color: #333; /* 제목 색상 */
  text-decoration: none; /* 링크 밑줄 제거 */
}

.title-container a:hover {
  text-decoration: underline; /* 링크에 마우스 오버 시 밑줄 추가 */
}

.pub-date {
  font-size: 0.8em;
  color: #929191; /* 원래 색상으로 변경 */
  position: absolute; /* 날짜를 절대 위치로 설정 */
  bottom: 10px; /* 하단에서 10px */
  right: 10px; /* 우측에서 10px */
}

.loading,
.no-more {
  text-align: center;
  padding: 20px;
  color: #555;
  font-size: 1.2em;
  border-top: 1px solid #ddd;
  margin-top: 20px;
}

@media (max-width: 600px) {
  .infinite-scroll {
    padding: 10px;
  }

  .category-filter {
    flex-direction: column;
  }

  .category-filter label {
    margin-bottom: 5px;
  }

  .news-item {
    width: 100%; /* 작은 화면에서는 한 줄에 하나만 보이도록 설정 */
    margin: 0; /* 마진 제거 */
  }
}


</style>
