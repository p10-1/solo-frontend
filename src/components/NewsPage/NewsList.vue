<template>
  <div class="news-list">
    <!-- Search Bar -->
    <!-- <search-bar v-model="keyword" @search="searchBoards" /> -->
    <table class="table">
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>출처</th>
          <th>발행일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(news, index) in newsList" :key="news.no">
          <td>{{ index + 1 }}</td> <!-- 번호 -->
          <td>
            <router-link :to="{ name: 'news/detail', params: { newsNo: news.no } }">
              {{ news.title }}
            </router-link>
          </td>
          <td>{{ news.author }}</td> <!-- 출처 -->
          <td>{{ news.pubDate }}</td> <!-- 발행일 -->
        </tr>
      </tbody>
    </table>
    <p v-if="newsList.length === 0">뉴스가 없습니다.</p>
  </div>
</template>

<script>
import { fetchNews } from '@/api/newsAPI'; // fetchNews 함수의 경로를 수정하세요

export default {
  data() {
    return {
      newsList: [],
    };
  },
  created() {
    this.loadNews();
  },
  methods: {
    async loadNews() {
      try {
        const data = await fetchNews();
        this.newsList = data; // 가져온 데이터를 newsList에 저장
      } catch (error) {
        console.error('뉴스를 로드하는 데 실패했습니다:', error);
      }
    },
  },
};
</script>

<style scoped>
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
</style>
