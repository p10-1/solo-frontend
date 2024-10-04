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

    <table class="table">
      <thead>
        <tr>
          <th>번호</th>
          <th>카테고리</th>
          <th>제목</th>
          <th>발행일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(news, index) in filteredNewsList" :key="news.no">
          <td>{{ index + 1 }}</td>
          <td>{{ news.category }}</td>
          <td>
            <a :href="news.link" target="_blank">{{ news.title }}</a>
          </td>
          <td>{{ formatDate(news.pubDate) }}</td>
        </tr>
      </tbody>
    </table>

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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.table {
  width: 100%; /* 테이블 폭을 100%로 설정 */
  max-width: 1000px; /* 최대 너비를 설정 */
  border-collapse: collapse;
  margin-bottom: 20px;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.table th:first-child,
.table td:first-child {
  min-width: 70px; /* 번호 열의 최소 너비 */
}

.table th:nth-child(2),
.table td:nth-child(2) {
  min-width: 100px; /* 카테고리 열의 최소 너비 */
}

.table th {
  background-color: #4CAF50;
  color: white;
}

.table tr:hover {
  background-color: #f1f1f1;
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

  .table th, .table td {
    padding: 8px;
  }

  .category-filter {
    flex-direction: column;
  }

  .category-filter label {
    margin-bottom: 5px;
  }
}
</style>
