<template>
  <div class="popular-news">
    <h3>인기 뉴스</h3>
    <ul>
      <li v-for="news in newsList" :key="news.id">
        {{ news.title }}
        <span class="date">{{ news.date }}</span>
      </li>
    </ul>
    <router-link to="/newsPage">더보기 →</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newsList: [
        { id: 1, title: '나의 새로운 투자 전략', date: '2024.09.20' },
        { id: 2, title: '주가 하락으로 인한 손실 보상', date: '2024.09.17' },
        { id: 3, title: '신규 IPO에 대한 빠른 분석', date: '2024.09.15' }
      ]
    }
  }
}
</script>

<style scoped>
.popular-news h3 {
  font-size: 1.2em;
  color: #333;
}

.popular-news ul {
  list-style: none;
  padding: 0;
}

.popular-news li {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popular-news .date {
  font-size: 0.8em;
  color: #666;
}

.router-link {
  margin-top: 10px;
  display: inline-block;
}
</style>
