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
.popular-news {
  border: 1px solid #ccc; /* 경계선 추가 */
  padding: 20px; /* 패딩 추가 */
  border-radius: 10px; /* 테두리 둥글게 */
  background: #f9f9f9; /* 배경색 추가 */
}

.popular-news h3 {
  font-size: 1.4em; /* 제목 글꼴 크기 조정 */
  color: #2c3e50; /* 제목 색상 변경 */
  margin-bottom: 16px; /* 제목 아래 여백 추가 */
}

.popular-news ul {
  list-style: none;
  padding: 0;
  margin: 0; /* 목록 여백 초기화 */
}

.popular-news li {
  padding: 10px; /* 항목 패딩 추가 */
  margin-bottom: 8px; /* 항목 간 여백 */
  background-color: white; /* 항목 배경색 */
  border-radius: 5px; /* 항목 테두리 둥글게 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 추가 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s; /* 배경색 변경 애니메이션 */
}

.popular-news li:hover {
  background-color: #f0f0f0; /* 호버 시 배경색 변경 */
}

.popular-news .date {
  font-size: 0.8em;
  color: #666;
}

.router-link {
  margin-top: 15px;
  display: block; /* 블록 레벨 요소로 변경 */
  text-align: right; /* 링크를 오른쪽으로 정렬 */
  color: #3498db; /* 링크 색상 */
  font-weight: bold; /* 글꼴 굵게 */
}
</style>
