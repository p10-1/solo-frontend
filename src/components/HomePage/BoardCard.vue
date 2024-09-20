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
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.board-card h3 {
  margin-top: 0;
}

.post-item {
  margin-bottom: 20px;
}

.post-meta {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.author,
.timestamp {
  margin-right: 10px;
  font-size: 14px;
  color: #666;
}

.post-title {
  font-size: 16px;
  color: #333;
}

.post-comments {
  font-size: 14px;
  color: #888;
}

.comments-count {
  font-weight: bold;
  color: #333;
}
</style>
