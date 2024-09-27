<template>
  <div class="news-list">
    <table class="table">
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>발행일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(news, index) in newsList" :key="news.no">
          <td>{{ index + 1 }}</td> 
          <td>
            <a :href="news.link" target="_blank">{{ news.title }}</a> <!-- 제목 클릭 시 링크로 이동 -->
          </td>
          <td>{{ formatDate(news.pubDate) }}</td> <!-- 날짜 포맷팅 함수 호출 -->
        </tr>
      </tbody>
    </table>
    <p v-if="newsList.length === 0">뉴스가 없습니다.</p>
  </div>
</template>

<script>
import { fetchNews } from '@/api/newsAPI'; 

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
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
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
