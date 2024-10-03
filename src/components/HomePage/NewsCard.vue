<template>
  <div class="popular-news">
    <div class="title-box">
      <h1 class="title">
        오늘의 <b>추천뉴스<i class=""></i></b>
      </h1>
      <router-link to="/newsPage">
        <span><i class=""></i>더보기</span>
      </router-link>
    </div>
    <!-- <h3>인기 뉴스</h3> -->
    <ul class="newsList layout-flex">
      <li v-for="news in newsList" :key="news.id">
        <div class="image-box empty">No image</div>
        <p class="title">{{ news.title }}</p>
        <span class="date">{{ news.date }}</span>
      </li>
    </ul>
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
.newsList {
  justify-content: space-between;
  margin: 40px 0 20px;
}

.newsList li {
  border-top: 3px solid #000;
  width: calc(32.5% - 10px);
  gap: 0 20px;
  color: #222;
  padding: 24px 0 52px;
  cursor: pointer;
}

.newsList li:hover {
  color: #5f7dff;
}

.newsList li .image-box {
  width: 100%;
  height: 200px;
}

.newsList li .empty {
  text-align: center;
  line-height: 200px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -1px;
  color: #666;
  background-color: #f7f7f7;
}

.newsList li p.title {
  margin: 12px 0;
  font-size: 22px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.newsList li .date {
  font-size: 18px;
  font-weight: 400;
  color: #666;
}

/* .popular-news h3 {
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
} */
</style>
