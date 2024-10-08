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

    <div class="news-container margin-top-1rem">
      <div class="news-item" v-for="news in filteredNewsList" :key="news.no">
        <a :href="news.link" target="_blank">
          <div class="image-title-cell">
            <img v-if="news.imageUrl" :src="news.imageUrl" alt="뉴스 이미지" class="news-image" />
            <div class="title">
              {{ news.title }}
              <div class="pub-date">{{ formatDate(news.pubDate) }}</div>
            </div>
          </div>
        </a>
      </div>
    </div>

    <div v-if="loading" class="loading margin-top-3rem">
      <i class="fa-solid fa-spinner margin-bottom-1rem"></i><br />로딩 중...
    </div>
    <div v-if="noMoreData" class="no-more">
      <i class="fa-solid fa-xmark argin-bottom-1rem"></i><br />정책이 더 이상 없습니다.
    </div>
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
  const date = new Date(dateString)
  return date.toISOString().split('T')[0] // YYYY-MM-DD 형식으로 반환
}
// const formatDate = (dateString) => {
//   const isoString = dateString.replace(' ', 'T');
//   const date = new Date(isoString + 'Z');

//   return date.toLocaleDateString('ko-KR', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   });
// };

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
  gap: 17px;
}

.news-item {
  width: calc(50% - 8.5px);
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  box-shadow: 0px 0px 5px rgb(221, 214, 255);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.news-item:hover {
  transform: translateY(-5px);
  box-shadow: 0px 0px 10px rgb(205, 196, 255);
}

.news-item:hover .title {
  color: #6846f5;
  text-decoration: underline;
}

.news-item:hover .news-image {
  transform: scale(1.1);
}

.image-title-cell {
  display: flex;
  align-items: flex-start;
  height: 75px;
}

.news-image {
  border: 1px solid #eee;
  width: 140px;
  height: 100%;
  object-fit: cover;
  margin-right: 20px;
  border-radius: 4px;
  transition: transform 0.3s ease;
}

.news-item .title {
  flex-grow: 1;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  word-break: keep-all;
  line-height: 24px;
}

.pub-date {
  font-size: 1em;
  color: #929191;
  font-weight: 400;
  position: absolute;
  bottom: 1.2rem;
  letter-spacing: -0.4px;
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
