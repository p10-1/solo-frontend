<template>
  <div class="board-card">
    <h3>커뮤니티</h3>
    <ul>
      <li v-for="post in posts" :key="post.id" class="post-item">
        <div class="post-meta">
          <img :src="post.avatarUrl" :alt="post.author" class="avatar" />
          <span class="author">{{ post.author }}</span>
          <span class="timestamp">{{ post.timestamp }}</span>
        </div>
        <h4 class="post-title">{{ post.title }}</h4>
        <div class="post-comments">
          <span class="comments-count">{{ post.commentsCount }}</span> 댓글
        </div>
      </li>
    </ul>
    <router-link to="/board">더보기 →</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      posts: [
        {
          id: 1,
          title: '최근 자산관리를 위한 팁 공유해주세요!',
          author: '사용자1',
          avatarUrl: 'avatar1.png',
          timestamp: '15분 전',
          commentsCount: 5
        },
        {
          id: 2,
          title: '자산관리 최적화하는 방법',
          author: '사용자2',
          avatarUrl: 'avatar2.png',
          timestamp: '2시간 전',
          commentsCount: 2
        },
        {
          id: 3,
          title: '적금 상품 추천 받고 싶어요',
          author: '사용자3',
          avatarUrl: 'avatar3.png',
          timestamp: '12시간 전',
          commentsCount: 12
        }
      ]
    }
  }
}
</script>

<style scoped>
.board-card {
  width: 300px;
  padding: 20px;
  background: #f9f9f9; /* 배경색 */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); /* 부드러운 그림자 효과 */
  border: 1px solid #ddd; /* 얇은 테두리 추가 */
  transition: transform 0.3s ease; /* hover 시 애니메이션 */
}

.board-card:hover {
  transform: translateY(-5px); /* hover 시 살짝 떠오르는 효과 */
}

.board-card h3 {
  margin-top: 0;
  font-size: 1.4em;
  color: #2c3e50; /* 제목 색상 변경 */
  border-bottom: 2px solid; /* 아래에 강조선 추가 */
  padding-bottom: 10px;
}

.post-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* 각 게시글에 미세한 그림자 */
  transition: background-color 0.3s;
}

.post-item:hover {
  background-color: #f0f0f0; /* hover 시 배경색 변경 */
}

.post-meta {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.avatar {
  width: 35px; /* 아바타 크기 살짝 증가 */
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
  border: 2px solid #20c997; /* 아바타에 테두리 추가 */
}

.author {
  font-weight: bold;
  color: #2c3e50; /* 작가 이름 색상 */
}

.timestamp {
  font-size: 12px;
  color: #999; /* 시간 색상 어둡게 */
}

.post-title {
  font-size: 1.1em;
  color: #333;
  font-weight: 500;
}

.post-comments {
  font-size: 14px;
  color: #888;
  margin-top: 8px; /* 댓글 수 위쪽 여백 */
}

.comments-count {
  font-weight: bold;
  color: #333;
}

.router-link {
  display: inline-block;
  margin-top: 15px;
  text-align: right;
  color: #3498db;
  font-weight: bold;
  transition: color 0.3s ease;
}

.router-link:hover {
  color: #2980b9; /* hover 시 링크 색상 변경 */
}
</style>
