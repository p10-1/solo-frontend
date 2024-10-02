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

<script>
import { getNews, getNewsBycategory } from '@/api/newsApi'

export default {
  name: 'NewsList',
  data() {
    return {
      newsList: [],
      currentPage: 1,
      loading: false,
      noMoreData: false,
      selectedCategory: ''
    }
  },
  computed: {
    filteredNewsList() {
      return this.newsList.filter((news) => {
        const newsCategory = news.category.trim()
        const selectedCategory = this.selectedCategory.trim()
        return selectedCategory === '' || newsCategory === selectedCategory
      })
    }
  },
  methods: {
    async loadNews() {
      if (this.loading || this.noMoreData) return // 로딩 중이거나 더 이상 데이터가 없으면 실행하지 않음
      this.loading = true // 로딩 상태 시작

      // 0.5초의 로딩 지연 추가
      await new Promise((resolve) => setTimeout(resolve, 500))

      try {
        let data
        if (this.selectedCategory) {
          data = await getNewsBycategory(this.currentPage, this.selectedCategory)
        } else {
          data = await getNews(this.currentPage)
        }
        console.log('data:' + data)
        if (data.list && data.list.length > 0) {
          this.newsList = [...this.newsList, ...data.list]
          this.currentPage++ // 페이지 수 증가
        } else {
          this.noMoreData = true
        }
      } catch (error) {
        console.error('뉴스를 불러오는 중 오류 발생', error)
      } finally {
        this.loading = false
      }
    },
    resetFilter() {
      this.currentPage = 1
      this.newsList = []
      this.noMoreData = false
      this.loadNews()
    },
    handleScroll() {
      const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
      if (scrollBottom && !this.loading) {
        this.loadNews() // 추가 데이터 로드
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toISOString().split('T')[0] // YYYY-MM-DD 형식으로 반환
    }
  },
  mounted() {
    this.loadNews()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
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
