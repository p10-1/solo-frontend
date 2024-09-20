<template>
  <div class="news-list">
    <div v-for="news in newsItems" :key="news.id" class="news-item">
      <div class="news-header" @click="toggleNewsDetail(news.id)">
        <span class="news-id">{{ news.id }}</span>
        <span class="news-title">{{ news.title }}</span>
        <span class="news-date">{{ news.date }}</span>
      </div>
      <NewsDetail v-if="expandedNewsId === news.id" :news="news" @close="expandedNewsId = null" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NewsDetail from '@/components/NewsPage/NewsDetail.vue'

const props = defineProps({
  newsItems: Array
})

const expandedNewsId = ref(null)

const toggleNewsDetail = (newsId) => {
  if (expandedNewsId.value === newsId) {
    expandedNewsId.value = null
  } else {
    expandedNewsId.value = newsId
  }
}
</script>

<style scoped>
.news-item {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.news-header:hover {
  background-color: #f5f5f5;
}

.news-id {
  flex: 0 0 50px;
}

.news-title {
  flex: 1;
  padding: 0 10px;
}

.news-date {
  flex: 0 0 100px;
  text-align: right;
}
</style>
