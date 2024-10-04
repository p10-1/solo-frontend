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
.loading {
  text-align: center;
  padding: 20px;
  color: gray;
}
.no-more {
  text-align: center;
  padding: 20px;
  color: gray;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.table th {
  background-color: #f2f2f2;
}
.table tr:hover {
  background-color: #f5f5f5;
}
.category-filter {
  margin-bottom: 20px;
}
</style>
