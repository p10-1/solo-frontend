<template>
  <div class="infinite-scroll">
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
        <tr v-for="(news, index) in newsList" :key="news.no">
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

<script>
import { fetchNews } from '@/api/newsAPI';

export default {
  name: 'NewsList',
  data() {
    return {
      newsList: [],      // 뉴스 목록
      currentPage: 1,  
      loading: false,   
      noMoreData: false, // 더 이상 불러올 데이터가 없는지 여부
    };
  },
  methods: {
    async loadNews() {
      if (this.loading || this.noMoreData) return; // 로딩 중이거나 더 이상 데이터가 없을 때는 실행하지 않음
      this.loading = true; // 로딩 상태

      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 지연

        const data = await fetchNews(this.currentPage); 
        if (data.list.length > 0) {
          this.newsList = [...this.newsList, ...data.list];
          this.currentPage++; 
        } else {
          this.noMoreData = true; 
        }
      } catch (error) {
        console.error('뉴스를 불러오는 중 오류 발생', error);
      } finally {
        this.loading = false; // 로딩 상태 종료
      }
    },
    handleScroll() {
      const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
      if (scrollBottom && !this.loading) {
        this.loadNews(); 
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
    },
  },
  mounted() {
    this.loadNews(); // 첫 데이터 로드
    window.addEventListener('scroll', this.handleScroll); // 스크롤 이벤트 리스너 추가
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll); // 스크롤 이벤트 리스너 제거
  },
};
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
</style>
