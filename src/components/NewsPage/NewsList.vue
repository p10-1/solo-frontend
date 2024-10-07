<template>
  <div class="infinite-scroll">
    <div class="filter-bar">
      <input type="radio" id="all" value="" v-model="selectedCategory" @change="resetFilter" />
      <label for="all" :class="{ active: selectedCategory === '' }">전체</label>

      <input
        type="radio"
        id="economy"
        value="경제"
        v-model="selectedCategory"
        @change="resetFilter"
      />
      <label for="economy" :class="{ active: selectedCategory === '경제' }">경제</label>

      <input
        type="radio"
        id="real-estate"
        value="부동산"
        v-model="selectedCategory"
        @change="resetFilter"
      />
      <label for="real-estate" :class="{ active: selectedCategory === '부동산' }">부동산</label>

      <input
        type="radio"
        id="stocks"
        value="증권"
        v-model="selectedCategory"
        @change="resetFilter"
      />
      <label for="stocks" :class="{ active: selectedCategory === '증권' }">증권</label>
    </div>

    <div class="news-container">
      <div class="news-item" v-for="news in filteredNewsList" :key="news.no">
        <div class="image-title-cell">
          <img v-if="news.imageUrl" :src="news.imageUrl" alt="뉴스 이미지" class="news-image" />
          <div class="title-container">
            <a :href="news.link" target="_blank">{{ news.title }}</a>
            <div class="pub-date">{{ formatDate(news.pubDate) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-if="noMoreData" class="no-more">더 이상 데이터가 없습니다.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getNews, getNewsBycategory } from '@/api/newsApi'
import { useRoute } from 'vue-router'

const newsList = ref([])
const currentPage = ref(1)
const loading = ref(false)
const noMoreData = ref(false)
const selectedCategory = ref('')

const route = useRoute()
selectedCategory.value = route.query.category || ''

// 필터링된 뉴스 리스트
const filteredNewsList = computed(() => {
  return newsList.value.filter((news) => {
    const newsCategory = news.category.trim()
    const selected = selectedCategory.value.trim()
    return selected === '' || newsCategory === selected
  })
})

// 뉴스 로드 함수
const loadNews = async () => {
  if (loading.value || noMoreData.value) return
  loading.value = true

  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    let data
    if (selectedCategory.value) {
      data = await getNewsBycategory(currentPage.value, selectedCategory.value)
    } else {
      data = await getNews(currentPage.value)
    }
    if (data.list && data.list.length > 0) {
      newsList.value = [...newsList.value, ...data.list]
      currentPage.value++
    } else {
      noMoreData.value = true
    }
  } catch (error) {
    console.error('뉴스를 불러오는 중 오류 발생', error)
  } finally {
    loading.value = false
  }
}

const resetFilter = () => {
  currentPage.value = 1
  newsList.value = []
  noMoreData.value = false
  loadNews()
}

const formatDate = (dateString) => {
  const isoString = dateString.replace(' ', 'T')
  const date = new Date(isoString + 'Z')

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

onMounted(() => {
  loadNews()
  window.addEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
  if (scrollBottom && !loading.value) {
    loadNews()
  }
}

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.news-container {
  display: flex;
  flex-wrap: wrap;
}

.news-item {
  width: 45%;
  margin: 2%;
  border-top: 2px solid #6846f5;
  border-bottom: 2px solid #cfc6fd;
  border-left: none;
  border-right: none;
  border-radius: 0;
  padding: 10px;
  box-sizing: border-box;
  height: 125px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.news-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.image-title-cell {
  display: flex;
  align-items: center;
  height: 100px;
}

.news-image {
  width: 100px;
  height: 80%;
  object-fit: cover;
}

.title-container {
  flex-grow: 1;
  margin-left: 15px;
}

.title-container a {
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.title-container a:hover {
  text-decoration: underline;
}

.pub-date {
  font-size: 0.8em;
  color: #929191;
  position: absolute;
  bottom: 10px;
  right: 10px;
}

@media (max-width: 600px) {
  .infinite-scroll {
    padding: 10px;
  }

  .filter-bar {
    flex-direction: column;
  }

  .news-item {
    width: 100%;
    margin: 0;
  }
}
</style>
