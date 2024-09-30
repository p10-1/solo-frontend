<template>
  <div class="news-list" @scroll="handleScroll">
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
        <tr v-for="(news, index) in displayedNews" :key="news.no">
          <td>{{ index + 1 }}</td> 
          <td>{{ news.category }}</td>
          <td>
            <a :href="news.link" target="_blank">{{ news.title }}</a>
          </td>
          <td>{{ formatDate(news.pubDate) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="displayedNews.length === 0">뉴스가 없습니다.</p>
    <p v-if="loading">로딩 중...</p> <!-- 로딩 중 표시 -->
  </div>
</template>

<script>
import { fetchNews } from '@/api/newsAPI'; 

export default {
  data() {
    return {
      allNews: [], // 전체 뉴스 데이터를 저장
      displayedNews: [], // 현재 표시할 뉴스 데이터
      itemsPerPage: 20, // 한 번에 표시할 뉴스 개수
      currentPage: 0, // 현재 페이지
      loading: false, // 로딩 상태
    };
  },
  created() {
    this.loadNews();
  },
  methods: {
    async loadNews() {
      try {
        const data = await fetchNews();
        this.allNews = data; // 가져온 전체 데이터를 저장
        this.loadMoreNews(); // 초기 데이터 로드
      } catch (error) {
        console.error('뉴스를 로드하는 데 실패했습니다:', error);
      }
    },
    loadMoreNews() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;

      // 로딩 상태 설정
      this.loading = true;

      // 0.5초 후에 추가 데이터 로드
      setTimeout(() => {
        // 데이터가 남아있을 때만 추가
        if (start < this.allNews.length) {
          this.displayedNews = this.displayedNews.concat(this.allNews.slice(start, end)); // 뉴스 추가
          this.currentPage++; // 페이지 증가
        }
        this.loading = false; // 로딩 상태 해제
      }, 500); // 500ms 대기
    },
    handleScroll() {
      const scrollable = this.$el;
      // 스크롤 위치 확인
      if (scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 10) {
        // 로딩 중이 아니고, 아직 불러올 뉴스가 남아있을 경우
        if (!this.loading && this.displayedNews.length < this.allNews.length) {
          this.loadMoreNews();
        }
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

/* 추가된 스타일 */
.news-list {
  height: 400px; /* 원하는 높이 지정 */
  overflow-y: auto; /* 스크롤 가능 */
}
</style>
